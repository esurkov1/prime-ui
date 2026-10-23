import * as React from "react";

import { Avatar, type AvatarRootProps } from "@/components/avatar/Avatar";
import { Badge } from "@/components/badge/Badge";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { Thumbnail, type ThumbnailRootProps } from "@/components/thumbnail/Thumbnail";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { highlightChildren } from "@/internal/HighlightMatch";
import { HeaderLineContent } from "@/internal/headerRow";
import { iconSlotClass } from "@/internal/iconBox";
import { optionDomId, useListboxItem, useStoreSlice } from "@/internal/listbox";
import { type ListRowLines, ListRowMark, listRowStyles } from "@/internal/listRow";
import { MenuRowCheck, menuRowProps, menuRowTier } from "@/internal/MenuGroup";
import { nodeText } from "@/internal/nodeText";
import palette from "@/internal/palette.module.css";
import { isPart } from "@/internal/parts";
import { type ControlSize, type PaletteColor, tierMappings } from "@/internal/states";

import styles from "./Select.module.css";
import { normalize, useSelectContext } from "./selectContext";

type SpanProps = React.HTMLAttributes<HTMLSpanElement> & { ref?: React.Ref<HTMLSpanElement> };

// ─── Rich option parts (row and trigger) ─────────────────────────────────────

/**
 * The option row a part stands in: the panel's tier, whether the row has a description and the
 * search query. `null` in the trigger (`renderValue`): the parts take the field's look there and
 * the query never marks them.
 */
type OptionRowContextValue = { panel: ControlSize; lines: ListRowLines; query: string };

const OptionRowContext = React.createContext<OptionRowContextValue | null>(null);

export type SelectItemIconProps = SpanProps;

/**
 * A leading glyph of an option (decorative): the row's mark — bare beside one line, on a tile
 * beside a description; in the trigger a field glyph before the value.
 */
export function SelectItemIcon({ className, children, ...rest }: SelectItemIconProps) {
  const row = React.useContext(OptionRowContext);
  if (row) {
    return (
      <ListRowMark {...rest} size={menuRowTier(row.panel)} lines={row.lines} className={className}>
        {children}
      </ListRowMark>
    );
  }
  return (
    <span aria-hidden="true" className={cx(styles.triggerIcon, iconSlotClass, className)} {...rest}>
      {children}
    </span>
  );
}
SelectItemIcon.displayName = "Select.ItemIcon";

export type SelectItemTextProps = SpanProps & { children: React.ReactNode };

/** Title of a rich option; its text is the option label (trigger, typeahead, search). */
export function SelectItemText({ children, className, ...rest }: SelectItemTextProps) {
  const row = React.useContext(OptionRowContext);
  return (
    <span {...rest} className={cx(row ? listRowStyles.title : styles.itemTitle, className)}>
      {highlightChildren(children, row?.query ?? "")}
    </span>
  );
}
SelectItemText.displayName = "Select.ItemText";

export type SelectItemDescriptionProps = SpanProps & { children: React.ReactNode };

/** Muted second line under `Select.ItemText`; searchable. Makes the row two-line. */
export function SelectItemDescription({
  children,
  className,
  ...rest
}: SelectItemDescriptionProps) {
  const row = React.useContext(OptionRowContext);
  if (row) {
    return (
      <span {...rest} className={cx(listRowStyles.description, className)}>
        <HeaderLineContent>{highlightChildren(children, row.query)}</HeaderLineContent>
      </span>
    );
  }
  return (
    <span {...rest} className={cx(styles.itemDescription, className)}>
      {children}
    </span>
  );
}
SelectItemDescription.displayName = "Select.ItemDescription";

export type SelectItemMetaProps = SpanProps & { children: React.ReactNode };

/** Trailing meta of an option (price, count): muted, tabular, before the check. */
export function SelectItemMeta({ children, className, ...rest }: SelectItemMetaProps) {
  const row = React.useContext(OptionRowContext);
  return (
    <span {...rest} className={cx(row ? listRowStyles.meta : styles.itemMeta, className)}>
      {children}
    </span>
  );
}
SelectItemMeta.displayName = "Select.ItemMeta";

type ItemParts = {
  /** `Select.ItemIcon`, `Avatar.Root` and `Thumbnail.Root`, before the text. */
  leading: React.ReactNode[];
  /** Title, description and plain text, in one column. */
  body: React.ReactNode[];
  /** `Select.ItemMeta` and `Badge.Root`, after the text. */
  meta: React.ReactNode[];
  /** Two-line layout: a description or a media tile is present. */
  rich: boolean;
  /** Text of `Select.ItemText`, else of the plain text children. */
  title: string;
  description: string;
};

