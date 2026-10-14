import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { DragControllerContext } from "@/components/dnd/context";
import { Dnd } from "@/components/dnd/Dnd";
import { Spinner } from "@/components/spinner/Spinner";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { formatLabel } from "@/internal/formatLabel";
import { Slot } from "@/internal/slot";
import type { ControlSize, PaletteColor } from "@/internal/states";

import styles from "./List.module.css";

// ─── Root ─────────────────────────────────────────────────────────────────────

export type ListLabels = {
  /** `aria-label` of a row's drag handle (`onReorder`); `{label}` is the row's text. */
  reorderItem: string;
};

const LIST_LABELS: ListLabels = {
  reorderItem: "Переместить {label}",
};

/** What a row of a reorderable list needs: the moves still being saved and the handle's name. */
type ReorderContextValue = {
  pending: ReadonlySet<string>;
  handleLabel: string;
};

const ReorderContext = React.createContext<ReorderContextValue | null>(null);

export type ListRootProps = Omit<React.HTMLAttributes<HTMLUListElement>, "children"> & {
  /** Row tier: height, text, icon and avatar size; counts take one tier down. Default `m`. */
  size?: ControlSize;
  /**
   * Rows reorder by a leading handle (drag, a touch hold, Alt + ↑ / ↓): the row `id` now stands
   * in front of `beforeId` (`List.Item` `value`s; `null` — last). Apply it with `moveBefore`.
   * Return a promise to save on a server: the row stays in its new place with a busy handle, a
   * rejection moves it back. Every `List.Item` then needs a `value`.
   */
  onReorder?: (id: string, beforeId: string | null) => void | Promise<void>;
  /** Built-in strings. */
  labels?: Partial<ListLabels>;
  /** `List.Item`s. */
  children?: React.ReactNode;
  ref?: React.Ref<HTMLUListElement>;
};

/**
 * A selectable navigation list: the master half of a list + detail screen (conversations, tickets,
 * mail, records). Rows are buttons or links; the open record is `current`.
 */
function ListRoot({ size = "m", onReorder, labels, className, children, ...rest }: ListRootProps) {
  const [pending, setPending] = React.useState<ReadonlySet<string>>(() => new Set());
  const handleLabel = labels?.reorderItem ?? LIST_LABELS.reorderItem;
  const reorder = React.useMemo<ReorderContextValue>(
    () => ({ pending, handleLabel }),
    [pending, handleLabel],
  );
  const latest = React.useRef(onReorder);
  latest.current = onReorder;

  const move = React.useCallback((id: string, beforeId: string | null) => {
    const outcome = latest.current?.(id, beforeId);
    if (!(outcome instanceof Promise)) return;
    setPending((set) => new Set(set).add(id));
    const done = () =>
      setPending((set) => {
        const next = new Set(set);
        next.delete(id);
        return next;
      });
    outcome.then(done, done);
    // Dnd keeps the row in its new place until the promise settles and glides it back on a rejection.
    return outcome;
  }, []);

  if (onReorder === undefined) {
    return (
      <ControlSizeProvider value={size}>
        <ul {...rest} className={cx(styles.root, className)} {...toDataAttributes({ size })}>
          {children}
        </ul>
      </ControlSizeProvider>
    );
  }

  const items = React.Children.toArray(children).filter(
    (node): node is React.ReactElement<ListItemProps> => isPart(node, ListItem),
  );
  const { ref, ...listRest } = rest;
  return (
    <ControlSizeProvider value={size}>
      <ReorderContext value={reorder}>
        <ReorderSession>
          <Dnd.Sortable
            {...listRest}
            ref={ref as React.Ref<HTMLElement>}
            as="ul"
            items={items}
            getId={itemId}
            getLabel={itemLabelOf}
            onReorder={move}
            renderItem={(item) => item}
            handle
            className={cx(styles.root, className)}
            {...toDataAttributes({ size, reorderable: true })}
          />
        </ReorderSession>
      </ReorderContext>
    </ControlSizeProvider>
  );
}
ListRoot.displayName = "List.Root";

/** Mounts the drag session the rows need, unless the app already has one above the list. */
function ReorderSession({ children }: { children: React.ReactNode }) {
  const outer = React.useContext(DragControllerContext);
  return outer ? children : <Dnd.Root>{children}</Dnd.Root>;
}

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
  /** An `Avatar.Root` (sized by the row) or an `Icon`. */
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * The leading picture of a row: an avatar the slot sizes to the tier, or an icon. After the text
 * it is a quiet trailing glyph. Decorative: the text names the row.
 */
