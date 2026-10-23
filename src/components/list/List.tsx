import * as React from "react";

import { Badge, type BadgeGroupProps } from "@/components/badge/Badge";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { Dnd, DndLock } from "@/components/dnd/Dnd";
import { Switch } from "@/components/switch/Switch";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon } from "@/icons";
import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import { fieldTierClass } from "@/internal/fieldClasses";
import { formatLabel } from "@/internal/formatLabel";
import { HeaderLineContent, useTitleFloor } from "@/internal/headerRow";
import { InteractiveElement } from "@/internal/interactiveElement";
import { useLabels } from "@/internal/labels";
import { type ListPresence, useListItemPresence, useListPresence } from "@/internal/listPresence";
import { ListRowControls, type ListRowLines, ListRowMark } from "@/internal/listRow";
import listRowStyles from "@/internal/listRow.module.css";
import { nodeText } from "@/internal/nodeText";
import { usePartPresence } from "@/internal/partPresence";
import { flattenChildren, isPart, splitParts } from "@/internal/parts";
import { rovingIndex } from "@/internal/rovingFocus";
import { slotChild } from "@/internal/slot";
import { type ControlSize, type PaletteColor, type Tone, tierMappings } from "@/internal/states";
import { touchTargetRowClass } from "@/internal/touchTarget";

import styles from "./List.module.css";

// ─── Root ─────────────────────────────────────────────────────────────────────

export type ListLabels = {
  /** `aria-label` of a row's grip (`onReorder`); `{label}` is the row's text. */
  reorderItem: string;
  /** Name of the lock a `locked` row shows in the grip's place; `{label}` is the row's text. */
  lockedItem: string;
};

export const LIST_LABELS: ListLabels = {
  reorderItem: "Переместить {label}",
  lockedItem: "{label}: закреплено",
};

type Selection = {
  multiple: boolean;
  indicator: "start" | "end";
  isChecked: (value: string) => boolean;
  toggle: (value: string) => void;
  /** The row that holds the list's one Tab stop (roving focus). */
  active: string | null;
  setActive: (value: string) => void;
};

type Reorder = {
  handle: "end" | "start" | "row";
  handleLabel: string;
  lockLabel: string;
  /** Anything can move: two rows that are not locked, one of them enabled. */
  active: boolean;
};

type ListContextValue = {
  size: ControlSize;
  selection: Selection | null;
  reorder: Reorder | null;
  presence: ListPresence | null;
};

const ListContext = React.createContext<ListContextValue | null>(null);
const RowKeyContext = React.createContext<string | null>(null);

/** The presence key of a row: its `value`, else its React key. */
const rowKey = (item: React.ReactElement<ListItemProps>, index: number): string =>
  item.props.value ?? String(item.key ?? index);

/** Every row of the list, the rows of its groups too, in reading order. */
function collectItems(nodes: React.ReactNode[]): React.ReactElement<ListItemProps>[] {
  return nodes.flatMap((node) => {
    if (isPart<ListItemProps>(node, ListItem)) return [node];
    if (isPart<ListGroupProps>(node, ListGroup))
      return collectItems(flattenChildren(node.props.children));
    return [];
  });
}

type SelectionValue = string | string[] | null;

export type ListRootProps = Omit<
  React.HTMLAttributes<HTMLUListElement>,
  "children" | "defaultValue" | "onChange"
> & {
  size?: ControlSize;
  value?: SelectionValue;
  defaultValue?: SelectionValue;
  onValueChange?: (value: SelectionValue) => void;
  multiple?: boolean;
  indicator?: "start" | "end";
  onReorder?: (value: string, beforeValue: string | null) => void | Promise<void>;
  handle?: "end" | "start" | "row";
  actions?: "always" | "hover";
  labels?: Partial<ListLabels>;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLUListElement>;
};

/**
 * A list of records or places: the kit's one list row stacked 2 apart. Rows are buttons, links or
 * plain boxes; the open record is `current`. With a value it is a choice (`multiple` — checkboxes);
 * with `onReorder` its rows move by their grips. Rows the data adds or takes out rise in and close up.
 */
