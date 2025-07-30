// utils/zustandHydration.ts
export function hasHydration<T extends object>(
  store: T
): store is T & {
  persist: {
    onFinishHydration: (cb: () => void) => void;
  };
} {
  return "persist" in store;
}
