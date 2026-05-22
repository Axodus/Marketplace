export interface ApiEnvelope<T> {
  data: T;
  mode: "mock-persistent";
  runtime: {
    source: "marketplace-api";
    persisted: boolean;
    settlementEnabled: false;
    walletExecutionEnabled: false;
    blockchainWritesEnabled: false;
  };
}

export interface ApiErrorEnvelope {
  error: {
    code: string;
    message: string;
    status: number;
  };
  mode: "mock-persistent";
  runtime: ApiEnvelope<unknown>["runtime"];
}

export function envelope<T>(data: T): ApiEnvelope<T> {
  return {
    data,
    mode: "mock-persistent",
    runtime: {
      source: "marketplace-api",
      persisted: true,
      settlementEnabled: false,
      walletExecutionEnabled: false,
      blockchainWritesEnabled: false
    }
  };
}
