import { useState } from "react";
import { CheckCircle2, FilePlus2 } from "lucide-react";
import { MarketplaceContractAdapter } from "../services/boundaryAdapters";
import type { DraftListingInput, DraftListingPreview } from "../types/marketplace";

const initialInput: DraftListingInput = {
  title: "Mock ERC721 governance access pass",
  category: "Digital Assets",
  tokenStandard: "ERC721",
  listingType: "fixed",
  chain: "Polygon",
  price: 100,
  currency: "USDC",
  royaltyBps: 500,
  deliveryType: "Signed URL",
  governanceReviewRequired: true,
  description: "Create/sell preview for an NFT-bound Marketplace listing."
};

export function CreateSellPage() {
  const [input, setInput] = useState<DraftListingInput>(initialInput);
  const [preview, setPreview] = useState<DraftListingPreview | null>(null);

  async function submitPreview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await MarketplaceContractAdapter.createDraftListing(input);
    setPreview(result.preview);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Create / Sell</p>
        <h1 className="mt-2 text-3xl font-semibold">NFT listing draft preview</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          This flow prepares fixed listings and auctions for ERC721/1155 assets. It validates governance metadata and adapter payloads
          without minting, signing, listing or settling on-chain.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <form onSubmit={submitPreview} className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title">
              <input
                value={input.title}
                onChange={(event) => setInput((current) => ({ ...current, title: event.target.value }))}
                className="w-full rounded border border-slate-300 px-3 py-2"
              />
            </Field>
            <Field label="Category">
              <select
                value={input.category}
                onChange={(event) => setInput((current) => ({ ...current, category: event.target.value as DraftListingInput["category"] }))}
                className="w-full rounded border border-slate-300 px-3 py-2"
              >
                {["Education", "Governance", "Trading", "Business", "MCPs", "Digital Assets"].map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </Field>
            <Field label="Token standard">
              <select
                value={input.tokenStandard}
                onChange={(event) =>
                  setInput((current) => ({ ...current, tokenStandard: event.target.value as DraftListingInput["tokenStandard"] }))
                }
                className="w-full rounded border border-slate-300 px-3 py-2"
              >
                {["ERC721", "ERC1155"].map((standard) => (
                  <option key={standard}>{standard}</option>
                ))}
              </select>
            </Field>
            <Field label="Listing type">
              <select
                value={input.listingType}
                onChange={(event) =>
                  setInput((current) => ({ ...current, listingType: event.target.value as DraftListingInput["listingType"] }))
                }
                className="w-full rounded border border-slate-300 px-3 py-2"
              >
                {["fixed", "english-auction", "dutch-auction"].map((listingType) => (
                  <option key={listingType}>{listingType}</option>
                ))}
              </select>
            </Field>
            <Field label="Chain">
              <select
                value={input.chain}
                onChange={(event) => setInput((current) => ({ ...current, chain: event.target.value as DraftListingInput["chain"] }))}
                className="w-full rounded border border-slate-300 px-3 py-2"
              >
                {["Ethereum", "BNB", "Arbitrum", "Harmony", "Polygon"].map((chain) => (
                  <option key={chain}>{chain}</option>
                ))}
              </select>
            </Field>
            <Field label="Delivery">
              <select
                value={input.deliveryType}
                onChange={(event) =>
                  setInput((current) => ({ ...current, deliveryType: event.target.value as DraftListingInput["deliveryType"] }))
                }
                className="w-full rounded border border-slate-300 px-3 py-2"
              >
                {["Greenfield", "Signed URL", "MCP Runtime", "Dashboard Access", "Manual Service"].map((delivery) => (
                  <option key={delivery}>{delivery}</option>
                ))}
              </select>
            </Field>
            <Field label="Price">
              <input
                type="number"
                min="0"
                value={input.price}
                onChange={(event) => setInput((current) => ({ ...current, price: Number(event.target.value) }))}
                className="w-full rounded border border-slate-300 px-3 py-2"
              />
            </Field>
            <Field label="Royalty bps">
              <input
                type="number"
                min="0"
                max="10000"
                value={input.royaltyBps}
                onChange={(event) => setInput((current) => ({ ...current, royaltyBps: Number(event.target.value) }))}
                className="w-full rounded border border-slate-300 px-3 py-2"
              />
            </Field>
          </div>
          <label className="mt-4 block space-y-1 text-sm">
            <span className="font-medium text-slate-700">Description</span>
            <textarea
              value={input.description}
              onChange={(event) => setInput((current) => ({ ...current, description: event.target.value }))}
              className="min-h-28 w-full rounded border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={input.governanceReviewRequired}
              onChange={(event) => setInput((current) => ({ ...current, governanceReviewRequired: event.target.checked }))}
            />
            Require governance review before activation
          </label>
          <button type="submit" className="mt-5 flex items-center gap-2 rounded bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
            <FilePlus2 size={18} /> Generate listing preview
          </button>
        </form>

        <aside className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Adapter boundary</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The submit action calls `MarketplaceContractAdapter.createDraftListing`. It returns a payload preview only; no NFT is minted
            and no contract write is sent.
          </p>
          {preview ? (
            <div className="mt-5 rounded border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 size={18} /> {preview.status}
              </div>
              <dl className="mt-3 space-y-2">
                <Row label="Draft ID" value={preview.id} />
                <Row label="Action" value={preview.contractAdapterAction} />
                <Row label="Tx preview" value={preview.txPreview} />
                <Row label="Royalty preview" value={`${preview.royaltyPreviewAmount} ${input.currency}`} />
              </dl>
            </div>
          ) : (
            <div className="mt-5 rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Preview output will appear here after validation.
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <dt className="font-medium">{label}</dt>
      <dd className="break-all">{value}</dd>
    </div>
  );
}
