import * as React from "react";

/**
 * Composition patterns live in `SKILL/patterns/` — one file is both the skill's reference screen
 * and the playground preview + code. Modules load lazily; sources are inlined for the code pane.
 */
const modules = import.meta.glob<{ default: React.ComponentType }>("../../SKILL/patterns/*.tsx");
const sources = import.meta.glob<string>("../../SKILL/patterns/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
});

export type PatternEntry = {
  Component: React.LazyExoticComponent<React.ComponentType>;
  source: string;
};

const cache = new Map<string, PatternEntry>();

/** The pattern `SKILL/patterns/<file>.tsx`; throws when the file does not exist. */
export function getPattern(file: string): PatternEntry {
  const key = `../../SKILL/patterns/${file}.tsx`;
  const cached = cache.get(key);
  if (cached) return cached;
  const load = modules[key];
  const source = sources[key];
  if (!load || source === undefined)
    throw new Error(`Pattern not found: SKILL/patterns/${file}.tsx`);
  const entry = { Component: React.lazy(load), source: source.trim() };
  cache.set(key, entry);
  return entry;
}
