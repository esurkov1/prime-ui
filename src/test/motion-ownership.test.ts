// @vitest-environment node
/**
 * Motion is owned by the component that knows what changed (foundation §7, AGENTS.md
 * Conventions «Motion is owned»). Mechanical guards over the TypeScript sources:
 *
 * - Every copy of a rendered node is a still copy: `cloneNode` lives only in
 *   `src/internal/stillCopy.ts`, which turns every motion of the copy off — an enter it played, a
 *   Drawer's slide-in it stands in, a drawn glyph never starts over on a drag copy or an exit copy.
 * - Element type is never an identity for motion: no key, state or id is built from an element's
 *   `.type` (a control of another kind in the same place is not a new part that enters and leaves).
 *   The readers are the content swaps of a slot (a row cell, a glyph), which follow React's own
 *   identity rule: another type in the same place is another content, cross-faded in place.
 * - A host never wraps arbitrary children in a component of its own that only adds presence (the
 *   shape of a cell that enters and closes up whatever it holds): a row of the consumer's controls
 *   stands on `RowCells` (`src/internal/rowCells`) — cells by place, content swap inside.
 */
import { describe, expect, it } from "vitest";

import { read, walk } from "./contract-utils";

/** Runtime sources of the kit: no tests, examples or api tables. */
const sources = walk("src", /\.tsx?$/).filter(
  (file) => !/\.test\.tsx?$|\/examples\/|\/api\.ts$|\.api\.ts$|^src\/test\/|\.d\.ts$/.test(file),
);

/** The readers of an element's type as a motion identity, each with its reason. */
const TYPE_IDENTITY: Record<string, string> = {
  // A cell's content swaps when React itself would replace the instance (another type).
  "src/internal/rowCells.tsx": "content swap of a control cell by React's identity",
  // A glyph slot cross-fades to another glyph: its type and `name` (an `<Icon name>`).
  "src/internal/glyphSwap.tsx": "content swap of a glyph slot",
};

/** A key, state or id built from an element's `.type`. */
const TYPE_AS_IDENTITY = [
  /\$\{[^}]*\.type\b[^}]*\}/g,
  /\b(key|state|id)=\{[^}]*\.type\b/g,
  /\b\w*[Kk]ey\w*\s*=\s*\([^)]*\)\s*=>[^;]*\.type\b/g,
];

const PRESENCE =
  /\b(usePartPresence|useEnterOnAppear|leaveInPlace|useListItemPresence)\b|enterMotion\./;

/** `function X({ children }…)` blocks: a component that takes nothing but what it wraps. */
function childrenOnlyWrappers(text: string): { name: string; body: string }[] {
  const out: { name: string; body: string }[] = [];
  const starts = [...text.matchAll(/^(?:export )?function (\w+)\(\{\s*children\s*\}/gm)];
  for (const start of starts) {
    const from = start.index ?? 0;
    const next = text.slice(from + 1).search(/^(?:export )?(?:function|const|type) /m);
    out.push({ name: start[1], body: text.slice(from, next < 0 ? undefined : from + 1 + next) });
  }
  return out;
}

describe("motion ownership", () => {
  it("every copy of a node is a still copy (cloneNode only in stillCopy)", () => {
    const offenders = sources.filter(
      (file) => file !== "src/internal/stillCopy.ts" && /\.cloneNode\(/.test(read(file)),
    );
    expect(offenders).toEqual([]);
  });

  it("no source builds a motion identity from an element's type", () => {
    const offenders: string[] = [];
    for (const file of sources) {
      const text = read(file);
      const hits = TYPE_AS_IDENTITY.some((pattern) => (text.match(pattern) ?? []).length > 0);
      if (hits && !(file in TYPE_IDENTITY)) offenders.push(file);
    }
    expect(offenders).toEqual([]);
    // The allowlist tells: an entry that no longer reads a type leaves it.
    const stale = Object.keys(TYPE_IDENTITY).filter(
      (file) => !TYPE_AS_IDENTITY.some((pattern) => (read(file).match(pattern) ?? []).length > 0),
    );
    expect(stale).toEqual([]);
  });

  it("no host wraps arbitrary children in a cell that only adds presence", () => {
    const offenders: string[] = [];
    for (const file of sources) {
      for (const { name, body } of childrenOnlyWrappers(read(file))) {
        if (PRESENCE.test(body)) offenders.push(`${file}: ${name}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
