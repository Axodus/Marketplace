import { Link } from "react-router-dom";
import { FileCheck, History, KeyRound, Layers, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { AssetHistoryEntry, ProductStanding } from "../types/marketplace";
import type { AssetRegistryView } from "../services/marketplaceService";
import { NeutralBadge, ProductStandingBadge } from "./StatusBadge";

export function AssetRegistryPanel({ view }: { view: AssetRegistryView }) {
  const { product, collection, seller, license, registry, metadataAttributes, boundaries } = view;

  return (
    <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Asset Registry</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">{product.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Mock-first registry view for ownership, transfers, license state, metadata visibility and validation boundaries.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <NeutralBadge>{product.tokenStandard}</NeutralBadge>
          <NeutralBadge>{product.supportedChains[0] ?? "mock-chain"}</NeutralBadge>
          <NeutralBadge>{product.listingType}</NeutralBadge>
          <ProductStandingBadge status={registry.validation.origin} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <RegistryFact label="Current owner" value={registry.currentOwner} />
        <RegistryFact label="Token ID" value={product.tokenId ?? "not minted in MVP"} />
        <RegistryFact label="Contract" value={product.contractAddress ?? "mock offchain license"} />
        <RegistryFact label="Royalty preview" value={`${product.royaltyModel.standard} / ${product.royaltyModel.bps} bps`} />
        <RegistryFact label="Listing status" value={product.status} />
        <RegistryFact label="Price" value={`${product.pricing.amount} ${product.pricing.currency}`} />
        <RegistryFact label="License" value={license ? `${license.type} / ${license.ownershipModel}` : product.licenseType} />
        <RegistryFact label="Auction" value={product.auction ? `${product.auction.status} / ${product.auction.bidCount} bids` : "not auctioned"} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-950">
            <Layers className="h-4 w-4" />
            <h3 className="font-semibold">Relationships</h3>
          </div>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            {collection ? (
              <Link to={`/marketplace/collections/${collection.collection.slug}`} className="block font-semibold text-teal-700">
                Collection: {collection.collection.name}
              </Link>
            ) : (
              <p>Collection: no collection linked</p>
            )}
            {seller ? (
              <Link to={`/marketplace/sellers/${seller.id}`} className="block font-semibold text-teal-700">
                Seller: {seller.name}
              </Link>
            ) : (
              <p>Seller: no seller linked</p>
            )}
            <p>Creator boundary: represented by seller mock data</p>
          </div>
        </div>

        <div className="rounded border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-950">
            <ShieldCheck className="h-4 w-4" />
            <h3 className="font-semibold">Validation Layer</h3>
          </div>
          <div className="mt-3 grid gap-2 text-sm">
            <ValidationRow label="Metadata" status={registry.validation.metadata} />
            <ValidationRow label="Contract" status={registry.validation.contract} />
            <ValidationRow label="Collection" status={registry.validation.collection} />
            <ValidationRow label="Origin" status={registry.validation.origin} />
            <ValidationRow label="Royalty" status={registry.validation.royalty} />
          </div>
          <ul className="mt-3 space-y-1 text-sm text-slate-600">
            {registry.validation.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>

        <div className="rounded border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-950">
            <FileCheck className="h-4 w-4" />
            <h3 className="font-semibold">Metadata Attributes</h3>
          </div>
          {metadataAttributes.length ? (
            <div className="mt-3 grid gap-2">
              {metadataAttributes.map((attribute) => (
                <RegistryFact key={`${attribute.traitType}-${attribute.value}`} label={attribute.traitType} value={attribute.value} />
              ))}
            </div>
          ) : (
            <EmptyState>No metadata attributes are present in the mock registry.</EmptyState>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <HistorySection
          icon={<History className="h-4 w-4" />}
          title="Ownership History"
          entries={registry.ownershipHistory}
          empty="No ownership history exists for this mock asset."
          render={(entry) => <p>Owner: {entry.owner}</p>}
        />
        <HistorySection
          icon={<Layers className="h-4 w-4" />}
          title="Transfer History"
          entries={registry.transferHistory}
          empty="No transfer history exists for this mock asset."
          render={(entry) => (
            <>
              <p>From: {entry.from}</p>
              <p>To: {entry.to}</p>
              <p>Chain: {entry.chain}</p>
            </>
          )}
        />
        <HistorySection
          icon={<KeyRound className="h-4 w-4" />}
          title="License History"
          entries={registry.licenseHistory}
          empty="No license history exists for this mock asset."
          render={(entry) => (
            <>
              <p>Holder: {entry.holder}</p>
              <p>License: {entry.licenseType}</p>
            </>
          )}
        />
      </div>

      <div className="mt-6 rounded border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-slate-950">
          <ShieldCheck className="h-4 w-4" />
          <h3 className="font-semibold">Execution Boundaries</h3>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {boundaries.map((boundary) => (
            <div key={boundary.label} className="rounded border border-slate-200 bg-white p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{boundary.label}</p>
              <p className="mt-1 font-semibold text-slate-950">{boundary.value}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{boundary.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegistryFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 break-words font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function ValidationRow({ label, status }: { label: string; status: ProductStanding }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded border border-slate-200 bg-white p-2">
      <span className="font-medium text-slate-600">{label}</span>
      <ProductStandingBadge status={status} />
    </div>
  );
}

function HistorySection<TEntry extends AssetHistoryEntry>({
  icon,
  title,
  entries,
  empty,
  render
}: {
  icon: ReactNode;
  title: string;
  entries: TEntry[];
  empty: string;
  render: (entry: TEntry) => ReactNode;
}) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-950">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      {entries.length ? (
        <div className="mt-3 space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="rounded border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-600">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <NeutralBadge>{entry.status}</NeutralBadge>
                <NeutralBadge>{new Date(entry.timestamp).toLocaleDateString("en-US")}</NeutralBadge>
              </div>
              {render(entry)}
              <p>Actor: {entry.actor}</p>
              <p>{entry.note}</p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState>{empty}</EmptyState>
      )}
    </div>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return <p className="mt-3 rounded border border-dashed border-slate-300 bg-white p-3 text-sm text-slate-500">{children}</p>;
}
