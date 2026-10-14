/**
 * The state triads of every component, scanned from its `api.ts`: which parts take
 * `value` / `defaultValue` / `onValueChange`, `checked` / …, `open` / …, and which other aspects
 * follow the same `x` / `defaultX` / `onXChange` triad. `SKILL/api-contract.md` lists them in its
 * vocabulary table; `bun run docs:build` writes those rows.
 */
import type { ApiPart, ComponentApi } from "./componentApi";

export type Triad = { part: string; state: string };

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** The triads of a part: every `x` whose `defaultX` and `onXChange` it also takes. */
export function triadsOf(part: ApiPart): string[] {
  const names = new Set(part.props.map((prop) => prop.name));
  const states: string[] = [];
  for (const name of names) {
    const match = name.match(/^default([A-Z]\w*)$/);
    if (!match) continue;
    const state = match[1].charAt(0).toLowerCase() + match[1].slice(1);
    if (names.has(`on${capitalize(state)}Change`)) states.push(state);
  }
  return states;
}

/** The label of a part in a list: `Select` for `Select.Root`, `Radio.Group` as is. */
export const partLabel = (name: string) => name.replace(/\.Root$/, "");

/** Every triad of every part, in component order. */
export function allTriads(apis: { api: ComponentApi }[]): Triad[] {
  return apis.flatMap(({ api }) =>
    api.parts.flatMap((part) =>
      part.name.includes(" · ") ? [] : triadsOf(part).map((state) => ({ part: part.name, state })),
    ),
  );
}

const list = (parts: string[]) => [...new Set(parts.map(partLabel))].join(", ");

/** The four generated rows of the vocabulary table in `SKILL/api-contract.md`, by first cell. */
export function triadRows(apis: { api: ComponentApi }[]): Record<string, string> {
  const triads = allTriads(apis);
  const of = (state: string) => triads.filter((t) => t.state === state).map((t) => t.part);
  const other = new Map<string, string[]>();
  for (const { part, state } of triads) {
    if (state === "value" || state === "checked" || state === "open") continue;
    const label = partLabel(part);
    other.set(label, [...(other.get(label) ?? []), `\`${state}\``]);
  }
  const otherList = [...other].map(([label, states]) => `${label} ${states.join(", ")}`).join("; ");
  return {
    Value: `| Value | \`value\` / \`defaultValue\` / \`onValueChange(value)\` | ${list(of("value"))}. |`,
    "Other state": `| Other state | \`x\` / \`defaultX\` / \`onXChange(x)\` | ${otherList}. |`,
    Checked: `| Checked | \`checked\` / \`defaultChecked\` / \`onCheckedChange(checked)\` | ${list(of("checked"))}. |`,
    Open: `| Open | \`open\` / \`defaultOpen\` / \`onOpenChange(open)\` | ${list(of("open"))}. |`,
  };
}
