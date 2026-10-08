import type * as React from "react";

export type SourceEntry = {
  Component: React.ComponentType;
  /** The file's own text for the code pane, trimmed. */
  source: string;
};

type Loaders<T> = Record<string, () => Promise<T>>;

/**
 * Example and pattern files, found by `import.meta.glob`: one registry shape for both. A file's
 * module and its `?raw` source load together, lazily, on first use (nothing lands in the initial
 * chunk); the promise is cached, so a page reads it with `React.use()` under a Suspense boundary.
 */
export function createSourceRegistry(
  modules: Loaders<{ default: React.ComponentType }>,
  sources: Loaders<string>,
  describe: (key: string) => string,
): (key: string) => Promise<SourceEntry> {
  const cache = new Map<string, Promise<SourceEntry>>();
  return (key) => {
    const cached = cache.get(key);
    if (cached) return cached;
    const loadModule = modules[key];
    const loadSource = sources[key];
    if (!loadModule || !loadSource) throw new Error(`Not found: ${describe(key)}`);
    const entry = Promise.all([loadModule(), loadSource()]).then(([module, source]) => ({
      Component: module.default,
      source: source.trim(),
    }));
    cache.set(key, entry);
    return entry;
  };
}