function ListRoot({
  size: sizeProp,
  value: valueProp,
  defaultValue,
  onValueChange,
  multiple = false,
  indicator = "start",
  onReorder,
  handle = "end",
  actions = "always",
  labels,
  className,
  children,
  onKeyDown,
  ...rest
}: ListRootProps) {
  const tier = useHostTier(sizeProp);
  const size = tier.size;
  const { reorderItem: handleLabel, lockedItem: lockLabel } = useLabels(LIST_LABELS, labels);
  const selectable =
    valueProp !== undefined || defaultValue !== undefined || onValueChange !== undefined;
  const [value, setValue] = useControllableState<SelectionValue>({
    value: valueProp,
    defaultValue: defaultValue ?? (multiple ? [] : null),
    onChange: onValueChange,
  });

  const nodes = flattenChildren(children);
  const items = collectItems(nodes);
  const direct = nodes.filter((node): node is React.ReactElement<ListItemProps> =>
    isPart(node, ListItem),
  );

  const checked = React.useMemo(
    () =>
      new Set(Array.isArray(value) ? value : value === null || value === undefined ? [] : [value]),
    [value],
  );
  const [focused, setFocused] = React.useState<string | null>(null);
  const firstEnabled = items.find((item) => !item.props.disabled)?.props.value ?? null;
  const firstChecked = items.find(
    (item) => item.props.value !== undefined && checked.has(item.props.value),
  )?.props.value;
  const active = focused ?? firstChecked ?? firstEnabled;
  const selection = React.useMemo<Selection | null>(
    () =>
      selectable
        ? {
            multiple,
            indicator,
            isChecked: (item) => checked.has(item),
            toggle: (item) =>
              setValue((previous) => {
                if (!multiple) return item;
                const list = Array.isArray(previous) ? previous : [];
                return list.includes(item)
                  ? list.filter((entry) => entry !== item)
                  : [...list, item];
              }),
            active,
            setActive: setFocused,
          }
        : null,
    [selectable, multiple, indicator, checked, setValue, active],
  );

  const latest = React.useRef(onReorder);
  latest.current = onReorder;
  // Dnd keeps a row in its new place, busy, until a returned promise settles; a rejection glides it
  // back.
  const move = React.useCallback(
    (id: string, beforeId: string | null) => latest.current?.(id, beforeId),
    [],
  );
  const unlocked = direct.filter((item) => !item.props.locked);
  const reorder = React.useMemo<Reorder | null>(
    () =>
      onReorder === undefined
        ? null
        : {
            handle,
            handleLabel,
            lockLabel,
            active: unlocked.length >= 2 && unlocked.some((item) => !item.props.disabled),
          },
    [onReorder, handle, handleLabel, lockLabel, unlocked],
  );

  const presence = useListPresence(items.map(rowKey));
  const context = React.useMemo<ListContextValue>(
    () => ({ size, selection, reorder, presence }),
    [size, selection, reorder, presence],
  );
  const keyed = (node: React.ReactNode) =>
    isPart<ListItemProps>(node, ListItem) ? (
      <RowKeyContext
        key={node.key ?? items.indexOf(node)}
        value={rowKey(node, items.indexOf(node))}
      >
        {node}
      </RowKeyContext>
    ) : (
      node
    );

  // Arrow keys move between the options of a choice; the list keeps one Tab stop.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || selection === null) return;
    const options = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        '[role="option"]:not([aria-disabled="true"])',
      ),
    );
    const from = options.indexOf(document.activeElement as HTMLElement);
    const next = rovingIndex(event.key, from, options.length, "vertical", { wrap: false });
    if (next === null) return;
    event.preventDefault();
    options[next]?.focus();
  };

  const shared = {
    className: cx(fieldTierClass, listRowStyles.tier, styles.root, className),
    ...toDataAttributes({ size, actions: actions === "hover" ? "hover" : undefined }),
  };

  if (reorder === null) {
    return tier.provide(
      <ListContext value={context}>
        {selection ? (
          <ul
            // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: a choice keeps the list's element (its rows stay `<li>`); the options carry the state
            role="listbox"
            aria-multiselectable={multiple || undefined}
            {...rest}
            {...shared}
            onKeyDown={handleKeyDown}
          >
            {nodes.map(keyed)}
          </ul>
        ) : (
          // biome-ignore lint/a11y/noRedundantRoles: `list-style: none` drops the list semantics in WebKit; the role keeps them
          <ul role="list" {...rest} {...shared} onKeyDown={onKeyDown}>
            {nodes.map(keyed)}
          </ul>
        )}
      </ListContext>,
    );
  }

  const { ref, ...listRest } = rest;
  return tier.provide(
    <ListContext value={context}>
      <Dnd.Root>
        <Dnd.Sortable
          role="list"
          {...listRest}
          ref={ref as React.Ref<HTMLElement>}
          as="ul"
          items={direct}
          getId={itemId}
          getLabel={(item) => itemLabel(item.props)}
          onReorder={move}
          renderItem={(item) => keyed(item)}
          handle={handle !== "row"}
          disabled={!reorder.active}
          {...shared}
          data-reorderable=""
        />
      </Dnd.Root>
    </ListContext>,
  );
}
ListRoot.displayName = "List.Root";

