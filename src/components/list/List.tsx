import * as React from "react";

import { Avatar } from "@/components/avatar/Avatar";
import { Badge } from "@/components/badge/Badge";
import { Dnd } from "@/components/dnd/Dnd";
import { ControlSizeProvider, useControlSize, useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import { fieldTierClass } from "@/internal/fieldClasses";
import { formatLabel } from "@/internal/formatLabel";
import { InteractiveElement } from "@/internal/interactiveElement";
import { useLabels } from "@/internal/labels";
import { type ListPresence, useListItemPresence, useListPresence } from "@/internal/listPresence";
import { nodeText } from "@/internal/nodeText";
import { flattenChildren, isPart, splitParts } from "@/internal/parts";
import { slotChild } from "@/internal/slot";
import { type ControlSize, type PaletteColor, stepDown } from "@/internal/states";
import { touchTargetRowClass } from "@/internal/touchTarget";

import styles from "./List.module.css";

// ─── Root ─────────────────────────────────────────────────────────────────────

export type ListLabels = {
  /** `aria-label` of a row's drag handle (`onReorder`); `{label}` is the row's text. */
  reorderItem: string;
};

export const LIST_LABELS: ListLabels = {
  reorderItem: "Переместить {label}",
};

/** What a row of a reorderable list needs: the handle's name. */
type ReorderContextValue = { handleLabel: string };

const ReorderContext = React.createContext<ReorderContextValue | null>(null);

/** The list's keyed presence (rows enter and close up) and the key of the row inside it. */
const PresenceContext = React.createContext<ListPresence | null>(null);
const RowKeyContext = React.createContext<string | null>(null);

/** The presence key of a row: its `value`, else its React key. */
const rowKey = (item: React.ReactElement<ListItemProps>, index: number): string =>
  item.props.value ?? String(item.key ?? index);

export type ListRootProps = Omit<React.HTMLAttributes<HTMLUListElement>, "children"> & {
  size?: ControlSize;
  onReorder?: (id: string, beforeId: string | null) => void | Promise<void>;
  labels?: Partial<ListLabels>;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLUListElement>;
};

/**
 * A selectable navigation list: the master half of a list + detail screen (tickets, mail,
 * records). Rows are buttons or links; the open record is `current`; rows the data adds or takes
 * out rise in and close up in place.
 */
function ListRoot({
  size: sizeProp,
  onReorder,
  labels,
  className,
  children,
  ...rest
}: ListRootProps) {
  const tier = useHostTier(sizeProp);
  const size = tier.size;
  const handleLabel = useLabels(LIST_LABELS, labels).reorderItem;
  const reorder = React.useMemo<ReorderContextValue>(() => ({ handleLabel }), [handleLabel]);
  const latest = React.useRef(onReorder);
  latest.current = onReorder;
  // Dnd keeps a row in its new place, busy with a busy grip, until a returned promise settles,
  // and glides it back on a rejection.
  const move = React.useCallback(
    (id: string, beforeId: string | null) => latest.current?.(id, beforeId),
    [],
  );

  // Other children (a host's own row wrappers, spacers) render as they are.
  const nodes = flattenChildren(children);
  const items = nodes.filter((node): node is React.ReactElement<ListItemProps> =>
    isPart(node, ListItem),
  );
  // Rows rise in when the data adds them and close up in place when it takes them out.
  const presence = useListPresence(items.map(rowKey));
  const keyed = (item: React.ReactElement<ListItemProps>, index: number) => (
    <RowKeyContext key={item.key ?? index} value={rowKey(item, index)}>
      {item}
    </RowKeyContext>
  );

  if (onReorder === undefined) {
    return tier.provide(
      <PresenceContext value={presence}>
        <ul
          // biome-ignore lint/a11y/noRedundantRoles: `list-style: none` drops the list semantics in WebKit; the role keeps them
          role="list"
          {...rest}
          className={cx(fieldTierClass, styles.root, className)}
          {...toDataAttributes({ size })}
        >
          {nodes.map((node) =>
            isPart<ListItemProps>(node, ListItem) ? keyed(node, items.indexOf(node)) : node,
          )}
        </ul>
      </PresenceContext>,
    );
  }

  const { ref, ...listRest } = rest;
  return tier.provide(
    <ReorderContext value={reorder}>
      <PresenceContext value={presence}>
        <Dnd.Root>
          <Dnd.Sortable
            role="list"
            {...listRest}
            ref={ref as React.Ref<HTMLElement>}
            as="ul"
            items={items}
            getId={itemId}
            getLabel={itemLabelOf}
            onReorder={move}
            renderItem={(item) => keyed(item, items.indexOf(item))}
            handle
            className={cx(fieldTierClass, styles.root, className)}
            {...toDataAttributes({ size, reorderable: true })}
          />
        </Dnd.Root>
      </PresenceContext>
    </ReorderContext>,
  );
}
ListRoot.displayName = "List.Root";

function itemId(item: React.ReactElement<ListItemProps>): string {
  const { value } = item.props;
  if (value === undefined)
    throw new Error("List.Item needs a `value` when List.Root has onReorder");
  return value;
}

function itemLabelOf(item: React.ReactElement<ListItemProps>): string {
  return itemLabel(item.props);
}

// ─── Parts of an item ─────────────────────────────────────────────────────────

export type ListItemIconProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * The leading picture of a row: an avatar of the row tier, an icon, or a colour dot
 * (`Badge.Dot color`) in a box as wide as an icon, so the rows' text lines up. After the text it is
 * a quiet trailing glyph. Decorative: the text names the row.
 */
function ListItemIcon({ className, children, ...rest }: ListItemIconProps) {
  const size = useControlSize(undefined);
  // An avatar without its own `size` takes the row tier through its public `size`.
  const sized = React.Children.map(children, (child) =>
    isPart<{ size?: unknown }>(child, Avatar.Root) && child.props.size === undefined
      ? React.cloneElement(child, { size })
      : child,
  );
  const dot = React.Children.toArray(children).some((child) => isPart(child, Badge.Dot));
  return (
    <span
      {...rest}
      className={cx(styles.icon, className)}
      data-mark={dot ? "dot" : undefined}
      aria-hidden="true"
    >
      {/* A dot standing for an icon takes the large dot, as the Sidebar's marks do. */}
      {dot ? <ControlSizeProvider value="l">{sized}</ControlSizeProvider> : sized}
    </span>
  );
}
ListItemIcon.displayName = "List.ItemIcon";

export type ListItemTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** The primary line: one line, truncated with an ellipsis. */
function ListItemText({ className, ...rest }: ListItemTextProps) {
  return <span {...rest} className={cx(styles.text, className)} />;
}
ListItemText.displayName = "List.ItemText";

export type ListItemDescriptionProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** The second line (a preview, a status): muted, smaller, truncated. */
function ListItemDescription({ className, ...rest }: ListItemDescriptionProps) {
  return <span {...rest} className={cx(styles.description, className)} />;
}
ListItemDescription.displayName = "List.ItemDescription";

export type ListItemMetaProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** Small trailing text at the end of the first line: a time, a date, an amount. */
function ListItemMeta({ className, ...rest }: ListItemMetaProps) {
  return <span {...rest} className={cx(styles.meta, className)} />;
}
ListItemMeta.displayName = "List.ItemMeta";

export type ListItemCountProps = Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "children" | "color"
> & {
  color?: PaletteColor;
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/** A count at the end of the row: a soft Badge one tier below the rows. */
function ListItemCount({ color = "gray", className, ...rest }: ListItemCountProps) {
  return <Badge.Root {...rest} color={color} className={cx(styles.count, className)} />;
}
ListItemCount.displayName = "List.ItemCount";

export type ListItemActionsProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The row's own controls (a Switch, a Dropdown with its icon Button, an icon Button): at the end of
 * the row, beside its button or link and never inside it, one tier below the row. The row's fills
 * cover them.
 */
function ListItemActions({ className, ...rest }: ListItemActionsProps) {
  const size = useControlSize(undefined);
  return (
    <ControlSizeProvider value={stepDown(size)}>
      <div {...rest} className={cx(styles.actions, className)} />
    </ControlSizeProvider>
  );
}
ListItemActions.displayName = "List.ItemActions";

/** Words apart in the accessible name; a flex container renders no space. */
function spaced(nodes: React.ReactNode[]): React.ReactNode[] {
  return nodes.flatMap((node, index) => (index === 0 ? [node] : [" ", node]));
}

/**
 * Parts go to their places: a leading icon, the body (text and description lines; loose content
 * becomes the text line), then the trail (meta, count, trailing icons) — stacked beside two lines.
 */
function splitItemChildren(children: React.ReactNode) {
  let leading: React.ReactNode = null;
  const body: React.ReactNode[] = [];
  const trail: React.ReactNode[] = [];
  let loose: React.ReactNode[] = [];
  let twoLines = false;

  const flushLoose = () => {
    if (loose.length === 0) return;
    body.push(
      <span key={`text-${body.length}`} className={styles.text}>
        {loose}
      </span>,
    );
    loose = [];
  };

  for (const node of React.Children.toArray(children)) {
    if (isPart(node, ListItemIcon)) {
      if (leading === null && body.length === 0 && loose.length === 0) leading = node;
      else
        trail.push(
          React.cloneElement(node as React.ReactElement<Record<string, unknown>>, {
            "data-edge": "end",
          }),
        );
    } else if (isPart(node, ListItemMeta) || isPart(node, ListItemCount)) {
      trail.push(node);
    } else if (isPart(node, ListItemText) || isPart(node, ListItemDescription)) {
      flushLoose();
      if (isPart(node, ListItemDescription)) twoLines = true;
      body.push(node);
    } else {
      loose.push(node);
    }
  }
  flushLoose();

  return (
    <>
      {leading}
      <span className={styles.body}>{spaced(body)}</span>
      {trail.length > 0 ? (
        <>
          {" "}
          <span className={cx(styles.trail, twoLines && styles.trailStacked)}>{spaced(trail)}</span>
        </>
      ) : null}
    </>
  );
}

/** What a row is called by its handle and in drag announcements: its text line. */
function itemLabel({ asChild, children }: Pick<ListItemProps, "asChild" | "children">): string {
  const content =
    asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
      ? children.props.children
      : children;
  const nodes = React.Children.toArray(content);
  const text = nodes.find((node) => isPart(node, ListItemText));
  const source = text
    ? text
    : nodes.filter((node) => typeof node === "string" || typeof node === "number");
  return nodeText(source).trim();
}

// ─── Item ─────────────────────────────────────────────────────────────────────

/** A row outside a `List.Root` (a test, a story): nothing enters or leaves. */
const NO_PRESENCE: Pick<ListPresence, "entering" | "leaving"> = {
  entering: new Set(),
  leaving: new Set(),
};

type ListItemOwnProps = {
  value?: string;
  current?: boolean;
  disabled?: boolean;
  asChild?: boolean;
  children?: React.ReactNode;
};

export type ListItemProps = ListItemOwnProps &
  Omit<React.ComponentPropsWithoutRef<"button">, keyof ListItemOwnProps> & {
    href?: string;
    target?: string;
    rel?: string;
    ref?: React.Ref<HTMLElement>;
  };

/** A row of the list: an `<li>` holding a full-width button or link. */
function ListItem({
  value,
  current = false,
  disabled = false,
  asChild = false,
  href,
  className,
  children,
  onClick,
  type,
  ref,
  target,
  rel,
  ...rest
}: ListItemProps) {
  const reorder = React.useContext(ReorderContext);
  const presence = React.useContext(PresenceContext);
  const key = React.useContext(RowKeyContext);
  const rowRef = React.useRef<HTMLLIElement | null>(null);
  const entered = useListItemPresence(
    presence ?? NO_PRESENCE,
    key ?? value ?? "",
    rowRef as React.RefObject<HTMLElement | null>,
  );
  const link = href !== undefined || asChild;
  // The row's own controls leave the row element for the row (a button cannot hold a control).
  const slotted = asChild ? slotChild(children, "List.Item") : null;
  const { parts: actions, rest: content } = splitParts(
    slotted ? slotted.props.children : children,
    ListItemActions,
  );
  const shared = {
    ...rest,
    ref,
    disabled,
    className: cx(styles.item, touchTargetRowClass, className),
    onClick: onClick as React.MouseEventHandler<HTMLElement> | undefined,
    "aria-current": current ? (link ? ("page" as const) : ("true" as const)) : rest["aria-current"],
    ...toDataAttributes({ disabled: disabled || undefined }),
  };

  let element: React.ReactElement;
  if (asChild) {
    element = (
      <InteractiveElement {...shared} element="slot">
        {React.cloneElement(slotted as React.ReactElement, undefined, splitItemChildren(content))}
      </InteractiveElement>
    );
  } else if (href !== undefined) {
    element = (
      <InteractiveElement {...shared} element="link" href={href} target={target} rel={rel}>
        {splitItemChildren(content)}
      </InteractiveElement>
    );
  } else {
    element = (
      <InteractiveElement {...shared} element="button" type={type ?? "button"}>
        {splitItemChildren(content)}
      </InteractiveElement>
    );
  }
  if (actions.length > 0) {
    // The frame draws the row's fills under the element and its controls alike.
    element = (
      <div className={styles.frame}>
        {element}
        {actions}
      </div>
    );
  }

  const rowClass = cx(styles.row, entered && enterMotion.enter);
  if (reorder === null || value === undefined) {
    return (
      <li ref={rowRef} className={rowClass}>
        {element}
      </li>
    );
  }

  // A reorderable row: the grip after the row element and its controls, at the row's end (a button
  // cannot hold a button), so Tab reaches the row before its grip; Dnd makes the grip busy while the
  // owner saves this row's move.
  const label = formatLabel(reorder.handleLabel, { label: itemLabel({ asChild, children }) });
  return (
    <Dnd.SortableItem
      ref={rowRef}
      id={value}
      disabled={disabled}
      className={cx(rowClass, styles.sortableRow)}
    >
      {element}
      <span className={cx(fieldTierClass, styles.grip)} data-size="xs">
        <Dnd.Handle aria-label={label.trim()} disabled={disabled} />
      </span>
    </Dnd.SortableItem>
  );
}
ListItem.displayName = "List.Item";

// ─── Public API ───────────────────────────────────────────────────────────────

export const List = {
  Root: ListRoot,
  Item: ListItem,
  ItemIcon: ListItemIcon,
  ItemText: ListItemText,
  ItemDescription: ListItemDescription,
  ItemMeta: ListItemMeta,
  ItemCount: ListItemCount,
  ItemActions: ListItemActions,
};
