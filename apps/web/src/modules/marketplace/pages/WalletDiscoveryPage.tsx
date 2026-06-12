import { Link, useParams } from "react-router-dom";
import { BadgeCheck, FileText, KeyRound, ShieldAlert, WalletCards } from "lucide-react";
import { NeutralBadge } from "../components/StatusBadge";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";
import { useWalletDiscovery } from "../hooks/useMarketplace";
import type { DiscoveredAssetKind } from "../types/marketplace";
import type { WalletDiscoveryView } from "../services/marketplaceService";

const defaultWallet = "0xMockOwnerGovernance001";

const kindIcons: Record<DiscoveredAssetKind, React.ReactNode> = {
  nft: <WalletCards size={18} />,
  certificate: <BadgeCheck size={18} />,
  license: <FileText size={18} />
};

export function WalletDiscoveryPage() {
  const { walletAddress } = useParams();
  const selectedWallet = walletAddress ?? defaultWallet;
  const { data, isLoading } = useWalletDiscovery(selectedWallet);
  useMarketplaceTelemetry("wallet-discovery-page", { walletAddress: selectedWallet });

  if (isLoading || !data) {
    return (
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status" aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Wallet Discovery</p>
        <h1 className="mt-2 text-2xl font-semibold">Loading mock wallet discovery</h1>
        <p className="mt-2 text-sm text-slate-600">No wallet connection, signature, indexer or on-chain read is executing.</p>
      </section>
    );
  }

  const emptyOrInvalid = data.status === "empty" || data.status === "wallet-not-found" || data.status === "invalid-wallet";

  return (
    <div className="space-y-6">
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Wallet Discovery</p>
            <h1 className="mt-2 text-3xl font-semibold">Mock/read-only discovered assets</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Wallet Discovery represents NFTs, certificates and licenses associated with a mock wallet account. It does not connect a wallet,
              request signatures, verify ownership on-chain, assume custody or enable settlement.
            </p>
          </div>
          <div className="rounded border border-slate-200 bg-slate-50 p-4 text-sm">
            <p className="font-semibold text-slate-950">Mock wallet</p>
            <p className="mt-2 break-all text-slate-600">{data.walletAddress || selectedWallet}</p>
            <p className="mt-1 text-xs text-slate-500">{data.label}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <NeutralBadge>{data.status}</NeutralBadge>
          <NeutralBadge>{data.provider?.name ?? "No provider"}</NeutralBadge>
          <NeutralBadge>read-only</NeutralBadge>
          <NeutralBadge>no wallet signatures</NeutralBadge>
          <NeutralBadge>no custody</NeutralBadge>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="Discovered Asset total" value={data.summary.total} detail="mock wallet dataset" />
        <Metric label="NFT" value={data.summary.nfts} detail="NFT discovery records" />
        <Metric label="Certificates" value={data.summary.certificates} detail="credential/certificate records" />
        <Metric label="Licenses" value={data.summary.licenses} detail="license records" />
      </section>

      <section className="rounded border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldAlert size={20} />
          <h2 className="font-semibold">Discovery boundary</h2>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {data.boundaries.map((boundary) => (
            <li key={boundary}>{boundary}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Discovered Asset records</p>
            <h2 className="mt-1 text-2xl font-semibold">NFTs, certificates and licenses</h2>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link to={`/marketplace/wallet-discovery/${defaultWallet}`} className="font-semibold text-teal-700">
              Sample NFT wallet
            </Link>
            <Link to="/marketplace/wallet-discovery/0xMockAcademyHolder1155" className="font-semibold text-teal-700">
              Certificate wallet
            </Link>
            <Link to="/marketplace/wallet-discovery/0xMockMcpLicenseHolder" className="font-semibold text-teal-700">
              License wallet
            </Link>
            <Link to="/marketplace/wallet-discovery/0xMockEmptyWallet" className="font-semibold text-teal-700">
              Empty wallet
            </Link>
          </div>
        </div>

        {emptyOrInvalid ? (
          <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status">
            <h3 className="text-xl font-semibold">
              {data.status === "invalid-wallet" ? "Invalid mock wallet" : data.status === "wallet-not-found" ? "Wallet not found" : "No discovered assets"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This state is resolved from local mock data only. No Reown connection, wallet signature, ownership verification, chain read,
              indexer, subgraph, provider API, custody or settlement was attempted.
            </p>
          </section>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {data.assets.map((asset) => (
              <DiscoveredAssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function DiscoveredAssetCard({ asset }: { asset: WalletDiscoveryView["assets"][number] }) {
  return (
    <article className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex gap-4">
        {asset.image ? <img src={asset.image} alt="" className="h-24 w-24 rounded border border-slate-200 object-cover" /> : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <NeutralBadge>{asset.kind}</NeutralBadge>
            <NeutralBadge>{asset.ownershipState}</NeutralBadge>
            <NeutralBadge>{asset.validationStatus}</NeutralBadge>
            <NeutralBadge>{asset.riskClassification}</NeutralBadge>
          </div>
          <div className="mt-3 flex items-center gap-2 text-slate-950">
            {kindIcons[asset.kind]}
            <h3 className="text-lg font-semibold">{asset.name}</h3>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{asset.description}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        <Fact label="Wallet/account" value={asset.walletAddress} />
        <Fact label="Provider" value={asset.provider.name} />
        <Fact label="Origin" value={asset.origin} />
        <Fact label="Discovery source" value={asset.discoverySource} />
        <Fact label="Chain/network" value={asset.chain ?? "not applicable"} />
        <Fact label="Token standard" value={asset.tokenStandard ?? "not applicable"} />
        <Fact label="Contract" value={asset.contractAddress ?? "offchain/mock license"} />
        <Fact label="Token ID" value={asset.tokenId ?? "not applicable"} />
      </div>

      <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        <p className="font-semibold text-slate-950">Trust boundary</p>
        <p>Provenance: {asset.provenance}</p>
        <p>Execution: {asset.trustBoundary.executionState}</p>
        <p>
          Trade {asset.trustBoundary.canTrade ? "enabled" : "disabled"} / settlement {asset.trustBoundary.canSettle ? "enabled" : "disabled"} / bridge{" "}
          {asset.trustBoundary.canBridge ? "enabled" : "disabled"}
        </p>
      </div>

      <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        <p className="font-semibold">Warnings and disclaimers</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {[...asset.warnings, ...asset.disclaimers].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        {asset.product && (
          <Link to={`/marketplace/products/${asset.product.slug}`} className="font-semibold text-teal-700">
            Open product
          </Link>
        )}
        {asset.collection && (
          <Link to={`/marketplace/collections/${asset.collection.collection.slug}`} className="font-semibold text-teal-700">
            Open collection: {asset.collection.collection.name}
          </Link>
        )}
      </div>
    </article>
  );
}

function Metric({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-600">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 break-all font-semibold text-slate-800">{value}</p>
    </div>
  );
}
