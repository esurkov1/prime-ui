import type * as React from "react";

export type ExampleBase = "components" | "layout";

export type SourceEntry = {
  Component: React.ComponentType;
  /** The file's own text for the code pane, trimmed. */
  source: string;
};

/**
 * Every example file of the kit (`src/<base>/<dir>/examples/*.tsx`), found by `import.meta.glob`.
 * A file's module and its `?raw` source load together, lazily, on first use (nothing lands in the
 * initial chunk); the promise is cached, so every frame of a file shares one load.
 */
const modules = import.meta.glob<{ default: React.ComponentType }>(
  "../src/{components,layout}/*/examples/*.tsx",
);
const sources = import.meta.glob<string>("../src/{components,layout}/*/examples/*.tsx", {
  query: "?raw",
  import: "default",
});
const cache = new Map<string, Promise<SourceEntry>>();

/** The example `src/<base>/<dir>/examples/<file>.tsx`; throws when the file does not exist. */
export function getExample(base: ExampleBase, dir: string, file: string): Promise<SourceEntry> {
  const key = `../src/${base}/${dir}/examples/${file}.tsx`;
  const cached = cache.get(key);
  if (cached) return cached;
  const loadModule = modules[key];
  const loadSource = sources[key];
  if (!loadModule || !loadSource) throw new Error(`Not found: ${key.slice(3)}`);
  const entry = Promise.all([loadModule(), loadSource()]).then(([module, source]) => ({
    Component: module.default,
    source: source.trim(),
  }));
  cache.set(key, entry);
  return entry;
}
