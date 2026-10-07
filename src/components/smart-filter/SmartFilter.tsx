import { ChevronDown, ListFilter, Plus } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Divider } from "@/components/divider/Divider";
import { Input } from "@/components/input/Input";
import { Kbd } from "@/components/kbd/Kbd";
import { Popover } from "@/components/popover/Popover";
import { Typography } from "@/components/typography/Typography";
import { useControllableState } from "@/hooks/useControllableState";
import { Icon } from "@/icons";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import type { ControlSize } from "@/internal/states";

import {
  canExcludeValue,
  matchIndex,
  removeSelectionValue,
  type SmartFilterMode,
  type SmartFilterSelection,
  type SmartFilterValue,
  selectionModeOf,
  selectionSize,
  toggleSelectionMode,
  withSelection,
} from "./model";
import styles from "./SmartFilter.module.css";

export type { SmartFilterMode, SmartFilterSelection, SmartFilterValue } from "./model";
export { matchesSmartFilter, resolveSmartFilterValues } from "./model";

export type SmartFilterOption = {
  value: string;
  label: string;
  /** A mark before the label: a status dot, an icon. Decorative. */
  leading?: React.ReactNode;
};

export type SmartFilterField = {
  /** Key of the field in the value. */
  key: string;
  label: string;
  options: SmartFilterOption[];
  /**
   * A fixed set of values (default `true`): hiding every value at once is not allowed. Set `false`
   * for an open set (services, users) that can change under the selection.
   */
  finite?: boolean;
};

/** System strings. `{query}`, `{value}`, `{field}`, `{fields}`, `{count}` are substituted. */
export type SmartFilterLabels = {
  /** Text of the filter button. */
  filter: string;
  /** Placeholder and accessible name of the search field. */
  searchPlaceholder: string;
  /** `aria-label` of the search clear button. */
  clearSearch: string;
  /** The first row of the panel while typing. */
  searchText: string;
  /** Fields with no matches while typing. */
  noMatches: string;
  /** Footer hint. */
  hint: string;
  /** Footer counter. */
  count: string;
  /** Footer reset button. */
  reset: string;
  /** Collapsed values of a field. */
  more: string;
  /** Chips row: the add button. */
  add: string;
  /** Chips row: clear all. */
  clearAll: string;
  /** Title of a value. */
  showValue: string;
  /** Name of the «−» action of a value. */
  hideValue: string;
  /** Name of the «−» action of a hidden value. */
  unhideValue: string;
  /** Prefix of a hidden value. */
  not: string;
  /** Text of a "show" tag. */
  chipInclude: string;
  /** Text of a "hide" tag. */
  chipExclude: string;
  /** `aria-label` of a tag's remove button. */
  remove: string;
};

export const defaultSmartFilterLabels: SmartFilterLabels = {
  filter: "Фильтр",
  searchPlaceholder: "Поиск",
  clearSearch: "Очистить поиск",
  searchText: "Искать «{query}»",
  noMatches: "{fields} — нет совпадений",
  hint: "Нажмите значение, чтобы показать только его; «−» справа — скрыть",
  count: "Фильтров: {count}",
  reset: "Сбросить",
  more: "Ещё {count}",
  add: "Добавить фильтр",
  clearAll: "Сбросить все",
  showValue: "Показать только {value}",
  hideValue: "Скрыть {value}",
  unhideValue: "Не скрывать {value}",
  not: "НЕ",
  chipInclude: "{field}: {value}",
  chipExclude: "{field}: не {value}",
  remove: "Убрать фильтр «{value}»",
};

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
}

// Secondary buttons beside the tags (add, clear all, the text-search row) sit one tier below the toolbar.
const SMALLER: Record<ControlSize, ControlSize> = { xs: "xs", s: "xs", m: "xs", l: "s", xl: "m" };

type Ctx = {
  fields: readonly SmartFilterField[];
  value: SmartFilterValue;
  setSelection: (key: string, selection: SmartFilterSelection) => void;
  clearAll: () => void;
  total: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  search: string;
  setSearch: (search: string) => void;
  labels: SmartFilterLabels;
  size: ControlSize;
  collapsedLimit: number;
};

const [SmartFilterProvider, useSmartFilter] = createComponentContext<Ctx>("SmartFilter");

// ---------------------------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------------------------

