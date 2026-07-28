import { useState } from "react";
import { BadgeCheck, Clock3, ImageOff, Layers3 } from "lucide-react";
import { Link } from "react-router-dom";
import type { GovernanceEnforcementRecord } from "../../../services/apiClient";
import type { Product, Seller } from "../types/marketplace";
import { getCollectionForProduct } from "../services/marketplaceService";

export interface ProductCardIndicator {
  label: string;
  tone: "neutral" | "trusted" | "warning";
}

export interface ProductCardViewModel {
  slug: string;
  detailPath?: string;
  title: string;
  category: string;
  image?: string;
  imageAlt: string;
  seller?: { id: string; name: string; trusted: boolean };
  collection?: { slug: string; name: string };
  identityLabel?: string;
  price: string;
  network: string;
  listingMeta?: string;
  indicators: ProductCardIndicator[];
}

export function buildProductCardViewModel(
  product: Product,
  seller?: Seller,
  enforcement?: GovernanceEnforcementRecord,
  now = new Date()
): ProductCardViewModel {
  const collection = getCollectionForProduct(product);
  const listingLabel = getListingLabel(product);
  const governanceLabel = getGovernanceLabel(product, enforcement);
  const indicators: ProductCardIndicator[] = [
    governanceLabel,
    { label: listingLabel, tone: "neutral" as const },
    { label: product.tokenStandard, tone: "neutral" as const }
  ].filter((value): value is ProductCardIndicator => Boolean(value)).slice(0, 2);

  return {
    slug: product.slug,
    title: product.title,
    category: product.category,
    image: product.images[0]?.trim() || undefined,
    imageAlt: `${product.title} product preview`,
    seller: seller
      ? {
          id: seller.id,
          name: seller.name,
          trusted: seller.verificationStatus === "verified" || seller.verificationStatus === "internal"
        }
      : undefined,
    collection: collection ? { slug: collection.collection.slug, name: collection.collection.name } : undefined,
    price: `${formatPrice(product.pricing.amount)} ${product.pricing.currency}`,
    network: product.supportedChains[0] ?? "Off-chain",
    listingMeta: getListingMeta(product, now),
    indicators
  };
}

export function ProductCard({
  product,
  seller,
  enforcement
}: {
  product: Product;
  seller?: Seller;
  enforcement?: GovernanceEnforcementRecord;
}) {
  const view = buildProductCardViewModel(product, seller, enforcement);

  return <MarketplaceProductCard view={view} />;
}

export function MarketplaceProductCard({ view }: { view: ProductCardViewModel }) {
  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-marketplace-border bg-marketplace-surface transition-colors hover:border-marketplace-border-strong focus-within:border-marketplace-graphite">
      <ProductMedia image={view.image} alt={view.imageAlt} />
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-marketplace-text-muted">{view.category}</p>
        <Link
          to={view.detailPath ?? `/marketplace/products/${view.slug}`}
          className="mt-1 line-clamp-2 text-base font-semibold leading-snug text-marketplace-graphite focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marketplace-focus"
        >
          {view.title}
        </Link>

        <div className="mt-2 min-h-5 text-xs text-marketplace-text-muted">
          {view.seller ? (
            <Link
              to={`/marketplace/sellers/${view.seller.id}`}
              className="inline-flex items-center gap-1 hover:text-marketplace-text focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-marketplace-focus"
            >
              {view.seller.name}
              {view.seller.trusted ? <BadgeCheck size={14} className="text-marketplace-trusted" aria-label="Verified seller" /> : null}
            </Link>
          ) : view.collection ? (
            <Link to={`/marketplace/collections/${view.collection.slug}`} className="hover:text-marketplace-text">
              {view.collection.name}
            </Link>
          ) : (
            <span>{view.identityLabel ?? "Marketplace seller unavailable"}</span>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[0.68rem] uppercase tracking-wide text-marketplace-text-muted">Price</p>
            <p className="mt-0.5 font-semibold tabular-nums text-marketplace-graphite">{view.price}</p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs text-marketplace-text-muted">
            <Layers3 size={14} aria-hidden="true" /> {view.network}
          </span>
        </div>

        <div className="mt-2 min-h-5">
          {view.listingMeta ? (
            <p className="inline-flex items-center gap-1 text-xs text-marketplace-text-muted">
              <Clock3 size={13} aria-hidden="true" /> {view.listingMeta}
            </p>
          ) : null}
        </div>

        <div className="mt-auto flex min-h-8 flex-wrap items-end gap-1.5 pt-3" aria-label="Product indicators">
          {view.indicators.map((indicator) => (
            <span
              key={indicator.label}
              className={`rounded-md border px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wide ${indicatorClass[indicator.tone]}`}
            >
              {indicator.label}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function ProductMedia({ image, alt }: { image?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  const showFallback = !image || failed;

  return (
    <div className="aspect-[4/3] w-full overflow-hidden bg-marketplace-muted">
      {showFallback ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-marketplace-text-muted" role="img" aria-label={alt}>
          <ImageOff size={28} aria-hidden="true" />
          <span className="text-xs font-medium">Preview unavailable</span>
        </div>
      ) : (
        <img
          src={image}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.015]"
        />
      )}
    </div>
  );
}

function getGovernanceLabel(product: Product, enforcement?: GovernanceEnforcementRecord): ProductCardIndicator | undefined {
  if (enforcement && enforcement.visibility.effectiveState !== "visible") {
    return { label: enforcement.visibility.effectiveState.replaceAll("-", " "), tone: "warning" };
  }
  if (product.governanceStatus === "compliant") return undefined;
  if (product.governanceStatus === "under-review") return { label: "Review required", tone: "warning" };
  return { label: product.governanceStatus.replaceAll("-", " "), tone: "warning" };
}

function getListingLabel(product: Product) {
  if (product.listingType === "english-auction") return "English auction";
  if (product.listingType === "dutch-auction") return "Dutch auction";
  if (product.accessModel === "subscription" || product.licenseType.toLowerCase().includes("subscription")) return "Subscription";
  if (product.listingType === "license-preview" || product.tokenStandard === "OffchainLicense") return "License";
  if (product.category === "Governance") return "Access";
  return "Fixed price";
}

function getListingMeta(product: Product, now: Date) {
  if (!product.auction) return undefined;
  const bidLabel = `${product.auction.bidCount} ${product.auction.bidCount === 1 ? "bid" : "bids"}`;
  const ending = new Date(product.auction.endsAt);
  if (Number.isNaN(ending.getTime())) return bidLabel;
  const dateLabel = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(ending);
  return `${bidLabel} · ${ending.getTime() <= now.getTime() ? "Ended" : "Ends"} ${dateLabel}`;
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(amount);
}

const indicatorClass: Record<ProductCardIndicator["tone"], string> = {
  neutral: "border-marketplace-border bg-marketplace-muted text-marketplace-text",
  trusted: "border-marketplace-trusted/40 bg-marketplace-trusted/10 text-marketplace-trusted",
  warning: "border-marketplace-accent/50 bg-marketplace-accent/10 text-marketplace-accent-text"
};
