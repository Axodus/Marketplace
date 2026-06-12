import type {
  EntitlementSnapshotEntity,
  LicenseRuntimeEntity,
  MarketplaceStore,
  ProductEntity,
  SubscriptionEntity
} from "../dto/contracts.js";

export function buildEntitlementSnapshot(store: MarketplaceStore, holder: string, now = new Date().toISOString()): EntitlementSnapshotEntity {
  const licenses = (store.licenseRuntimes ?? []).filter((license) => license.holder === holder);
  const subscriptions = store.subscriptions.filter((subscription) => subscription.holder === holder);
  const activeLicenses = licenses.filter((license) => license.state === "active" || license.state === "issued");
  const activeSubscriptions = subscriptions.filter((subscription) => subscription.status === "active" || subscription.status === "renewal_due");
  const ownedProducts = [...new Set([...activeLicenses.map((license) => license.productId), ...activeSubscriptions.map((subscription) => subscription.productId)])];
  const governanceRestrictions = [
    ...new Set([
      ...licenses.flatMap((license) => license.governanceRestrictions),
      ...subscriptions.flatMap((subscription) => subscription.governanceRestrictions),
      ...ownedProducts.flatMap((productId) => getProductRestrictions(store.products.find((product) => product.id === productId)))
    ])
  ];
  const tenantRestrictions = [
    ...new Set(
      ownedProducts.flatMap((productId) => {
        const product = store.products.find((item) => item.id === productId);
        const tenant = store.tenants.find((item) => item.id === product?.tenantId);
        return tenant?.governanceStanding === "warning" ? [`tenant-warning:${tenant.id}`] : [];
      })
    )
  ];

  return {
    id: `entitlement-${holder.replace(/[^a-zA-Z0-9]/g, "-")}-${Date.now()}`,
    holder,
    ownedProducts,
    activeLicenses: activeLicenses.map((license) => license.id),
    activeSubscriptions: activeSubscriptions.map((subscription) => subscription.id),
    governanceRestrictions,
    tenantRestrictions,
    deliveryPermissions: ownedProducts.map((productId) => buildDeliveryPermission(store, productId, activeLicenses, activeSubscriptions)),
    accessEnforcement: {
      licenseGatedAssetsReady: true,
      subscriptionGatedProductsReady: true,
      daoRestrictedAccessReady: true,
      governanceRestrictedAccessReady: true,
      entitlementDeliveryReady: true,
      realBlockingEnabled: false
    },
    futureMerges: {
      nftOwnershipMergeReady: true,
      walletOwnershipMergeReady: true
    },
    generatedAt: now
  };
}

function buildDeliveryPermission(
  store: MarketplaceStore,
  productId: string,
  activeLicenses: LicenseRuntimeEntity[],
  activeSubscriptions: SubscriptionEntity[]
): EntitlementSnapshotEntity["deliveryPermissions"][number] {
  const product = store.products.find((item) => item.id === productId);
  const reasons = getProductRestrictions(product);
  if (!product) {
    return {
      productId,
      deliveryType: "unknown",
      permission: "restricted-preview",
      reasons: ["product-not-found"]
    };
  }
  if (reasons.length > 0) {
    return {
      productId,
      deliveryType: String(product.deliveryType ?? "Manual Service"),
      permission: "restricted-preview",
      reasons
    };
  }
  const licenseSatisfied = activeLicenses.some((license) => license.productId === productId);
  const subscriptionSatisfied = activeSubscriptions.some((subscription) => subscription.productId === productId);
  if (product.accessModel === "subscription" && !subscriptionSatisfied) {
    return {
      productId,
      deliveryType: String(product.deliveryType ?? "Manual Service"),
      permission: "subscription-required-preview",
      reasons: ["subscription-entitlement-required"]
    };
  }
  if (!licenseSatisfied && product.accessModel !== "public") {
    return {
      productId,
      deliveryType: String(product.deliveryType ?? "Manual Service"),
      permission: "license-required-preview",
      reasons: ["license-entitlement-required"]
    };
  }
  return {
    productId,
    deliveryType: String(product.deliveryType ?? "Manual Service"),
    permission: "allowed-preview",
    reasons: ["preview-entitlement-satisfied"]
  };
}

function getProductRestrictions(product?: ProductEntity) {
  if (!product) return ["product-not-found"];
  if (product.governanceStatus === "restricted") return ["governance-restricted-product"];
  if (product.governanceStatus === "suspended") return ["governance-suspended-product"];
  if (product.visibility === "dao-gated") return ["dao-gated-product"];
  return [];
}