export type SmartFilterRootProps = {
  /** The fields this screen filters by, in display order. Empty: only the search remains. */
  fields: readonly SmartFilterField[];
  /** Selection per field key. */
  value?: SmartFilterValue;
  defaultValue?: SmartFilterValue;
  onValueChange?: (value: SmartFilterValue) => void;
  /** Free-text search. Applied as typed; debounce it in the owner if needed. */
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;
  size?: ControlSize;
  /** Values of one field shown before «Ещё N». Default 12. */
  collapsedLimit?: number;
  labels?: Partial<SmartFilterLabels>;
  className?: string;
  /** `SmartFilter.Toolbar` and `SmartFilter.Chips`. */
  children: React.ReactNode;
};

const EMPTY_VALUE: SmartFilterValue = {};

function SmartFilterRoot({
  fields,
  value,
  defaultValue,
  onValueChange,
  search,
  defaultSearch = "",
  onSearchChange,
  size = "m",
  collapsedLimit = 12,
  labels,
  className,
  children,
}: SmartFilterRootProps) {
  const [current, setCurrent] = useControllableState<SmartFilterValue>({
    ...(value !== undefined ? { value } : {}),
    defaultValue: defaultValue ?? EMPTY_VALUE,
    ...(onValueChange ? { onChange: onValueChange } : {}),
  });
  const [text, setText] = useControllableState<string>({
    ...(search !== undefined ? { value: search } : {}),
    defaultValue: defaultSearch,
    ...(onSearchChange ? { onChange: onSearchChange } : {}),
  });
  const [open, setOpen] = React.useState(false);
  const merged = React.useMemo(() => ({ ...defaultSmartFilterLabels, ...labels }), [labels]);

  const total = fields.reduce((n, field) => n + selectionSize(current[field.key]), 0);

  const setSelection = React.useCallback(
    (key: string, selection: SmartFilterSelection) =>
      setCurrent((prev) => withSelection(prev, key, selection)),
    [setCurrent],
  );
  const clearAll = React.useCallback(
    () =>
      setCurrent((prev) => {
        let next = prev;
        for (const field of fields) {
          next = withSelection(next, field.key, { include: [], exclude: [] });
        }
        return next;
      }),
    [setCurrent, fields],
  );

  const context = React.useMemo<Ctx>(
    () => ({
      fields,
      value: current,
      setSelection,
      clearAll,
      total,
      open,
      setOpen,
      search: text,
      setSearch: setText,
      labels: merged,
      size,
      collapsedLimit,
    }),
    [
      fields,
      current,
      setSelection,
      clearAll,
      total,
      open,
      text,
      setText,
      merged,
      size,
      collapsedLimit,
    ],
  );

  return (
    <SmartFilterProvider value={context}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <div className={cx(styles.root, className)} data-size={size}>
          {children}
        </div>
      </Popover.Root>
    </SmartFilterProvider>
  );
}
SmartFilterRoot.displayName = "SmartFilterRoot";

// ---------------------------------------------------------------------------------------------
// Toolbar: filter button + search; the anchor of the panel
// ---------------------------------------------------------------------------------------------

export type SmartFilterToolbarProps = {
  className?: string;
};

function SmartFilterToolbar({ className }: SmartFilterToolbarProps) {
  const { fields, total, open, setOpen, search, setSearch, labels, size } = useSmartFilter();
  const hasFilters = fields.length > 0;

  return (
    <>
      <Popover.Anchor>
        <div className={cx(styles.toolbar, className)} data-slot="smart-filter-toolbar">
          {hasFilters && (
            <Button.Root
              variant="soft"
              tone="neutral"
              size={size}
              aria-expanded={open}
              aria-haspopup="dialog"
              onClick={() => setOpen(!open)}
            >
              <Button.Icon>
                <ListFilter />
              </Button.Icon>
              {labels.filter}
              {total > 0 && <Badge.Root color="blue">{total}</Badge.Root>}
            </Button.Root>
          )}
          <Input.Root size={size} className={styles.search} labels={{ clear: labels.clearSearch }}>
            <Input.Wrapper>
              <Input.Icon side="start">
                <Icon name="action.search" tone="secondary" />
              </Input.Icon>
              <Input.Field
                type="search"
                autoComplete="off"
                aria-label={labels.searchPlaceholder}
                placeholder={labels.searchPlaceholder}
                value={search}
                onValueChange={setSearch}
                onFocus={() => hasFilters && setOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === "Escape") setOpen(false);
                }}
              />
              {search.length > 0 && <Input.ClearButton onClick={() => setSearch("")} />}
            </Input.Wrapper>
          </Input.Root>
        </div>
      </Popover.Anchor>
      {hasFilters && (
        <Popover.Content sameMinWidthAsTrigger size={size} className={styles.panel}>
          <Panel />
        </Popover.Content>
      )}
    </>
  );
}
SmartFilterToolbar.displayName = "SmartFilterToolbar";

