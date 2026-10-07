import * as React from "react";

/**
 * An icon or dot at an edge of the badge (first or last child) becomes a segment —
 * full height, flush with that edge, the icon centred in it — instead of an icon floating inside the
 * padding. Marks those icons with `data-edge` and reports which edges have one.
 */
export function markEdgeIcons(
  children: React.ReactNode,
  isIcon: (type: unknown) => boolean,
  options: { endTaken?: boolean } = {},
): { children: React.ReactNode[]; start: boolean; end: boolean } {
  const items = React.Children.toArray(children).filter(
    (child) => !(typeof child === "string" && child.trim() === ""),
  );
  const iconAt = (index: number) => {
    const child = items[index];
    return React.isValidElement(child) && isIcon(child.type);
  };
  // A chip of icons only is a square, not two segments.
  if (items.length === 0 || items.every((_, index) => iconAt(index))) {
    return { children: items, start: false, end: false };
  }
  const last = items.length - 1;
  const start = iconAt(0);
  const end = !options.endTaken && iconAt(last);
  const mark = (index: number, edge: "start" | "end") => {
    const child = items[index] as React.ReactElement<{ "data-edge"?: string }>;
    items[index] = React.cloneElement(child, { "data-edge": edge });
  };
  if (start) mark(0, "start");
  if (end) mark(last, "end");
  return { children: items, start, end };
}