function ListItemIcon({ className, ...rest }: ListItemIconProps) {
  return <span {...rest} className={cx(styles.icon, className)} aria-hidden="true" />;
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
  /** Badge hue. Default `gray`; a hue for what needs attention (unread). */
  color?: PaletteColor;
  /** The number (or a short status). */
  children: React.ReactNode;
  /** The Badge `<span>`. */
  ref?: React.Ref<HTMLSpanElement>;
};

/** A count at the end of the row: a soft Badge one tier below the rows. */
function ListItemCount({ color = "gray", className, ...rest }: ListItemCountProps) {
  return <Badge.Root {...rest} color={color} className={cx(styles.count, className)} />;
}
ListItemCount.displayName = "List.ItemCount";

const isPart = (node: React.ReactNode, type: React.ElementType): node is React.ReactElement =>
  React.isValidElement(node) && node.type === type;

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

/** The plain text of a node tree. */
function plainText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(plainText).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node))
    return plainText(node.props.children);
  return "";
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
  return plainText(source).trim();
}

// ─── Item ─────────────────────────────────────────────────────────────────────

type ListItemOwnProps = {
  /** Stable id of the row; required in a reorderable list (`List.Root` `onReorder`). */
  value?: string;
  /**
   * The open record: the selected fill and `aria-current` — `"true"` on a button, `"page"` on a
   * link (`href`, `asChild`). Links rendered by a router may set it themselves.
   */
  current?: boolean;
  disabled?: boolean;
  /** Render the single child element (a router link) as the row; its children are the content. */
  asChild?: boolean;
  /**
   * Content and parts: `List.ItemIcon`, `List.ItemText`, `List.ItemDescription`, `List.ItemMeta`,
   * `List.ItemCount`.
   */
  children?: React.ReactNode;
};

export type ListItemProps = ListItemOwnProps &
  Omit<React.ComponentPropsWithoutRef<"button">, keyof ListItemOwnProps> & {
    /** Renders an `<a>` instead of a `<button>`. */
    href?: string;
    target?: string;
    rel?: string;
    /** The `<button>`, `<a>` or the `asChild` element (not the `<li>`). */
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
  ...rest
}: ListItemProps) {
  const reorder = React.useContext(ReorderContext);
  const link = href !== undefined || asChild;
  const shared = {
    ...rest,
    className: cx(styles.item, className),
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event as React.MouseEvent<HTMLButtonElement>);
    },
    "aria-current": current ? (link ? ("page" as const) : ("true" as const)) : rest["aria-current"],
    ...toDataAttributes({ disabled: disabled || undefined }),
  };

  const child =
    asChild && React.isValidElement<{ children?: React.ReactNode }>(children) ? children : null;

  let element: React.ReactElement;
  if (child) {
    element = (
      // A disabled child keeps its own `href` / `to`: out of the Tab order like the other kinds.
      <Slot
        {...shared}
        ref={ref}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : rest.tabIndex}
      >
        {React.cloneElement(child, undefined, splitItemChildren(child.props.children))}
      </Slot>
    );
  } else if (href !== undefined) {
    element = (
      <a
        {...(shared as React.ComponentPropsWithoutRef<"a">)}
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
      >
        {splitItemChildren(children)}
      </a>
    );
  } else {
    element = (
      <button
        {...shared}
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type ?? "button"}
        disabled={disabled}
      >
        {splitItemChildren(children)}
      </button>
    );
  }

  if (reorder === null || value === undefined) return <li className={styles.row}>{element}</li>;

  // A reorderable row: the grip beside the row element (a button cannot hold a button), a spinner
  // in its place while the owner saves this row's move.
  const busy = reorder.pending.has(value);
  const label = formatLabel(reorder.handleLabel, { label: itemLabel({ asChild, children }) });
  return (
    <Dnd.SortableItem
      id={value}
      disabled={busy || disabled}
      aria-busy={busy || undefined}
      className={cx(styles.row, styles.sortableRow)}
    >
      <span className={styles.grip}>
        {busy ? (
          <Spinner size="xs" />
        ) : (
          <Dnd.Handle aria-label={label.trim()} disabled={disabled} />
        )}
      </span>
      {element}
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
};