/** The matched part of a label, underlined. */
function Highlighted({ text, query }: { text: string; query: string }) {
  const at = matchIndex(text, query);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className={styles.match}>{text.slice(at, at + query.length)}</span>
      {text.slice(at + query.length)}
    </>
  );
}

function Panel() {
  const {
    fields,
    value,
    setSelection,
    total,
    clearAll,
    setOpen,
    search,
    labels,
    size,
    collapsedLimit,
  } = useSmartFilter();
  const query = search.trim();
  const [expanded, setExpanded] = React.useState<ReadonlySet<string>>(() => new Set());

  const rows = fields.map((field) => {
    const selection = value[field.key];
    const known = new Set(field.options.map((o) => o.value));
    // Selected values gone from the reference list (a deleted service) stay visible to be removed.
    const orphans: SmartFilterOption[] = [
      ...(selection?.include ?? []),
      ...(selection?.exclude ?? []),
    ]
      .filter((v) => !known.has(v))
      .map((v) => ({ value: v, label: v }));
    const options = [...orphans, ...field.options];
    const matched = query ? options.filter((o) => matchIndex(o.label, query) >= 0) : options;
    return { field, selection, options: matched };
  });
  const visible = rows.filter((row) => row.options.length > 0);
  const empty = query
    ? rows.filter((row) => row.options.length === 0).map((row) => row.field.label)
    : [];

  const setMode = (field: SmartFilterField, option: string, mode: SmartFilterMode) => {
    const selection = value[field.key];
    const all = field.options.map((o) => o.value);
    if (mode === "exclude" && field.finite !== false && !canExcludeValue(selection, option, all)) {
      return;
    }
    setSelection(field.key, toggleSelectionMode(selection, option, mode));
  };

  return (
    <>
      <Popover.Title className={styles.srOnly}>{labels.filter}</Popover.Title>
      {query && (
        <Button.Root
          variant="soft"
          tone="neutral"
          size={SMALLER[size]}
          fullWidth
          className={styles.query}
          onClick={() => setOpen(false)}
        >
          <Button.Icon>
            <Icon name="action.search" />
          </Button.Icon>
          {fill(labels.searchText, { query })}
          <Kbd.Root className={styles.queryKey}>↵</Kbd.Root>
        </Button.Root>
      )}
      {visible.map(({ field, selection, options }, index) => {
        const collapsible = !query && options.length > collapsedLimit && !expanded.has(field.key);
        const shown = collapsible ? options.slice(0, collapsedLimit) : options;
        const all = field.options.map((o) => o.value);
        return (
          <React.Fragment key={field.key}>
            {index > 0 && <Divider.Root role="presentation" />}
            <div className={styles.row} data-field={field.key}>
              <Typography.Root as="span" variant="body-s" tone="secondary">
                {field.label}
              </Typography.Root>
              <div className={styles.values}>
                {shown.map((option) => (
                  <ValueToggle
                    key={option.value}
                    option={option}
                    size={size}
                    mode={selectionModeOf(selection, option.value)}
                    canHide={
                      field.finite === false || canExcludeValue(selection, option.value, all)
                    }
                    query={query}
                    onMode={(mode) => setMode(field, option.value, mode)}
                  />
                ))}
                {collapsible && (
                  <Badge.Root
                    size={size}
                    variant="outline"
                    onPress={() => setExpanded((prev) => new Set(prev).add(field.key))}
                  >
                    {fill(labels.more, { count: options.length - collapsedLimit })}
                    <Badge.Icon>
                      <ChevronDown />
                    </Badge.Icon>
                  </Badge.Root>
                )}
              </div>
            </div>
          </React.Fragment>
        );
      })}
      {empty.length > 0 && (
        <Typography.Root as="p" variant="caption" tone="muted">
          {fill(labels.noMatches, { fields: empty.join(", ") })}
        </Typography.Root>
      )}
      <Divider.Root role="presentation" />
      <div className={styles.footer}>
        <Typography.Root as="span" variant="caption" tone="muted" className={styles.hint}>
          {labels.hint}
        </Typography.Root>
        <Typography.Root as="span" variant="caption" tone="muted">
          {fill(labels.count, { count: total })}
        </Typography.Root>
        {total > 0 && (
          <Button.Root variant="ghost" tone="neutral" size="xs" onClick={clearAll}>
            {labels.reset}
          </Button.Root>
        )}
      </div>
    </>
  );
}

