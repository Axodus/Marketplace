import { useEffect, useMemo } from "react";
import { traceMarketplaceLifecycle } from "../services/runtimeTelemetry";

export function useMarketplaceTelemetry(scope: string, metadata: Record<string, string | number | boolean | null> = {}) {
  const metadataKey = useMemo(() => JSON.stringify(metadata), [metadata]);

  useEffect(() => {
    traceMarketplaceLifecycle(scope, "observed", metadata);
  }, [scope, metadataKey]);
}
