import { describe, expect, it } from "vitest";
import {
  connectWalletRuntime,
  disconnectWalletRuntime,
  hydrateWalletRuntime,
  switchWalletChainRuntime,
  type Eip1193Provider,
  type WalletRuntimeEnvironment
} from "./walletRuntime";

function createStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    }
  };
}

function createProvider(initialChainId = "0x89") {
  const calls: Array<{ method: string; params?: unknown[] | Record<string, unknown> }> = [];
  let accounts: string[] = [];
  let chainId = initialChainId;

  const provider: Eip1193Provider = {
    async request(args) {
      calls.push(args);
      if (args.method === "eth_accounts") return accounts;
      if (args.method === "eth_chainId") return chainId;
      if (args.method === "eth_requestAccounts") {
        accounts = ["0x1234567890abcdef1234567890abcdef12345678"];
        return accounts;
      }
      if (args.method === "wallet_switchEthereumChain") {
        const params = Array.isArray(args.params) ? (args.params[0] as { chainId?: string }) : undefined;
        chainId = params?.chainId ?? chainId;
        return null;
      }
      throw new Error(`Unexpected method ${args.method}`);
    }
  };

  return { provider, calls };
}

describe("walletRuntime", () => {
  it("hydrates disconnected readonly state without requesting signatures or transactions", async () => {
    const { provider, calls } = createProvider();
    const state = await hydrateWalletRuntime({ ethereum: provider, storage: createStorage() });

    expect(state.status).toBe("disconnected");
    expect(state.walletExecutionEnabled).toBe(false);
    expect(state.transactionExecutionEnabled).toBe(false);
    expect(state.signatureExecutionEnabled).toBe(false);
    expect(calls.map((call) => call.method)).toEqual(["eth_accounts", "eth_chainId"]);
  });

  it("connects through Reown/AppKit provider and persists the readonly session", async () => {
    const { provider, calls } = createProvider();
    const storage = createStorage();
    const env: WalletRuntimeEnvironment = {
      storage,
      reownAppKit: {
        getWalletProvider: () => provider
      }
    };

    const state = await connectWalletRuntime(env);

    expect(state.status).toBe("connected");
    expect(state.providerSource).toBe("reown-appkit");
    expect(state.chainName).toBe("Polygon");
    expect(state.shortAddress).toBe("0x1234...5678");
    expect(storage.getItem("axodus.marketplace.wallet.session")).toBe("connected");
    expect(calls.map((call) => call.method)).toEqual(["eth_requestAccounts", "eth_accounts", "eth_chainId"]);
    expect(calls.some((call) => call.method === "eth_sendTransaction" || call.method === "personal_sign")).toBe(false);
  });

  it("marks unsupported chains and supports readonly chain switching", async () => {
    const { provider, calls } = createProvider("0xa86a");
    const env = { ethereum: provider, storage: createStorage() };

    const connected = await connectWalletRuntime(env);
    expect(connected.status).toBe("restricted_chain");
    expect(connected.restrictedChain).toBe(true);

    const switched = await switchWalletChainRuntime(137, env);
    expect(switched.status).toBe("connected");
    expect(switched.chainId).toBe(137);
    expect(calls.some((call) => call.method === "wallet_switchEthereumChain")).toBe(true);
    expect(calls.some((call) => call.method === "eth_sendTransaction")).toBe(false);
  });

  it("disconnects AppKit sessions without chain writes", async () => {
    let disconnected = false;
    const storage = createStorage();
    storage.setItem("axodus.marketplace.wallet.session", "connected");

    const state = await disconnectWalletRuntime({
      storage,
      reownAppKit: {
        disconnect: async () => {
          disconnected = true;
        }
      }
    });

    expect(disconnected).toBe(true);
    expect(state.status).toBe("disconnected");
    expect(storage.getItem("axodus.marketplace.wallet.session")).toBeNull();
  });
});