type ValueToggleProps = {
  option: SmartFilterOption;
  size: ControlSize;
  mode: SmartFilterMode | null;
  canHide: boolean;
  query: string;
  /** Asks for a mode; asking for the current one clears it. */
  onMode: (mode: SmartFilterMode) => void;
};

const COLOR = { none: "gray", include: "blue", exclude: "red" } as const;

/**
 * A value is a pressable Badge: gray, blue = shown, red with «НЕ» = hidden. A press shows it; the «−»
 * Badge.Action (revealed on hover and focus, kept while hidden) hides it. Alt+click and Shift+Enter
 * hide too.
 */
function ValueToggle({ option, size, mode, canHide, query, onMode }: ValueToggleProps) {
  const { labels } = useSmartFilter();
  return (
    <Badge.Root
      size={size}
      color={COLOR[mode ?? "none"]}
      pressed={mode === "include"}
      title={fill(labels.showValue, { value: option.label })}
      data-mode={mode ?? undefined}
      onPress={(event) => onMode(event.altKey && canHide ? "exclude" : "include")}
      onKeyDown={(event) => {
        if (event.key === "Enter" && event.shiftKey && canHide) {
          event.preventDefault();
          onMode("exclude");
        }
      }}
    >
      {mode === "exclude" && `${labels.not} `}
      {option.leading}
      <span>
        <Highlighted text={option.label} query={query} />
      </span>
      <Badge.Action
        label={fill(mode === "exclude" ? labels.unhideValue : labels.hideValue, {
          value: option.label,
        })}
        pressed={mode === "exclude"}
        persistent={mode === "exclude"}
        disabled={!canHide}
        onClick={() => onMode("exclude")}
      />
    </Badge.Root>
  );
}

// ---------------------------------------------------------------------------------------------
// Chips: applied filters as tags
// ---------------------------------------------------------------------------------------------

export type SmartFilterChipsProps = {
  className?: string;
};

/** The applied filters as removable tags, with "add" and "clear all". Renders nothing without filters. */
function SmartFilterChips({ className }: SmartFilterChipsProps) {
  const { fields, value, setSelection, total, clearAll, setOpen, setSearch, labels, size } =
    useSmartFilter();
  if (total === 0) return null;
  const buttonSize = SMALLER[size];

  return (
    <div className={cx(styles.chips, className)} data-slot="smart-filter-chips">
      {fields.flatMap((field) => {
        const selection = value[field.key];
        if (!selection) return [];
        const labelOf = (v: string) => field.options.find((o) => o.value === v)?.label ?? v;
        const tag = (v: string, negated: boolean) => {
          const text = fill(negated ? labels.chipExclude : labels.chipInclude, {
            field: field.label,
            value: labelOf(v),
          });
          return (
            <Badge.Root
              key={`${field.key}:${v}`}
              size={size}
              color={negated ? "red" : "blue"}
              labels={{ remove: fill(labels.remove, { value: text }) }}
              onRemove={() => setSelection(field.key, removeSelectionValue(selection, v))}
              data-negated={negated || undefined}
            >
              {text}
            </Badge.Root>
          );
        };
        return [
          ...selection.include.map((v) => tag(v, false)),
          ...selection.exclude.map((v) => tag(v, true)),
        ];
      })}
      <Button.Root
        variant="ghost"
        tone="neutral"
        size={buttonSize}
        onClick={() => {
          setSearch("");
          setOpen(true);
        }}
      >
        <Button.Icon>
          <Plus />
        </Button.Icon>
        {labels.add}
      </Button.Root>
      <Button.Root
        variant="ghost"
        tone="neutral"
        size={buttonSize}
        className={styles.clearAll}
        onClick={clearAll}
      >
        {labels.clearAll}
      </Button.Root>
    </div>
  );
}
SmartFilterChips.displayName = "SmartFilterChips";

export const SmartFilter = {
  Root: SmartFilterRoot,
  Toolbar: SmartFilterToolbar,
  Chips: SmartFilterChips,
};
