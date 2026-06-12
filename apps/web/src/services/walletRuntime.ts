export type WalletRuntimeStatus = "disconnected" | "connecting" | "connected" | "unsupported_chain" | "restricted_chain" | "error";

export type WalletProviderSource = "reown-appkit" | "eip1193" | "unavailable";

export type WalletChain = {
  id: number;
  hexId: `0x${string}`;
  name: string;
  supported: boolean;
  restricted: boolean;
  rpcReady: boolean;
};

export type WalletRuntimeState = {
  status: WalletRuntimeStatus;
  address: string | null;
  shortAddress: string | null;
  chainId: number | null;
  chainName: string;
  supportedChain: boolean;
  restrictedChain: boolean;
  disconnected: boolean;
  persisted: boolean;
  providerSource: WalletProviderSource;
  walletExecutionEnabled: false;
  transactionExecutionEnabled: false;
  signatureExecutionEnabled: false;
  lastError: string | null;
};

export type Eip1193Provider = {
  request(args: { method: string; params?: unknown[] | Record<string, unknown> }): Promise<unknown>;
  on?: (event: "accountsChanged" | "chainChanged" | "disconnect", listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: "accountsChanged" | "chainChanged" | "disconnect", listener: (...args: unknown[]) => void) => void;
};

export type WalletRuntimeEnvironment = {
  ethereum?: Eip1193Provider;
  reownAppKit?: {
    open?: () => Promise<void> | void;
    disconnect?: () => Promise<void> | void;
    getWalletProvider?: () => Eip1193Provider | undefined;
  };
  storage?: Pick<Storage, "getItem" | "setItem" | "removeItem">;
};

const WALLET_SESSION_KEY = "axodus.marketplace.wallet.session";

export const MARKETPLACE_SUPPORTED_CHAINS: WalletChain[] = [
  { id: 1, hexId: "0x1", name: "Ethereum", supported: true, restricted: false, rpcReady: true },
  { id: 137, hexId: "0x89", name: "Polygon", supported: true, restricted: false, rpcReady: true },
  { id: 42161, hexId: "0xa4b1", name: "Arbitrum One", supported: true, restricted: false, rpcReady: true },
  { id: 56, hexId: "0x38", name: "BNB Smart Chain", supported: true, restricted: false, rpcReady: true },
  { id: 43114, hexId: "0xa86a", name: "Avalanche", supported: false, restricted: true, rpcReady: false }
];

const disconnectedState: WalletRuntimeState = {
  status: "disconnected",
  address: null,
  shortAddress: null,
  chainId: null,
  chainName: "No wallet",
  supportedChain: false,
  restrictedChain: false,
  disconnected: true,
  persisted: false,
  providerSource: "unavailable",
  walletExecutionEnabled: false,
  transactionExecutionEnabled: false,
  signatureExecutionEnabled: false,
  lastError: null
};

function getBrowserEnvironment(): WalletRuntimeEnvironment {
  if (typeof window === "undefined") return {};
  const candidate = window as Window &
    typeof globalThis & {
      ethereum?: Eip1193Provider;
      reownAppKit?: WalletRuntimeEnvironment["reownAppKit"];
      appKit?: WalletRuntimeEnvironment["reownAppKit"];
    };

  return {
    ethereum: candidate.ethereum,
    reownAppKit: candidate.reownAppKit ?? candidate.appKit,
    storage: candidate.localStorage
  };
}

