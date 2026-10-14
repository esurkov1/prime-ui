import * as React from "react";

/**
 * Whether a child is an element of the given part (element types are compared, never
 * `displayName`).
 */
export function isPart<P = unknown>(
  node: React.ReactNode,
  type: React.ElementType,
): node is React.ReactElement<P> {
  return React.isValidElement(node) && node.type === type;
}

/**
 * The children as a flat list: fragments opened (their keys prefixed, so they stay unique),
 * `null`, `undefined` and booleans dropped.
 */
export function flattenChildren(nodes: React.ReactNode, prefix = ""): React.ReactNode[] {
  return React.Children.toArray(nodes).flatMap((node) => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(node)) return [node];
    const key = `${prefix}${node.key ?? ""}`;
    if (node.type === React.Fragment) return flattenChildren(node.props.children, `${key}/`);
    return [prefix ? React.cloneElement(node, { key }) : node];
  });
}

/**
 * Splits the direct children into the elements of the given part types and the rest, each in the
 * written order (`PageToolbar.Chips` under the bar, `Badge.Action` at the end of the badge).
 */
export function splitParts<P = unknown>(
  children: React.ReactNode,
  ...types: React.ElementType[]
): { parts: React.ReactElement<P>[]; rest: React.ReactNode[] } {
  const parts: React.ReactElement<P>[] = [];
  const rest: React.ReactNode[] = [];
  for (const child of React.Children.toArray(children)) {
    if (React.isValidElement<P>(child) && types.some((type) => child.type === type)) {
      parts.push(child);
    } else {
      rest.push(child);
    }
  }
  return { parts, rest };
}
