import { useEffect, useSyncExternalStore } from "react";
import { walletRuntimeStore } from "../services/walletRuntime";

export function useWallet() {
  const state = useSyncExternalStore(walletRuntimeStore.subscribe, walletRuntimeStore.getSnapshot, walletRuntimeStore.getSnapshot);

  useEffect(() => {
    void walletRuntimeStore.hydrate();
  }, []);

  return {
    ...state,
    connect: walletRuntimeStore.connect.bind(walletRuntimeStore),
    disconnect: walletRuntimeStore.disconnect.bind(walletRuntimeStore),
    switchChain: walletRuntimeStore.switchChain.bind(walletRuntimeStore)
  };
}
