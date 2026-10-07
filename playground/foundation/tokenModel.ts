/**
 * Foundation pages read tokens from their sources (`tokens/*.ts`) and from live CSS variables.
 * Nothing here repeats a token value by hand: names come from `semanticTokens`, static sizes are
 * resolved through `primitiveTokens`, colors are read with `getComputedStyle` in the current theme.
 */
import * as React from "react";

import { toVarName } from "../../tokens/naming";
import { primitiveTokens } from "../../tokens/primitives";
import { semanticTokens } from "../../tokens/semantic";
import { darkThemeOverrides } from "../../tokens/themes/dark";

export { primitiveTokens, semanticTokens, toVarName };

type TokenTree = { readonly [key: string]: string | TokenTree };

/** camelCase role key → kebab name: `bodyS` → `body-s`. */
export function toKebab(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function getAt(tree: TokenTree, path: string): string | TokenTree | undefined {
  let node: string | TokenTree | undefined = tree;
  for (const part of path.split(".")) {
    if (node === undefined || typeof node === "string") return undefined;
    node = node[part];
  }
  return node;
}

/** Leaf entries under a semantic path, in declaration order. */
export function semanticLeaves(path: string): { key: string; path: string; value: string }[] {
  const node = getAt(semanticTokens as unknown as TokenTree, path);
  if (node === undefined || typeof node === "string") return [];
  return Object.entries(node).flatMap(([key, value]) =>
    typeof value === "string"
      ? [{ key, path: `${path}.${key}`, value }]
      : semanticLeaves(`${path}.${key}`).map((leaf) => ({ ...leaf, key: `${key}.${leaf.key}` })),
  );
}

/** Direct child keys of a semantic path (`color` → `bg`, `fill`, …). */
export function semanticKeys(path: string): string[] {
  const node = getAt(semanticTokens as unknown as TokenTree, path);
  return node === undefined || typeof node === "string" ? [] : Object.keys(node);
}

/** Raw source value of a token for a theme (`{color.gray.50}`, `rgba(…)`, `2.75rem`). */
export function sourceValue(path: string, theme: "light" | "dark"): string | undefined {
  if (theme === "dark") {
    const dark = getAt(darkThemeOverrides as unknown as TokenTree, path);
    if (typeof dark === "string") return dark;
  }
  const base = getAt(semanticTokens as unknown as TokenTree, path);
  return typeof base === "string" ? base : undefined;
}

/** `{space.9}` → `2.25rem` via primitives; plain values pass through. */
export function resolvePrimitive(value: string): string {
  const match = /^\{(.+)\}$/.exec(value);
  if (!match) return value;
  const resolved = getAt(primitiveTokens as unknown as TokenTree, match[1]);
  return typeof resolved === "string" ? resolved : value;
}

/** Short label of a reference: `{color.gray.50}` → `gray.50`; other values unchanged. */
export function refLabel(value: string | undefined): string {
  if (!value) return "—";
  const match = /^\{(?:color\.)?(.+)\}$/.exec(value);
  if (match) return match[1];
  const mix = /var\(--prime-ref-color-([a-z]+)-(\d+)\)\s+(\d+%)/.exec(value);
  if (mix) return `${mix[1]}.${mix[2]} · ${mix[3]}`;
  return value;
}

/** rem tokens are shown in px at the browser default root size (16px) for reading. */
export function toPx(value: string): number | null {
  const v = value.trim();
  if (v === "0") return 0;
  const rem = /^(-?[\d.]+)rem$/.exec(v);
  if (rem) return Number.parseFloat(rem[1]) * 16;
  const px = /^(-?[\d.]+)px$/.exec(v);
  if (px) return Number.parseFloat(px[1]);
  return null;
}

/** Semantic size token → px number (via primitives), or null when not a length. */
export function semanticPx(path: string): number | null {
  const value = sourceValue(path, "light");
  return value === undefined ? null : toPx(resolvePrimitive(value));
}

export function formatPx(px: number | null): string {
  if (px === null) return "—";
  return Number.isInteger(px) ? `${px}` : px.toFixed(1);
}

export const SIZE_TIERS = ["xs", "s", "m", "l", "xl"] as const;
export type SizeTier = (typeof SIZE_TIERS)[number];

/* --- Live theme ----------------------------------------------------------- */

/** Current `data-theme` on `<html>`, updated on change (the playground toggles the attribute). */
function readDocumentTheme(): "light" | "dark" {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function useDocumentTheme(): "light" | "dark" {
  const [theme, setTheme] = React.useState<"light" | "dark">(readDocumentTheme);
  React.useEffect(() => {
    const observer = new MutationObserver(() => setTheme(readDocumentTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    setTheme(readDocumentTheme());
    return () => observer.disconnect();
  }, []);
  return theme;
}

/* --- Color parsing and contrast ---------------------------------------------- */

export type Rgba = { r: number; g: number; b: number; a: number };

/** Parses what browsers return from `getComputedStyle`: `rgb()`, `rgba()`, `color(srgb …)`. */
export function parseColor(input: string): Rgba | null {
  const s = input.trim();
  const rgb = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/.exec(
    s,
  );
  if (rgb) {
    const alpha = rgb[4] === undefined ? 1 : parseAlpha(rgb[4]);
    return { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]), a: alpha };
  }
  const srgb =
    /^color\(srgb\s+([\d.e-]+)\s+([\d.e-]+)\s+([\d.e-]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/.exec(s);
  if (srgb) {
    const alpha = srgb[4] === undefined ? 1 : parseAlpha(srgb[4]);
    return {
      r: Number(srgb[1]) * 255,
      g: Number(srgb[2]) * 255,
      b: Number(srgb[3]) * 255,
      a: alpha,
    };
  }
  const hex = /^#([0-9a-f]{6})$/i.exec(s);
  if (hex) {
    const n = Number.parseInt(hex[1], 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  return null;
}

function parseAlpha(value: string): number {
  return value.endsWith("%") ? Number.parseFloat(value) / 100 : Number.parseFloat(value);
}

/** Source-over compositing of a translucent color on an opaque backdrop. */
export function composite(top: Rgba, backdrop: Rgba): Rgba {
  const a = top.a;
  return {
    r: top.r * a + backdrop.r * (1 - a),
    g: top.g * a + backdrop.g * (1 - a),
    b: top.b * a + backdrop.b * (1 - a),
    a: 1,
  };
}

export function toHex(c: Rgba): string {
  const h = (n: number) =>
    Math.round(Math.min(255, Math.max(0, n)))
      .toString(16)
      .padStart(2, "0");
  const base = `#${h(c.r)}${h(c.g)}${h(c.b)}`;
  return c.a < 1 ? `${base} · ${Math.round(c.a * 100)}%` : base;
}

function channel(v: number): number {
  const x = v / 255;
  return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
}

export function luminance(c: Rgba): number {
  return 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);
}

export function contrastRatio(a: Rgba, b: Rgba): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Resolves CSS custom properties to computed colors on a probe placed inside `host`, so local
 * overrides (field context, `data-theme`) apply. Re-runs when the document theme changes.
 */
export function useComputedColors(
  host: React.RefObject<HTMLElement | null>,
  varNames: readonly string[],
): Record<string, Rgba | null> {
  const theme = useDocumentTheme();
  const key = varNames.join("|");
  const [colors, setColors] = React.useState<Record<string, Rgba | null>>({});

  // biome-ignore lint/correctness/useExhaustiveDependencies: `key` stands for `varNames`; `theme` triggers a re-read
  React.useLayoutEffect(() => {
    const root = host.current;
    if (!root) return;
    const probe = document.createElement("span");
    probe.setAttribute("aria-hidden", "true");
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.style.pointerEvents = "none";
    root.appendChild(probe);
    const next: Record<string, Rgba | null> = {};
    for (const name of varNames) {
      probe.style.backgroundColor = "";
      probe.style.backgroundColor = `var(${name})`;
      next[name] = parseColor(getComputedStyle(probe).backgroundColor);
    }
    probe.remove();
    setColors(next);
  }, [key, theme, host]);

  return colors;
}
