import type {
  AccountingTelemetryEntity,
  InvoicePreviewEntity,
  InvoicePreviewRequest,
  MarketplaceStore,
  ProductEntity,
  SubscriptionEntity
} from "../dto/contracts.js";

export function buildInvoicePreview(store: MarketplaceStore, input: InvoicePreviewRequest, now = new Date().toISOString()): InvoicePreviewEntity {
  const buyer = input.buyer ?? "0xMockBuyer...A11C";
  const products = (input.productIds ?? []).map((productId) => findProduct(store, productId));
  const subscriptions = (input.subscriptionIds ?? []).map((subscriptionId) => findSubscription(store, subscriptionId));
  const subscriptionProducts = subscriptions.map((subscription) => findProduct(store, subscription.productId));
  const lineProducts = [...products, ...subscriptionProducts];
  const lineItems = [
    ...products.map((product) => createProductLineItem(product)),
    ...subscriptions.map((subscription) => createSubscriptionLineItem(store, subscription))
  ];
  const subtotal = round(lineItems.reduce((sum, item) => sum + item.subtotal, 0));
  const royaltyPreview = round(lineProducts.reduce((sum, product) => sum + royaltyAmount(product), 0));
  const platformFeePreview = round(subtotal * 0.025);
  const ecosystemFeePreview = round(subtotal * 0.01);
  const treasurySplitPreview = round(platformFeePreview + ecosystemFeePreview);
  const creatorSplitPreview = round(subtotal - royaltyPreview - platformFeePreview - ecosystemFeePreview);

  return {
    id: `marketplace-invoice-${crypto.randomUUID()}`,
    buyer,
    state: "preview",
    productReferences: [...new Set(lineProducts.map((product) => product.id))],
    subscriptionReferences: subscriptions.map((subscription) => subscription.id),
    lineItems,
    subtotal,
    currency: lineItems[0]?.currency ?? "USDC",
    royaltyPreview,
    platformFeePreview,
    treasurySplitPreview,
    creatorSplitPreview,
    ecosystemFeePreview,
    taxPlaceholder: {
      enabled: false,
      jurisdiction: "preview-unset",
      amount: 0
    },
    totalPreview: subtotal,
    reconciliation: {
      state: "preview_unreconciled",
      externalPaymentId: null,
      settlementTxHash: null,
      treasuryExecutionEnabled: false
    },
    settlementEnabled: false,
    treasuryExecutionEnabled: false,
    createdAt: now,
    updatedAt: now
  };
}

export function buildAccountingTelemetry(invoice: InvoicePreviewEntity, type: AccountingTelemetryEntity["type"]): AccountingTelemetryEntity {
  return {
    id: `marketplace-accounting-${crypto.randomUUID()}`,
    invoiceId: invoice.id,
    type,
    amount: invoice.totalPreview,
    currency: invoice.currency,
    settlementPreviewTrace: `preview:${invoice.id}:${invoice.state}`,
    reconciliationState: invoice.reconciliation.state,
    createdAt: new Date().toISOString()
  };
}

function createProductLineItem(product: ProductEntity): InvoicePreviewEntity["lineItems"][number] {
  const pricing = getPricing(product);
  return {
    id: `line-${product.id}`,
    label: String(product.title),
    productId: product.id,
    quantity: 1,
    unitAmount: pricing.amount,
    currency: pricing.currency,
    subtotal: pricing.amount
  };
}

function createSubscriptionLineItem(store: MarketplaceStore, subscription: SubscriptionEntity): InvoicePreviewEntity["lineItems"][number] {
  const product = findProduct(store, subscription.productId);
  const pricing = getPricing(product);
  return {
    id: `line-${subscription.id}`,
    label: `${subscription.plan} renewal preview`,
    productId: product.id,
    subscriptionId: subscription.id,
    quantity: 1,
    unitAmount: pricing.amount,
    currency: pricing.currency,
    subtotal: pricing.amount
  };
}

function findProduct(store: MarketplaceStore, productId: string) {
  const product = store.products.find((item) => item.id === productId || item.slug === productId);
  if (!product) throw new Error(`Invoice product not found: ${productId}`);
  return product;
}

function findSubscription(store: MarketplaceStore, subscriptionId: string) {
  const subscription = store.subscriptions.find((item) => item.id === subscriptionId);
  if (!subscription) throw new Error(`Invoice subscription not found: ${subscriptionId}`);
  return subscription;
}

function getPricing(product: ProductEntity) {
  const pricing = product.pricing as { amount?: number; currency?: string } | undefined;
  return {
    amount: Number(pricing?.amount ?? 0),
    currency: pricing?.currency ?? "USDC"
  };
}

function royaltyAmount(product: ProductEntity) {
  const pricing = getPricing(product);
  const royalty = product.royaltyModel as { bps?: number } | undefined;
  return (pricing.amount * Number(royalty?.bps ?? 0)) / 10_000;
}

function round(value: number) {
  return Number(value.toFixed(4));
}
