import * as React from "react";

import { cx } from "./cx";
import enterMotion from "./enterMotion.module.css";
import { type ListPresence, useListItemPresence, useListPresence } from "./listPresence";
import { flattenChildren } from "./parts";
import { RegionSwap } from "./RegionSwap";

/** An id per element type: what React itself compares to keep or replace an instance. */
const typeIds = new Map<unknown, number>();
function typeIdOf(type: unknown): number {
  let id = typeIds.get(type);
  if (id === undefined) {
    id = typeIds.size;
    typeIds.set(type, id);
  }
  return id;
}

/**
 * What a cell shows, by React's own identity: the same element type updates in place (a switcher
 * whose value changes, a button whose label changes — the control's own motion); another type is a
 * new instance, and the cell cross-fades to it.
 */
const contentOf = (node: React.ReactNode): string =>
  React.isValidElement(node) ? `element-${typeIdOf(node.type)}` : `text-${typeof node}`;

/** The identity of a cell: its place among the children, as React keys it (or the consumer's key). */
const cellKey = (node: React.ReactNode, index: number): string =>
  React.isValidElement(node) && node.key != null ? String(node.key) : `#${index}`;

type CellProps = {
  id: string;
  presence: ListPresence;
  align: "start" | "end";
  children: React.ReactNode;
};

function Cell({ id, presence, align, children }: CellProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const entered = useListItemPresence(presence, id, ref, "inline");
  return (
    <RegionSwap
      ref={ref}
      axis="inline"
      align={align}
      state={contentOf(children)}
      className={cx(entered && enterMotion.enter)}
    >
      {children}
    </RegionSwap>
  );
}

type RowCellsProps = {
  children: React.ReactNode;
  /** The edge of the row the cells hold to: a cell's swap glides its width from the other edge. */
  align: "start" | "end";
};

/**
 * The cell model of a row a host draws around the consumer's controls (the header's `Actions`;
 * foundation §7). The host does not know what its children mean, so it invents no motion for them
 * by their kind: each child stands in a cell that keeps its identity by its place — React's key of
 * the child, so `{tab === "a" ? <Language /> : <Period />}` is one cell on every tab.
 *
 * - Another element in a cell (a new type in the same place): a content swap — the old control
 *   fades out in place while the new one fades in and the cell's width glides, both held to the
 *   `align` edge, so the controls beyond it never move (`RegionSwap axis="inline"`).
 * - A cell that appears or goes (a child rendered on some renders only): presence of the cell —
 *   it rises in after the row's first render and closes up in place when it goes
 *   (`useListPresence`, inline). The first render is still.
 *
 * Inside one element the control owns its motion (a value, a label, a selection).
 */
export function RowCells({ children, align }: RowCellsProps) {
  const items = flattenChildren(children);
  const keys = items.map(cellKey);
  const presence = useListPresence(keys);
  return items.map((item, index) => (
    <Cell key={keys[index]} id={keys[index]} presence={presence} align={align}>
      {item}
    </Cell>
  ));
}