function itemId(item: React.ReactElement<ListItemProps>): string {
  const { value } = item.props;
  if (value === undefined)
    throw new Error("List.Item needs a `value` when List.Root has onReorder");
  return value;
}

// ─── Group ────────────────────────────────────────────────────────────────────

export type ListGroupProps = Omit<React.HTMLAttributes<HTMLLIElement>, "children"> & {
  label?: React.ReactNode;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLLIElement>;
};

/** Rows under a heading: the heading 28 tall, the rows as the list's. */
function ListGroup({ label, className, children, ...rest }: ListGroupProps) {
  const id = React.useId();
  return (
    <li {...rest} role="presentation" className={cx(styles.group, className)}>
      {label ? (
        <div id={id} className={styles.groupLabel} role="presentation">
          {label}
        </div>
      ) : null}
      {/* biome-ignore lint/a11y/useSemanticElements: the rows (or the options of a choice) under their heading; a fieldset is for form controls */}
      <ul role="group" aria-labelledby={label ? id : undefined} className={styles.groupList}>
        {children}
      </ul>
    </li>
  );
}
ListGroup.displayName = "List.Group";

// ─── Parts of a row ───────────────────────────────────────────────────────────

type ItemContextValue = { size: ControlSize; lines: ListRowLines; badged: boolean };

const ItemContext = React.createContext<ItemContextValue>({
  size: "m",
  lines: "line",
  badged: false,
});

/** A title without badges keeps no floor. */
const NO_REF: React.RefObject<HTMLElement | null> = { current: null };

export type ListItemIconProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  tone?: Tone;
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * The leading mark: an `Icon` (bare beside one line, on a tile beside a description), an
 * `Avatar.Root`, a `ProgressCircle`, a `Thumbnail.Root` or a `Badge.Dot`. After the text it is a
 * quiet trailing glyph.
 */
function ListItemIcon({ tone, children, ...rest }: ListItemIconProps) {
  const { size, lines } = React.useContext(ItemContext);
  return (
    <ListRowMark {...rest} size={size} lines={lines} tone={tone}>
      {children}
    </ListRowMark>
  );
}
ListItemIcon.displayName = "List.ItemIcon";

export type ListItemTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  number?: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * The title: one line cut with an ellipsis. Beside badges it gives way first, down to its text or
 * 8em. A record's `number` follows it, muted, and is never cut.
 */
function ListItemText({ number, className, ref, ...rest }: ListItemTextProps) {
  const { badged } = React.useContext(ItemContext);
  const own = React.useRef<HTMLSpanElement>(null);
  const tail = React.useRef<HTMLSpanElement>(null);
  const merged = useMergedRefs(own, ref);
  const numbered = number !== undefined && number !== null && number !== false && number !== "";
  useTitleFloor(badged ? own : NO_REF, badged ? own : undefined, numbered ? tail : undefined);
  const title = <span {...rest} ref={merged} className={cx(listRowStyles.title, className)} />;
  if (!numbered) return title;
  return (
    <>
      {title}{" "}
      <span ref={tail} className={listRowStyles.number}>
        {number}
      </span>
    </>
  );
}
ListItemText.displayName = "List.ItemText";

export type ListItemBadgesProps = Omit<BadgeGroupProps, "size" | "overflow">;

/** The record's badges on the title's line, as tall as it; what does not fit folds into «+N». */
function ListItemBadges({ className, ...rest }: ListItemBadgesProps) {
  const { size } = React.useContext(ItemContext);
  return (
    <Badge.Group
      {...rest}
      size={tierMappings.cardBadges[size]}
      overflow="count"
      className={cx(listRowStyles.badges, className)}
    />
  );
}
ListItemBadges.displayName = "List.ItemBadges";

