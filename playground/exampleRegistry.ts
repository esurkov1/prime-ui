import * as React from "react";

/**
 * Every example file of the kit, found by glob: no per-page `import X` + `import x?raw` pairs.
 * Modules load lazily (one chunk per example); sources are inlined for the code pane.
 */
const modules = import.meta.glob<{ default: React.ComponentType }>(
  "../src/{components,layout}/*/examples/*.tsx",
);
const sources = import.meta.glob<string>("../src/{components,layout}/*/examples/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
});

export type ExampleBase = "components" | "layout";

export type ExampleEntry = {
  Component: React.LazyExoticComponent<React.ComponentType>;
  source: string;
};

const cache = new Map<string, ExampleEntry>();

/** The example `src/<base>/<dir>/examples/<file>.tsx`; throws when the file does not exist. */
export function getExample(base: ExampleBase, dir: string, file: string): ExampleEntry {
  const key = `../src/${base}/${dir}/examples/${file}.tsx`;
  const cached = cache.get(key);
  if (cached) return cached;
  const load = modules[key];
  const source = sources[key];
  if (!load || source === undefined) throw new Error(`Example not found: ${key.slice(3)}`);
  const entry = { Component: React.lazy(load), source: source.trim() };
  cache.set(key, entry);
  return entry;
}