/** Sorts the direct children of an item (fragments flattened) into the row slots by part type. */
export function splitItemChildren(children: React.ReactNode): ItemParts {
  const parts: ItemParts = {
    leading: [],
    body: [],
    meta: [],
    rich: false,
    title: "",
    description: "",
  };
  let plain = "";
  for (const child of React.Children.toArray(children)) {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) {
      plain += nodeText(child);
      parts.body.push(child);
    } else if (child.type === React.Fragment) {
      const inner = splitItemChildren(child.props.children);
      parts.leading.push(...inner.leading);
      parts.body.push(...inner.body);
      parts.meta.push(...inner.meta);
      parts.rich ||= inner.rich;
      parts.title ||= inner.title;
      parts.description ||= inner.description;
      plain += inner.title;
    } else if (child.type === SelectItemIcon || child.type === Avatar.Root) {
      parts.leading.push(child);
    } else if (child.type === Thumbnail.Root) {
      parts.leading.push(child);
      parts.rich = true;
    } else if (child.type === SelectItemMeta || child.type === Badge.Root) {
      parts.meta.push(child);
    } else {
      if (child.type === SelectItemText) parts.title = nodeText(child.props.children);
      if (child.type === SelectItemDescription) {
        parts.description = nodeText(child.props.children);
        parts.rich = true;
      }
      parts.body.push(child);
    }
  }
  parts.title = (parts.title || plain).trim();
  return parts;
}

/**
 * A `Thumbnail.Root` or `Avatar.Root` in a row or the trigger: sized to the tier unless it sets
 * `size`, decorative (the text names the option).
 */
export function sizeMedia(leading: React.ReactNode[], size: ControlSize): React.ReactNode[] {
  return leading.map((node) =>
    React.isValidElement<ThumbnailRootProps | AvatarRootProps>(node) &&
    (node.type === Thumbnail.Root || node.type === Avatar.Root)
      ? React.cloneElement(node, {
          size: node.props.size ?? tierMappings.rowMedia[size],
          className: cx(styles.media, node.props.className),
          "aria-hidden": true,
        } as Partial<ThumbnailRootProps & AvatarRootProps>)
      : node,
  );
}

// ─── Item ────────────────────────────────────────────────────────────────────

export type SelectItemProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "role" | "id" | "children"
> & {
  value: string;
  label?: string;
  color?: PaletteColor;
  keywords?: string;
  disabled?: boolean;
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

export function SelectItem({
  value,
  label,
  color,
  keywords,
  disabled = false,
  className,
  children,
  onClick,
  onMouseMove,
  ref,
  ...rest
}: SelectItemProps) {
  const { multiple, size, selected, highlight, pick, registry, listboxId, query, filter } =
    useSelectContext();

  const parts = splitItemChildren(children);
  const resolvedLabel = label || parts.title || value;
  const haystack = normalize(`${resolvedLabel} ${parts.description} ${keywords ?? ""}`);
  const isSelected = selected.includes(value);
  // Only this option's slice of the highlight: moving it re-renders two rows, not the list.
  const isHighlighted = useStoreSlice(highlight, (current) => current === value);
  const nodeRef = React.useRef<HTMLDivElement | null>(null);
  const setRefs = useMergedRefs(nodeRef, ref);
  useListboxItem(
    registry,
    value,
    { label: resolvedLabel, haystack, disabled, color, onActivate: () => pick(value) },
    nodeRef,
  );

  const search = normalize(query);
  if (filter && search !== "" && !haystack.includes(search)) return null;

  const lines: ListRowLines = parts.body.some((node) => isPart(node, SelectItemDescription))
    ? "two"
    : "line";
  return (
    // biome-ignore lint/a11y/useFocusableInteractive: focus stays on the listbox / search (aria-activedescendant)
    // biome-ignore lint/a11y/useKeyWithClickEvents: the keyboard is handled on the listbox
    <div
      {...rest}
      ref={setRefs}
      id={optionDomId(listboxId, value)}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) registry.activate(value);
      }}
      onMouseMove={(event) => {
        onMouseMove?.(event);
        if (!disabled && !isHighlighted) highlight.set(value);
      }}
      {...menuRowProps({
        size: menuRowTier(size),
        lines,
        highlighted: isHighlighted,
        disabled,
        // A choice of several tints its checked rows; a choice of one only checks at the end.
        checked: multiple && isSelected,
        className: cx(styles.item, color !== undefined && palette.hue, className),
      })}
      {...toDataAttributes({ value, color })}
    >
      {/* A choice of several: the checkbox column at the start. */}
      {multiple ? (
        <span className={listRowStyles.indicator}>
          <Checkbox.Indicator checked={isSelected} disabled={disabled} size={menuRowTier(size)} />
        </span>
      ) : null}
      <OptionRowContext value={{ panel: size, lines, query }}>
        <OptionRowContent parts={parts} panel={size} lines={lines} query={query}>
          {/* A choice of one: the check at the end, its place held on the other rows. */}
          {multiple ? null : <MenuRowCheck checked={isSelected} />}
        </OptionRowContent>
      </OptionRowContext>
    </div>
  );
}
SelectItem.displayName = "Select.Item";

