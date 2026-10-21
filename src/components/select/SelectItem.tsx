import * as React from "react";

import { Avatar, type AvatarRootProps } from "@/components/avatar/Avatar";
import { Badge } from "@/components/badge/Badge";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { Thumbnail, type ThumbnailRootProps } from "@/components/thumbnail/Thumbnail";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { highlightChildren } from "@/internal/HighlightMatch";
import { iconSlotClass } from "@/internal/iconBox";
import { optionDomId, useListboxItem, useStoreSlice } from "@/internal/listbox";
import menu from "@/internal/menu.module.css";
import { nodeText } from "@/internal/nodeText";
import palette from "@/internal/palette.module.css";
import { type ControlSize, type PaletteColor, stepDown, tierMappings } from "@/internal/states";

import styles from "./Select.module.css";
import { normalize, useSelectContext } from "./selectContext";

type SpanProps = React.HTMLAttributes<HTMLSpanElement> & { ref?: React.Ref<HTMLSpanElement> };

// ─── Rich option parts (row and trigger) ─────────────────────────────────────

export type SelectItemIconProps = SpanProps;

/** A leading glyph of an option (decorative). */
export function SelectItemIcon({ className, ...rest }: SelectItemIconProps) {
  return (
    <span aria-hidden="true" className={cx(menu.itemIcon, iconSlotClass, className)} {...rest} />
  );
}
SelectItemIcon.displayName = "Select.ItemIcon";

export type SelectItemTextProps = SpanProps & { children: React.ReactNode };

/** The search query inside an option row; empty in the trigger, so `renderValue` never marks it. */
const OptionQueryContext = React.createContext("");

/** Title of a rich option; its text is the option label (trigger, typeahead, search). */
export function SelectItemText({ children, className, ...rest }: SelectItemTextProps) {
  const query = React.useContext(OptionQueryContext);
  return (
    <span {...rest} className={cx(styles.itemTitle, className)}>
      {highlightChildren(children, query)}
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
  const query = React.useContext(OptionQueryContext);
  return (
    <span {...rest} className={cx(styles.itemDescription, className)}>
      {highlightChildren(children, query)}
    </span>
  );
}
SelectItemDescription.displayName = "Select.ItemDescription";

export type SelectItemMetaProps = SpanProps & { children: React.ReactNode };

/** Trailing meta of an option (price, count): muted, tabular, before the check. */
export function SelectItemMeta({ children, className, ...rest }: SelectItemMetaProps) {
  return (
    <span {...rest} className={cx(styles.itemMeta, className)}>
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
      className={cx(menu.item, styles.item, color !== undefined && palette.hue, className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) registry.activate(value);
      }}
      onMouseMove={(event) => {
        onMouseMove?.(event);
        if (!disabled && !isHighlighted) highlight.set(value);
      }}
      {...toDataAttributes({
        value,
        selected: isSelected,
        highlighted: isHighlighted,
        disabled,
        rich: parts.rich || undefined,
        color,
      })}
    >
      {multiple ? (
        <Checkbox.Indicator checked={isSelected} disabled={disabled} size={stepDown(size)} />
      ) : null}
      {sizeMedia(parts.leading, size)}
      <span className={styles.itemText}>
        <OptionQueryContext.Provider value={query}>
          {highlightChildren(parts.body, query)}
        </OptionQueryContext.Provider>
      </span>
      {parts.meta}
      {multiple ? null : (
        <span className={menu.check} aria-hidden="true">
          {isSelected ? <Icon name="action.check" /> : null}
        </span>
      )}
    </div>
  );
}
SelectItem.displayName = "Select.Item";

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
      className={cx(menu.item, className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) registry.activate(value);
      }}
      onMouseMove={(event) => {
        onMouseMove?.(event);
        if (!disabled && !isHighlighted) highlight.set(value);
      }}
      {...toDataAttributes({
        value,
        action: true,
        highlighted: isHighlighted,
        disabled,
      })}
    >
      {sizeMedia(parts.leading, size)}
      <span className={styles.itemText}>{parts.body}</span>
    </div>
  );
}
SelectAction.displayName = "Select.Action";
