import * as React from "react";

import { Checkbox } from "@/components/checkbox/Checkbox";
import { Thumbnail, type ThumbnailRootProps } from "@/components/thumbnail/Thumbnail";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { highlightChildren } from "@/internal/HighlightMatch";
import { optionDomId, useStoreSlice } from "@/internal/listbox";
import menu from "@/internal/menu.module.css";
import { type ControlSize, stepDown } from "@/internal/states";

import styles from "./Select.module.css";
import { normalize, useSelectContext } from "./selectContext";

/** Thumbnail tier for a Select tier: the media of a rich row stays inside the row height. */
const MEDIA_SIZE: Record<ControlSize, ControlSize> = { xs: "xs", s: "xs", m: "s", l: "s", xl: "m" };

/** Plain text of a node tree (a title made of nodes still has a label). */
function textOf(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node))
    return textOf(node.props.children);
  return "";
}

type SpanProps = React.HTMLAttributes<HTMLSpanElement> & { ref?: React.Ref<HTMLSpanElement> };

// ─── Rich option parts (row and trigger) ─────────────────────────────────────

export type SelectItemIconProps = SpanProps;

/** A leading glyph of an option (decorative). */
export function SelectItemIcon({ className, ...rest }: SelectItemIconProps) {
  return <span aria-hidden="true" className={cx(menu.itemIcon, className)} {...rest} />;
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
  /** `Select.ItemIcon` and `Thumbnail.Root`, before the text. */
  leading: React.ReactNode[];
  /** Title, description and plain text, in one column. */
  body: React.ReactNode[];
  /** `Select.ItemMeta`, after the text. */
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
      plain += textOf(child);
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
    } else if (child.type === SelectItemIcon) {
      parts.leading.push(child);
    } else if (child.type === Thumbnail.Root) {
      parts.leading.push(child);
      parts.rich = true;
    } else if (child.type === SelectItemMeta) {
      parts.meta.push(child);
    } else {
      if (child.type === SelectItemText) parts.title = textOf(child.props.children);
      if (child.type === SelectItemDescription) {
        parts.description = textOf(child.props.children);
        parts.rich = true;
      }
      parts.body.push(child);
    }
  }
  parts.title = (parts.title || plain).trim();
  return parts;
}

/** A `Thumbnail.Root` in a row or the trigger: sized to the tier unless it sets `size`. */
export function sizeMedia(leading: React.ReactNode[], size: ControlSize): React.ReactNode[] {
  return leading.map((node) =>
    React.isValidElement<ThumbnailRootProps>(node) && node.type === Thumbnail.Root
      ? React.cloneElement(node, {
          size: node.props.size ?? MEDIA_SIZE[size],
          className: cx(styles.media, node.props.className),
          "aria-hidden": true,
        } as Partial<ThumbnailRootProps>)
      : node,
  );
}

// ─── Item ────────────────────────────────────────────────────────────────────

export type SelectItemProps = {
  value: string;
  /** Text shown in the trigger and used by typeahead; defaults to `Select.ItemText`, then plain text. */
  label?: string;
  /** Extra words for the search (`Select.Content searchable`). */
  keywords?: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

export function SelectItem({
  value,
  label,
  keywords,
  disabled,
  className,
  children,
  ref,
}: SelectItemProps) {
  const { multiple, size, selected, highlight, pick, registry, listboxId, query } =
    useSelectContext();

  const parts = splitItemChildren(children);
  const resolvedLabel = label || parts.title || value;
  const haystack = normalize(`${resolvedLabel} ${parts.description} ${keywords ?? ""}`);
  const isSelected = selected.includes(value);
  // Only this option's slice of the highlight: moving it re-renders two rows, not the list.
  const isHighlighted = useStoreSlice(highlight, (current) => current === value);

  React.useLayoutEffect(
    () => registry.register(value, resolvedLabel, haystack),
    [registry, value, resolvedLabel, haystack],
  );

  const search = normalize(query);
  if (search !== "" && !haystack.includes(search)) return null;

  return (
    // biome-ignore lint/a11y/useFocusableInteractive: focus stays on the listbox / search (aria-activedescendant)
    // biome-ignore lint/a11y/useKeyWithClickEvents: the keyboard is handled on the listbox
    <div
      ref={ref}
      id={optionDomId(listboxId, value)}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      className={cx(menu.item, styles.item, className)}
      onClick={() => {
        if (!disabled) pick(value);
      }}
      onMouseMove={() => {
        if (!disabled && !isHighlighted) highlight.set(value);
      }}
      {...toDataAttributes({
        value,
        label: resolvedLabel,
        selected: isSelected,
        highlighted: isHighlighted,
        disabled: Boolean(disabled),
        rich: parts.rich || undefined,
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
