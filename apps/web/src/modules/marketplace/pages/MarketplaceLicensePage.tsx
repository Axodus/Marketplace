import { useLicenses } from "../hooks/useMarketplace";

export function MarketplaceLicensePage() {
  const { data } = useLicenses();
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Licensing</p>
        <h1 className="mt-2 text-3xl font-semibold">NFT and product license registry</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {data.licenses.map((license) => (
          <article key={license.id} className="rounded border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">{license.ownershipModel}</p>
            <h2 className="mt-2 text-xl font-semibold">{license.type}</h2>
            <dl className="mt-4 space-y-2 text-sm text-slate-600">
              <Row label="Transferable" value={license.transferable ? "yes" : "no"} />
              <Row label="Revokable" value={license.revokable ? "yes" : "no"} />
              <Row label="NFT bound" value={license.nftBound ? "yes" : "no"} />
              <Row label="Governance" value={license.governanceControlled ? "controlled" : "not controlled"} />
              <Row label="Expiration" value={license.expiration ?? "none"} />
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              {license.permissions.map((permission) => (
                <span key={permission} className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">
                  {permission}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt>{label}</dt>
      <dd className="font-medium text-slate-900">{value}</dd>
    </div>
  );
}