/**
 * An option's content in the list row's places: the mark (`Select.ItemIcon`, an `Avatar.Root` or a
 * `Thumbnail.Root`, sized by the row), the title (plain text or `Select.ItemText`) with the
 * description under it, then the end: `Select.ItemMeta`, a `Badge.Root` and `children` (the check).
 */
function OptionRowContent({
  parts,
  panel,
  lines,
  query,
  children,
}: {
  parts: ItemParts;
  panel: ControlSize;
  lines: ListRowLines;
  query: string;
  children?: React.ReactNode;
}) {
  const isDescription = (node: React.ReactNode): boolean => isPart(node, SelectItemDescription);
  const description = parts.body.filter(isDescription);
  const title = parts.body.filter((node) => !isDescription(node));
  const titled = title.some((node) => isPart(node, SelectItemText));
  const end = [...parts.meta, ...React.Children.toArray(children)];
  return (
    <>
      {parts.leading.map((node, index) =>
        React.isValidElement(node) && node.type === SelectItemIcon ? (
          node
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: the leading marks keep their order
          <ListRowMark key={index} size={menuRowTier(panel)} lines={lines}>
            {node}
          </ListRowMark>
        ),
      )}
      <span className={listRowStyles.body}>
        {titled ? (
          title
        ) : (
          <span className={listRowStyles.title}>{highlightChildren(title, query)}</span>
        )}
        {description}
      </span>
      {end.length > 0 ? <span className={listRowStyles.end}>{end}</span> : null}
    </>
  );
}

// ─── Action ──────────────────────────────────────────────────────────────────

/** The highlight value of a `Select.Action`: never a value an option can have. */
const ACTION_PREFIX = "__prime_select_action";

export const isActionValue = (value: string) => value.startsWith(ACTION_PREFIX);

export type SelectActionProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect" | "role" | "id" | "children"
> & {
  onSelect: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * A list-level action («Новый клиент»): pinned under the scroller, never filtered by the search,
 * the last stop of the arrow keys. The listbox owns it (`aria-owns`), so it is an option of the
 * list for assistive tech.
 */
export function SelectAction({
  onSelect,
  disabled = false,
  className,
  children,
  onClick,
  onMouseMove,
  ref,
  ...rest
}: SelectActionProps) {
  const { highlight, listboxId, setOpen, size, registry } = useSelectContext();
  const value = `${ACTION_PREFIX}${React.useId()}`;
  const isHighlighted = useStoreSlice(highlight, (current) => current === value);
  const parts = splitItemChildren(children);
  const nodeRef = React.useRef<HTMLDivElement | null>(null);
  const setRefs = useMergedRefs(nodeRef, ref);
  // Persistent: never filtered by the query, the last stop of the arrows.
  useListboxItem(
    registry,
    value,
    {
      label: parts.title,
      haystack: "",
      disabled,
      persistent: true,
      onActivate: () => {
        onSelect();
        setOpen(false);
      },
    },
    nodeRef,
  );

  return (
    // biome-ignore lint/a11y/useFocusableInteractive: focus stays on the listbox / search (aria-activedescendant)
    // biome-ignore lint/a11y/useKeyWithClickEvents: the keyboard is handled on the listbox
    <div
      {...rest}
      ref={setRefs}
      id={optionDomId(listboxId, value)}
      role="option"
      aria-disabled={disabled || undefined}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) registry.activate(value);
      }}
      onMouseMove={(event) => {
        onMouseMove?.(event);
        if (!disabled && !isHighlighted) highlight.set(value);
      }}
      {...menuRowProps({
        size: menuRowTier(size),
        highlighted: isHighlighted,
        disabled,
        className,
      })}
      {...toDataAttributes({ value, action: true })}
    >
      <OptionRowContext value={{ panel: size, lines: "line", query: "" }}>
        <OptionRowContent parts={parts} panel={size} lines="line" query="" />
      </OptionRowContext>
    </div>
  );
}
SelectAction.displayName = "Select.Action";
