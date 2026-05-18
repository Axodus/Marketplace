import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ExternalLink, FileCheck, Gavel, Link2, PackageCheck, ShieldCheck } from "lucide-react";
import { PurchaseModal } from "../components/PurchaseModal";
import { NeutralBadge, ProductStandingBadge, SellerStandingBadge } from "../components/StatusBadge";
import { useProduct } from "../hooks/useMarketplace";
import { LayerZeroBridgeService, RoyaltyService, StorageAccessService } from "../services/boundaryAdapters";

export function ProductDetailPage() {
  const { slug } = useParams();
  const { data, error } = useProduct(slug);
  const [purchaseOpen, setPurchaseOpen] = useState(false);

  if (error) return <p className="rounded border border-red-200 bg-red-50 p-4 text-red-800">Product not found.</p>;
  if (!data) return null;

  const { product, seller } = data;
  const royalty = RoyaltyService.preview(product);
  const bridge = LayerZeroBridgeService.readiness(product);
  const signedUrl = StorageAccessService.previewSignedUrl(product);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <img src={product.images[0]} alt="" className="h-full min-h-96 rounded border border-slate-200 object-cover shadow-sm" />
        <div className="rounded border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <ProductStandingBadge status={product.governanceStatus} />
            <NeutralBadge>{product.tokenStandard}</NeutralBadge>
            <NeutralBadge>{product.listingType}</NeutralBadge>
            <NeutralBadge>{product.maturity}</NeutralBadge>
          </div>
          <h1 className="mt-4 text-4xl font-semibold">{product.title}</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">{product.description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Info label="Price" value={`${product.pricing.amount} ${product.pricing.currency}`} />
            <Info label="Royalty" value={`${royalty.amount} ${royalty.currency} to ${royalty.recipient}`} />
            <Info label="Delivery" value={product.deliveryType} />
            <Info label="Access" value={product.accessModel} />
          </div>
          <button
            type="button"
            onClick={() => setPurchaseOpen(true)}
            className="mt-6 w-full rounded bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Open buy-now / bid preview
          </button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Panel icon={<ShieldCheck />} title="Governance validation">
          <p>Product standing: {product.governanceStatus}</p>
          <p>Constitutional standing: {product.constitutionalStanding}</p>
          <p>Review required: {product.governanceRequired ? "yes" : "no"}</p>
        </Panel>
        <Panel icon={<Gavel />} title="NFT listing">
          <p>Token: {product.tokenStandard}</p>
          <p>Contract: {product.contractAddress ?? "mock offchain license"}</p>
          <p>Token ID: {product.tokenId ?? "not minted in MVP"}</p>
        </Panel>
        <Panel icon={<PackageCheck />} title="Greenfield delivery">
          <p>Bucket: {product.greenfieldBucket ?? "not required"}</p>
          <p>Signed URL preview: {signedUrl ? "available after mock purchase" : "not available"}</p>
        </Panel>
        <Panel icon={<Link2 />} title="LayerZero readiness">
          <p>Ready: {bridge.layerZeroReady ? "yes" : "no"}</p>
          <p>Source: {bridge.sourceChain}</p>
          <p>Destinations: {bridge.destinationChains.join(", ") || "none"}</p>
        </Panel>
        <Panel icon={<FileCheck />} title="License">
          <p>Type: {product.licenseType}</p>
          <p>NFT bound: {product.nftBound ? "yes" : "no"}</p>
          <p>Visibility: {product.visibility}</p>
        </Panel>
        {seller && (
          <Panel icon={<ExternalLink />} title="Seller">
            <Link to={`/marketplace/sellers/${seller.id}`} className="font-semibold text-teal-700">
              {seller.name}
            </Link>
            <div className="mt-2">
              <SellerStandingBadge status={seller.governanceStanding} />
            </div>
            <p className="mt-2">Reputation: {seller.reputation}/100</p>
          </Panel>
        )}
      </section>

      {purchaseOpen && <PurchaseModal product={product} onClose={() => setPurchaseOpen(false)} />}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function Panel({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-slate-950">
        {icon}
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="mt-3 space-y-1 text-sm leading-6 text-slate-600">{children}</div>
    </div>
  );
}
