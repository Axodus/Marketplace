import { Link, useParams } from "react-router-dom";
import { FileCode2, ShieldAlert } from "lucide-react";
import { NeutralBadge } from "../components/StatusBadge";
import { useExternalContract, useExternalContracts } from "../hooks/useMarketplace";
import { useMarketplaceTelemetry } from "../hooks/useMarketplaceTelemetry";
import type { ExternalContractView } from "../services/marketplaceService";

export function ExternalContractsPage() {
  const { contractId } = useParams();
  const listQuery = useExternalContracts();
  const detailQuery = useExternalContract(contractId);
  const contracts = listQuery.data ?? [];
  const selected = contractId ? detailQuery.data : null;
  useMarketplaceTelemetry("external-contracts-page", { contractCount: contracts.length, contractId: contractId ?? null });

  if (listQuery.isLoading) {
    return (
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status" aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">External Contracts</p>
        <h1 className="mt-2 text-2xl font-semibold">Loading Contract Import preview</h1>
        <p className="mt-2 text-sm text-slate-600">No chain read, indexer, provider API, wallet signature or contract write is executing.</p>
      </section>
    );
  }

  if (contractId && detailQuery.error) {
    return (
      <section className="rounded border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm" role="status">
        <h1 className="text-xl font-semibold">External Contract not found in mock registry</h1>
        <p className="mt-2 text-sm">
          Contract Import only resolves local mock descriptors. No provider API, indexer, subgraph, chain read, wallet signature or contract
          verification was attempted.
        </p>
        <Link to="/marketplace/contracts" className="mt-4 inline-flex text-sm font-semibold text-teal-800">
          Back to External Contracts
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">External Contracts</p>
        <h1 className="mt-2 text-3xl font-semibold">Contract Import preview</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          External Contract descriptors represent ERC721 and ERC1155 contracts in mock-first/read-only mode. They are not native Axodus
          contracts, not verified on-chain by this UI and do not enable custody, trading, settlement, wallet signatures or contract writes.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <NeutralBadge>read-only</NeutralBadge>
          <NeutralBadge>non-executing</NeutralBadge>
          <NeutralBadge>no settlement</NeutralBadge>
          <NeutralBadge>no contract writes</NeutralBadge>
          <NeutralBadge>no wallet signatures</NeutralBadge>
        </div>
      </section>

      {selected && <ContractDetail view={selected} />}

      <section className="grid gap-4 lg:grid-cols-2">
        {contracts.map((contract) => (
          <ContractCard key={contract.id} view={contract} selected={contract.id === selected?.id} />
        ))}
      </section>
    </div>
  );
}

function ContractCard({ view, selected }: { view: ExternalContractView; selected?: boolean }) {
  const { contract, collection, provider, trustBoundary, importPreview } = view;

  return (
    <article className={`rounded border bg-white p-5 shadow-sm ${selected ? "border-teal-400" : "border-slate-200"}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-950">
            <FileCode2 size={20} />
            <h2 className="text-xl font-semibold">{view.name}</h2>
          </div>
          <p className="mt-2 text-sm text-slate-600">Collection: {collection.name}</p>
        </div>
        <NeutralBadge>{contract.tokenStandard}</NeutralBadge>
      </div>

      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        <Fact label="Contract address" value={contract.contractAddress} />
        <Fact label="Chain/network" value={`${contract.chainName} / ${contract.chainId}`} />
        <Fact label="Provider" value={provider?.name ?? collection.provider?.name ?? contract.providerId} />
        <Fact label="Origin" value={trustBoundary.origin} />
        <Fact label="Validation status" value={contract.validationStatus} />
        <Fact label="Risk classification" value={contract.riskClassification} />
        <Fact label="Data source" value={importPreview.dataSource} />
        <Fact label="Last synced/imported" value={importPreview.lastSyncedAt ?? importPreview.lastImportedAt ?? "mock timestamp unavailable"} />
      </div>

      <BoundaryPanel view={view} />

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <Link to={`/marketplace/contracts/${view.id}`} className="font-semibold text-teal-700">
          Open import preview
        </Link>
        <Link to={`/marketplace/collections/${collection.slug}`} className="font-semibold text-teal-700">
          Open collection
        </Link>
      </div>
    </article>
  );
}

function ContractDetail({ view }: { view: ExternalContractView }) {
  return (
    <section className="rounded border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900 shadow-sm">
      <div className="flex items-center gap-2">
        <ShieldAlert size={20} />
        <h2 className="font-semibold">Import preview boundaries</h2>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <Fact label="Display eligibility" value={view.importPreview.displayEligible ? "eligible for controlled display" : "not displayable"} />
        <Fact label="Import status" value={view.importPreview.importStatus} />
        <Fact label="Provenance" value={view.contract.provenance} />
        <Fact label="External URL" value={view.contract.externalUrl} />
      </div>
      <div className="mt-4">
        <p className="font-semibold">Supported capabilities</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {view.importPreview.supportedCapabilities.map((capability) => (
            <NeutralBadge key={capability}>{capability}</NeutralBadge>
          ))}
        </div>
      </div>
      <ul className="mt-4 list-disc space-y-1 pl-5">
        {[...view.importPreview.warnings, ...view.importPreview.disclaimers].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function BoundaryPanel({ view }: { view: ExternalContractView }) {
  const { trustBoundary } = view;

  return (
    <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
      <p className="font-semibold text-slate-950">Trust boundary</p>
      <p>Provider: {trustBoundary.provider}</p>
      <p>Provenance: {trustBoundary.provenance}</p>
      <p>Execution: {trustBoundary.executionState}</p>
      <p>
        Trade {trustBoundary.canTrade ? "enabled" : "disabled"} / settlement {trustBoundary.canSettle ? "enabled" : "disabled"} / bridge{" "}
        {trustBoundary.canBridge ? "enabled" : "disabled"}
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {trustBoundary.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 break-all font-semibold text-slate-800">{value}</p>
    </div>
  );
}
