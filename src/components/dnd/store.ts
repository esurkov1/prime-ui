import * as React from "react";

export type Store<T> = {
  getSnapshot: () => T;
  subscribe: (listener: () => void) => () => void;
  setState: (update: (current: T) => T) => void;
};

/** A plain store outside React: the drag session outlives any one component and is shared by many. */
export function createStore<T>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => state,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setState: (update) => {
      const next = update(state);
      if (Object.is(next, state)) return;
      state = next;
      for (const listener of [...listeners]) listener();
    },
  };
}

/** Subscribes to a slice of a store. `select` must return a primitive or a stable reference. */
export function useStoreSelector<T, S>(store: Store<T>, select: (state: T) => S): S {
  return React.useSyncExternalStore(
    store.subscribe,
    () => select(store.getSnapshot()),
    () => select(store.getSnapshot()),
  );
}