export type ListItemDescriptionProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** The line under the title: muted, one line; a `StatusDot` first, the rest after «·». */
function ListItemDescription({ className, children, ...rest }: ListItemDescriptionProps) {
  return (
    <span {...rest} className={cx(listRowStyles.description, className)}>
      <HeaderLineContent>{children}</HeaderLineContent>
    </span>
  );
}
ListItemDescription.displayName = "List.ItemDescription";

export type ListItemMetaProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** A time, a date or a value at the end; over the count beside a description. */
function ListItemMeta({ className, ...rest }: ListItemMetaProps) {
  return <span {...rest} className={cx(listRowStyles.meta, className)} />;
}
ListItemMeta.displayName = "List.ItemMeta";

export type ListItemCountProps = Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "children" | "color"
> & {
  color?: PaletteColor;
  variant?: "solid" | "soft" | "outline";
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/** A count at the end: a plain muted number; a `Badge` when `color` or `variant` asks for attention. */
function ListItemCount({ color, variant, className, ...rest }: ListItemCountProps) {
  const { size } = React.useContext(ItemContext);
  if (color === undefined && variant === undefined) {
    return <span {...rest} className={cx(listRowStyles.count, className)} />;
  }
  return (
    <Badge.Root
      {...rest}
      color={color}
      variant={variant ?? "soft"}
      size={tierMappings.cardBadges[size]}
      className={className}
    />
  );
}
ListItemCount.displayName = "List.ItemCount";

export type ListItemActionsProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The row's own controls (icon Buttons, a labelled Button, a Switch, a Dropdown): beside the row's
 * element and never inside it, as tall as the row minus 8 (a tier down beside a description).
 */
function ListItemActions(props: ListItemActionsProps) {
  const { size, lines } = React.useContext(ItemContext);
  return <ListRowControls {...props} size={size} lines={lines} />;
}
ListItemActions.displayName = "List.ItemActions";

/** Words apart in the accessible name; a flex container renders no space. */
function spaced(nodes: React.ReactNode[]): React.ReactNode[] {
  return nodes.flatMap((node, index) => (index === 0 ? [node] : [" ", node]));
}

type ItemParts = {
  mark: React.ReactNode;
  title: React.ReactNode;
  badges: React.ReactNode;
  description: React.ReactNode;
  end: React.ReactNode[];
  actions: React.ReactElement<ListItemActionsProps>[];
  lines: ListRowLines;
};

/** The parts of a row in their places; loose content becomes the title. */
function splitItem(children: React.ReactNode): ItemParts {
  const nodes = flattenChildren(children);
  const { parts: actions, rest } = splitParts<ListItemActionsProps>(nodes, ListItemActions);
  let mark: React.ReactNode = null;
  let title: React.ReactNode = null;
  let badges: React.ReactNode = null;
  let description: React.ReactNode = null;
  let meta: React.ReactNode = null;
  let count: React.ReactNode = null;
  const trailing: React.ReactNode[] = [];
  const loose: React.ReactNode[] = [];
  for (const node of rest) {
    if (isPart(node, ListItemIcon)) {
      if (mark === null && title === null && loose.length === 0) mark = node;
      else trailing.push(node);
    } else if (isPart(node, ListItemText)) title = node;
    else if (isPart(node, ListItemBadges)) badges = node;
    else if (isPart(node, ListItemDescription)) description = node;
    else if (isPart(node, ListItemMeta)) meta = node;
    else if (isPart(node, ListItemCount)) count = node;
    else loose.push(node);
  }
  if (title === null && loose.length > 0) {
    title = <span className={listRowStyles.title}>{loose}</span>;
  }
  const lines: ListRowLines = description ? "two" : "line";
  // Beside two lines a meta and a count stand in one column, the meta over the count.
  const end: React.ReactNode[] =
    lines === "two" && meta && count
      ? [
          <span key="stack" className={listRowStyles.stack}>
            {meta} {count}
          </span>,
        ]
      : [meta, count].filter(Boolean);
  return { mark, title, badges, description, end: [...end, ...trailing], actions, lines };
}

/** What a row is called by its grip and in drag announcements: its title. */
function itemLabel({ asChild, children }: Pick<ListItemProps, "asChild" | "children">): string {
  const content =
    asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
      ? children.props.children
      : children;
  const nodes = flattenChildren(content);
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
  locked?: boolean;
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

/** A row: an `<li>` holding the row's button, link or plain box and its own controls. */
function ListItem({
  value,
  current = false,
  disabled = false,
  locked = false,
  asChild = false,
  href,
  className,
  children,
  onClick,
  onKeyDown,
  onFocus,
  type,
  ref,
  target,
  rel,
  ...rest
}: ListItemProps) {
  const list = React.useContext(ListContext);
  const size = list?.size ?? "m";
  const selection = list?.selection ?? null;
  const reorder = list?.reorder ?? null;
  const key = React.useContext(RowKeyContext);
  const liRef = React.useRef<HTMLLIElement | null>(null);
  const rowRef = React.useRef<HTMLDivElement | null>(null);
  const entered = useListItemPresence(
    list?.presence ?? NO_PRESENCE,
    key ?? value ?? "",
    liRef as React.RefObject<HTMLElement | null>,
    "block",
  );
  const grip = usePartPresence<HTMLElement>({ present: reorder?.active ?? false, axis: "inline" });

  const slotted = asChild ? slotChild(children, "List.Item") : null;
  const parts = splitItem(slotted ? slotted.props.children : children);
  const { lines } = parts;
  const checked = selection !== null && value !== undefined && selection.isChecked(value);
  // A row without its own action whose control is a Switch toggles it from anywhere on the row.
  const switchRow =
    selection === null &&
    !asChild &&
    href === undefined &&
    onClick === undefined &&
    type === undefined &&
    parts.actions.some((part) =>
      flattenChildren(part.props.children).some((child) => isPart(child, Switch.Root)),
    );

  const indicator =
    selection === null ? null : selection.multiple ? (
      <span className={listRowStyles.indicator}>
        <Checkbox.Indicator checked={checked} />
      </span>
    ) : (
      <span className={listRowStyles.check}>{checked ? <Icon name="action.check" /> : null}</span>
    );
  const atStart = selection !== null && selection.multiple && selection.indicator === "start";

  const content = (
    <>
      {atStart ? indicator : null}
      {parts.mark}
      <span className={listRowStyles.body}>
        {parts.badges || isNumbered(parts.title) ? (
          <span className={listRowStyles.titleRow}>
            {spaced([parts.title, parts.badges].filter(Boolean))}
          </span>
        ) : (
          parts.title
        )}
        {parts.description ? <> {parts.description}</> : null}
      </span>
      {parts.end.length > 0 || (indicator && !atStart) ? (
        <>
          {" "}
          <span className={listRowStyles.end}>
            {spaced(parts.end)}
            {indicator && !atStart ? indicator : null}
          </span>
        </>
      ) : null}
    </>
  );

  const hitClass = cx(listRowStyles.hit, touchTargetRowClass, className);
  let element: React.ReactElement;
  if (selection !== null) {
    const toggle = () => {
      if (!disabled && value !== undefined) selection.toggle(value);
    };
    element = (
      <div
        {...(rest as React.HTMLAttributes<HTMLDivElement>)}
        ref={ref as React.Ref<HTMLDivElement>}
        role="option"
        aria-selected={checked}
        aria-disabled={disabled || undefined}
        tabIndex={value !== undefined && selection.active === value ? 0 : -1}
        className={hitClass}
        data-interactive={disabled ? undefined : ""}
        onClick={(event) => {
          (onClick as React.MouseEventHandler<HTMLElement> | undefined)?.(event);
          toggle();
        }}
        onFocus={(event) => {
          (onFocus as React.FocusEventHandler<HTMLElement> | undefined)?.(event);
          if (value !== undefined) selection.setActive(value);
        }}
        onKeyDown={(event) => {
          (onKeyDown as React.KeyboardEventHandler<HTMLElement> | undefined)?.(event);
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            toggle();
          }
        }}
      >
        {content}
      </div>
    );
  } else {
    const link = href !== undefined || asChild;
    const shared = {
      ...rest,
      ref,
      disabled,
      onKeyDown: onKeyDown as React.KeyboardEventHandler<HTMLElement> | undefined,
      onFocus: onFocus as React.FocusEventHandler<HTMLElement> | undefined,
      className: hitClass,
      "aria-current": current
        ? link
          ? ("page" as const)
          : ("true" as const)
        : rest["aria-current"],
      ...toDataAttributes({
        disabled: disabled || undefined,
        interactive: disabled ? undefined : true,
      }),
    };
    if (asChild) {
      element = (
        <InteractiveElement
          {...shared}
          onClick={onClick as React.MouseEventHandler<HTMLElement> | undefined}
          element="slot"
        >
          {React.cloneElement(slotted as React.ReactElement, undefined, content)}
        </InteractiveElement>
      );
    } else if (href !== undefined) {
      element = (
        <InteractiveElement
          {...shared}
          onClick={onClick as React.MouseEventHandler<HTMLElement> | undefined}
          element="link"
          href={href}
          target={target}
          rel={rel}
        >
          {content}
        </InteractiveElement>
      );
    } else if (onClick !== undefined || type !== undefined) {
      element = (
        <InteractiveElement
          {...shared}
          onClick={onClick as React.MouseEventHandler<HTMLElement> | undefined}
          element="button"
          type={type ?? "button"}
        >
          {content}
        </InteractiveElement>
      );
    } else {
      // A row that opens nothing is no button: a plain box out of the Tab order. With a Switch it
      // toggles from anywhere on the row (the switch keeps the keyboard and the name).
      const { "data-interactive": _interactive, ...still } = shared as typeof shared & {
        "data-interactive"?: string;
      };
      element = (
        <InteractiveElement
          {...still}
          element="static"
          data-interactive={switchRow && !disabled ? "" : undefined}
        >
          {content}
        </InteractiveElement>
      );
    }
  }

  const gripNode =
    reorder !== null && reorder.handle !== "row" && value !== undefined ? (
      <span
        className={cx(listRowStyles.actions, styles.grip)}
        data-side={reorder.handle}
        // The grip is as tall as the row's controls.
      >
        {!reorder.active ? null : locked ? (
          <DndLock
            ref={grip.ref}
            className={grip.className}
            aria-label={formatLabel(reorder.lockLabel, {
              label: itemLabel({ asChild, children }),
            }).trim()}
          />
        ) : (
          <Dnd.Handle
            ref={grip.ref}
            className={grip.className}
            aria-label={formatLabel(reorder.handleLabel, {
              label: itemLabel({ asChild, children }),
            }).trim()}
            disabled={disabled}
          />
        )}
      </span>
    ) : null;

  const row = (
    <ItemContext value={{ size, lines, badged: Boolean(parts.badges) }}>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents lint/a11y/noStaticElementInteractions: a pointer shortcut only — the row's Switch keeps the keyboard and the name */}
      <div
        ref={rowRef}
        onClick={
          switchRow && !disabled
            ? (event) => {
                const control = rowRef.current?.querySelector<HTMLElement>('[role="switch"]');
                if (control && !control.contains(event.target as Node)) control.click();
              }
            : undefined
        }
        className={listRowStyles.row}
        {...toDataAttributes({
          lines: lines === "two" ? "two" : undefined,
          current: current || undefined,
          checked: (checked && selection?.multiple) || undefined,
          disabled: disabled || undefined,
        })}
      >
        {reorder?.handle === "start" ? gripNode : null}
        {element}
        {parts.actions.map((part, index) => (
          <ListItemActions key={part.key ?? `actions-${index}`} {...part.props} />
        ))}
        {reorder?.handle === "end" ? gripNode : null}
      </div>
    </ItemContext>
  );

  const liClass = cx(styles.item, entered && enterMotion.enter);
  if (reorder === null || value === undefined) {
    return (
      <li ref={liRef} className={liClass} role={selection ? "presentation" : undefined}>
        {row}
      </li>
    );
  }
  return (
    <Dnd.SortableItem
      ref={liRef}
      id={value}
      disabled={disabled}
      locked={locked}
      className={cx(liClass, styles.sortable)}
    >
      {row}
    </Dnd.SortableItem>
  );
}
ListItem.displayName = "List.Item";

function isNumbered(title: React.ReactNode): boolean {
  if (!isPart<ListItemTextProps>(title, ListItemText)) return false;
  const { number } = title.props;
  return number !== undefined && number !== null && number !== false && number !== "";
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const List = {
  Root: ListRoot,
  Group: ListGroup,
  Item: ListItem,
  ItemIcon: ListItemIcon,
  ItemText: ListItemText,
  ItemBadges: ListItemBadges,
  ItemDescription: ListItemDescription,
  ItemMeta: ListItemMeta,
  ItemCount: ListItemCount,
  ItemActions: ListItemActions,
};
