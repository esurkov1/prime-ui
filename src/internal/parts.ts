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
 * written order (`Page.Actions` at the end of a `Page.Header`, `Badge.Action` at the end of the badge).
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

/** Plain text children become `Label` elements, so every item title is its labelling part. */
export function labelPlainText(
  children: React.ReactNode,
  Label: React.ComponentType<{ children: React.ReactNode }>,
): React.ReactNode {
  return React.Children.map(children, (child) =>
    (typeof child === "string" || typeof child === "number") && String(child).trim() !== ""
      ? React.createElement(Label, null, child)
      : child,
  );
}

/** A text part of an item: its title, a count after it, the second line. */
type TextPart = "label" | "count" | "description";

type TextPartsRegistry = { register: (part: TextPart, id: string) => () => void };

const TextPartsContext = React.createContext<TextPartsRegistry | null>(null);

/**
 * The text parts of a two-line item (a tab, a segment): its `Label`, `Count` and `Description`
 * register their ids (`useTextPartId`), and the item takes its name from the label and the count
 * and its description from the second line — by ids that are in the document, never guessed. A
 * one-line item (no description) is named by its content and gets neither attribute.
 */
export function useTextParts(): {
  provide: (children: React.ReactNode) => React.ReactElement;
  labelledBy: string | undefined;
  describedBy: string | undefined;
} {
  const [ids, setIds] = React.useState<Partial<Record<TextPart, string>>>({});
  const register = React.useCallback((part: TextPart, id: string) => {
    setIds((prev) => (prev[part] === id ? prev : { ...prev, [part]: id }));
    return () =>
      setIds((prev) => {
        if (prev[part] !== id) return prev;
        const next = { ...prev };
        delete next[part];
        return next;
      });
  }, []);
  const registry = React.useMemo(() => ({ register }), [register]);
  const provide = React.useCallback(
    (children: React.ReactNode) =>
      React.createElement(TextPartsContext.Provider, { value: registry }, children),
    [registry],
  );
  const name = [ids.label, ids.count].filter(Boolean).join(" ");
  const twoLine = ids.description !== undefined;
  return {
    provide,
    labelledBy: twoLine && name ? name : undefined,
    describedBy: ids.description,
  };
}

/** The id of a text part inside an item (`useTextParts`); `undefined` outside one. */
export function useTextPartId(part: TextPart): string | undefined {
  const id = React.useId();
  const registry = React.useContext(TextPartsContext);
  React.useLayoutEffect(() => registry?.register(part, id), [registry, part, id]);
  return registry ? id : undefined;
}
