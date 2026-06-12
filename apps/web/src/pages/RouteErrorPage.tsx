import { useEffect } from "react";
import { Link, useRouteError } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { traceMarketplaceEvent } from "../modules/marketplace/services/runtimeTelemetry";

export function RouteErrorPage() {
  const error = useRouteError() as { status?: number; statusText?: string; message?: string };

  useEffect(() => {
    traceMarketplaceEvent({
      type: "route-error",
      scope: "router",
      status: error?.status === 404 ? "blocked" : "failed",
      message: error?.statusText || error?.message || "Marketplace route unavailable",
      metadata: { status: error?.status ?? null }
    });
  }, [error?.message, error?.status, error?.statusText]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4">
      <section className="w-full rounded border border-amber-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 text-amber-700">
          <AlertTriangle size={24} />
          <p className="text-sm font-semibold uppercase tracking-wide">Route unavailable</p>
        </div>
        <h1 className="mt-4 text-3xl font-semibold text-slate-950">
          {error?.status === 404 ? "Marketplace page not found" : "Marketplace route error"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {error?.statusText || error?.message || "The requested Marketplace route is not registered in the MVP router."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/marketplace" className="rounded bg-slate-950 px-4 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
            Marketplace home
          </Link>
          <Link to="/marketplace/create" className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
            Create / Sell
          </Link>
        </div>
      </section>
    </div>
  );
}