export function normalizeChainId(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  if (value.startsWith("0x")) return Number.parseInt(value, 16);
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function getWalletChain(chainId: number | null): WalletChain | null {
  if (!chainId) return null;
  return MARKETPLACE_SUPPORTED_CHAINS.find((chain) => chain.id === chainId) ?? null;
}

export function toChainHexId(chainId: number): `0x${string}` {
  return `0x${chainId.toString(16)}`;
}

export function shortenAddress(address: string | null): string | null {
  if (!address) return null;
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getStoredSession(storage: WalletRuntimeEnvironment["storage"]): boolean {
  if (!storage) return false;
  return storage.getItem(WALLET_SESSION_KEY) === "connected";
}

function persistSession(storage: WalletRuntimeEnvironment["storage"], connected: boolean) {
  if (!storage) return;
  if (connected) storage.setItem(WALLET_SESSION_KEY, "connected");
  else storage.removeItem(WALLET_SESSION_KEY);
}

async function getReownProvider(env: WalletRuntimeEnvironment): Promise<Eip1193Provider | undefined> {
  if (env.reownAppKit?.getWalletProvider) return env.reownAppKit.getWalletProvider();

  try {
    const packageName = "@reown/appkit";
    const reownModule = (await import(/* @vite-ignore */ packageName)) as {
      getAppKit?: () => { getWalletProvider?: () => Eip1193Provider | undefined };
    };
    return reownModule.getAppKit?.().getWalletProvider?.();
  } catch {
    return undefined;
  }
}

async function resolveProvider(env: WalletRuntimeEnvironment): Promise<{ provider?: Eip1193Provider; source: WalletProviderSource }> {
  const reownProvider = await getReownProvider(env);
  if (reownProvider) return { provider: reownProvider, source: "reown-appkit" };
  if (env.ethereum) return { provider: env.ethereum, source: "eip1193" };
  return { source: "unavailable" };
}

async function readWalletState(provider: Eip1193Provider, source: WalletProviderSource, persisted: boolean): Promise<WalletRuntimeState> {
  const [accountsValue, chainValue] = await Promise.all([
    provider.request({ method: "eth_accounts" }),
    provider.request({ method: "eth_chainId" })
  ]);
  const accounts = Array.isArray(accountsValue) ? accountsValue.filter((account): account is string => typeof account === "string") : [];
  const address = accounts[0] ?? null;
  const chainId = normalizeChainId(chainValue);
  const chain = getWalletChain(chainId);
  const supportedChain = Boolean(chain?.supported);
  const restrictedChain = Boolean(chain?.restricted) || Boolean(chainId && !chain);

  if (!address) {
    return { ...disconnectedState, persisted, providerSource: source };
  }

  return {
    status: restrictedChain ? (chain?.restricted ? "restricted_chain" : "unsupported_chain") : "connected",
    address,
    shortAddress: shortenAddress(address),
    chainId,
    chainName: chain?.name ?? `Unsupported chain ${chainId ?? "unknown"}`,
    supportedChain,
    restrictedChain,
    disconnected: false,
    persisted,
    providerSource: source,
    walletExecutionEnabled: false,
    transactionExecutionEnabled: false,
    signatureExecutionEnabled: false,
    lastError: null
  };
}

export async function hydrateWalletRuntime(env: WalletRuntimeEnvironment = getBrowserEnvironment()): Promise<WalletRuntimeState> {
  const persisted = getStoredSession(env.storage);
  const { provider, source } = await resolveProvider(env);
  if (!provider) return { ...disconnectedState, persisted, providerSource: source };

  try {
    return await readWalletState(provider, source, persisted);
  } catch (error) {
    return { ...disconnectedState, status: "error", providerSource: source, persisted, lastError: error instanceof Error ? error.message : "Wallet hydration failed" };
  }
}

export async function connectWalletRuntime(env: WalletRuntimeEnvironment = getBrowserEnvironment()): Promise<WalletRuntimeState> {
  if (env.reownAppKit?.open) await env.reownAppKit.open();
  const { provider, source } = await resolveProvider(env);
  if (!provider) {
    return { ...disconnectedState, status: "error", lastError: "No Reown/AppKit or EIP-1193 wallet provider detected." };
  }

  try {
    await provider.request({ method: "eth_requestAccounts" });
    persistSession(env.storage, true);
    return await readWalletState(provider, source, true);
  } catch (error) {
    return {
      ...disconnectedState,
      status: "error",
      providerSource: source,
      lastError: error instanceof Error ? error.message : "Wallet connection rejected"
    };
  }
}

export async function disconnectWalletRuntime(env: WalletRuntimeEnvironment = getBrowserEnvironment()): Promise<WalletRuntimeState> {
  try {
    await env.reownAppKit?.disconnect?.();
  } finally {
    persistSession(env.storage, false);
  }
  return { ...disconnectedState };
}

export async function switchWalletChainRuntime(chainId: number, env: WalletRuntimeEnvironment = getBrowserEnvironment()): Promise<WalletRuntimeState> {
  const { provider, source } = await resolveProvider(env);
  if (!provider) return { ...disconnectedState, status: "error", lastError: "No wallet provider available for chain switch." };

  try {
    await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: toChainHexId(chainId) }] });
    return await readWalletState(provider, source, getStoredSession(env.storage));
  } catch (error) {
    const current = await hydrateWalletRuntime(env);
    return {
      ...current,
      status: "error",
      lastError: error instanceof Error ? error.message : "Chain switch failed"
    };
  }
}

class WalletRuntimeStore {
  private state: WalletRuntimeState = disconnectedState;
  private readonly listeners = new Set<() => void>();
  private provider?: Eip1193Provider;
  private env: WalletRuntimeEnvironment = getBrowserEnvironment();
  private readonly handleAccountsChanged = () => {
    void this.hydrate();
  };
  private readonly handleChainChanged = () => {
    void this.hydrate();
  };
  private readonly handleDisconnect = () => {
    this.state = { ...disconnectedState };
    persistSession(this.env.storage, false);
    this.emit();
  };

  getSnapshot = () => this.state;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  setEnvironment(env: WalletRuntimeEnvironment) {
    this.detachProviderEvents();
    this.env = env;
    this.provider = undefined;
  }

  async hydrate() {
    this.state = await hydrateWalletRuntime(this.env);
    await this.attachProviderEvents();
    this.emit();
    return this.state;
  }

  async connect() {
    this.state = { ...this.state, status: "connecting", lastError: null };
    this.emit();
    this.state = await connectWalletRuntime(this.env);
    await this.attachProviderEvents();
    this.emit();
    return this.state;
  }

  async disconnect() {
    this.detachProviderEvents();
    this.state = await disconnectWalletRuntime(this.env);
    this.emit();
    return this.state;
  }

  async switchChain(chainId: number) {
    this.state = { ...this.state, status: "connecting", lastError: null };
    this.emit();
    this.state = await switchWalletChainRuntime(chainId, this.env);
    this.emit();
    return this.state;
  }

  private emit() {
    this.listeners.forEach((listener) => listener());
  }

  private async attachProviderEvents() {
    const { provider } = await resolveProvider(this.env);
    if (!provider || provider === this.provider) return;
    this.detachProviderEvents();
    this.provider = provider;
    provider.on?.("accountsChanged", this.handleAccountsChanged);
    provider.on?.("chainChanged", this.handleChainChanged);
    provider.on?.("disconnect", this.handleDisconnect);
  }

  private detachProviderEvents() {
    if (!this.provider) return;
    this.provider.removeListener?.("accountsChanged", this.handleAccountsChanged);
    this.provider.removeListener?.("chainChanged", this.handleChainChanged);
    this.provider.removeListener?.("disconnect", this.handleDisconnect);
    this.provider = undefined;
  }
}

export const walletRuntimeStore = new WalletRuntimeStore();
