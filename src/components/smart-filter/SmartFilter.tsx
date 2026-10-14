import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Datepicker, formatDatepickerValue } from "@/components/datepicker/Datepicker";
import { Divider } from "@/components/divider/Divider";
import { EmptyPage } from "@/components/empty-page/EmptyPage";
import { Input } from "@/components/input/Input";
import { Kbd } from "@/components/kbd/Kbd";
import { LinkButton } from "@/components/link-button/LinkButton";
import { Popover } from "@/components/popover/Popover";
import { Typography } from "@/components/typography/Typography";
import { useControllableState } from "@/hooks/useControllableState";
import { Icon } from "@/icons";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { formatLabel } from "@/internal/formatLabel";
import { HighlightMatch, matchIndex } from "@/internal/HighlightMatch";
import type { ControlSize } from "@/internal/states";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import {
  canExcludeValue,
  entrySize,
  isSmartFilterRange,
  removeSelectionValue,
  type SmartFilterFieldValue,
  type SmartFilterMode,
  type SmartFilterRange,
  type SmartFilterValue,
  selectionModeOf,
  selectionOf,
  toggleSelectionMode,
  toggleSingleValue,
  withFieldValue,
} from "./model";
import styles from "./SmartFilter.module.css";

export type {
  SmartFilterFieldValue,
  SmartFilterMode,
  SmartFilterRange,
  SmartFilterSelection,
  SmartFilterValue,
} from "./model";
export { isSmartFilterRange, matchesSmartFilter, resolveSmartFilterValues } from "./model";

export type SmartFilterOption = {
  value: string;
  label: string;
  /** A decorative icon before the label (`<Icon name="…" />`). */
  icon?: React.ReactNode;
  /**
   * Group heading inside the field: values of one group stay together under it, groups in the
   * order they first appear (owner types, then people).
   */
  group?: string;
};

type SmartFilterFieldBase = {
  /** Key of the field in the value. */
  key: string;
  label: string;
};

/** A field of values to show or hide (default kind). */
export type SmartFilterOptionsField = SmartFilterFieldBase & {
  kind?: "options";
  options: SmartFilterOption[];
  /**
   * A fixed set of values (default `true`): hiding every value at once is not allowed. Set `false`
   * for an open set (services, users) that can change under the selection.
   */
  finite?: boolean;
  /**
   * Many values at once (default `true`). `false` — one value, no hiding: a press picks only that
   * value, a press on it clears it (an API that takes one value per field).
   */
  multiple?: boolean;
};

/** A number range, «от» and «до» (amounts, counts); either bound may stay open. */
export type SmartFilterRangeField = SmartFilterFieldBase & {
  kind: "range";
  /** Display of a bound in the chip («1 000 ₽»). Default: Russian digit groups. */
  formatValue?: (value: number) => string;
};

/** A period picked in the kit Datepicker (`mode="range"`). */
export type SmartFilterDateRangeField = SmartFilterFieldBase & {
  kind: "date-range";
};

export type SmartFilterField =
  | SmartFilterOptionsField
  | SmartFilterRangeField
  | SmartFilterDateRangeField;

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
  /** Placeholder of the lower bound of a number range. */
  from: string;
  /** Placeholder of the upper bound of a number range. */
  to: string;
  /** Accessible name of the lower bound input. */
  fromLabel: string;
  /** Accessible name of the upper bound input. */
  toLabel: string;
  /** Chip value of a range with only the lower bound. */
  rangeFrom: string;
  /** Chip value of a range with only the upper bound. */
  rangeTo: string;
};

export const SMART_FILTER_LABELS: SmartFilterLabels = {
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
  from: "от",
  to: "до",
  fromLabel: "{field}, от",
  toLabel: "{field}, до",
  rangeFrom: "от {value}",
  rangeTo: "до {value}",
};

const NUMBER = new Intl.NumberFormat("ru-RU");

/** Chip text of a field's range value, or `null` when the range is open on both ends. */
function rangeText(
  field: SmartFilterRangeField | SmartFilterDateRangeField,
  range: SmartFilterRange,
  labels: SmartFilterLabels,
): string | null {
  if (field.kind === "date-range") {
    return formatDatepickerValue({
      mode: "range",
      value: {
        from: range.from instanceof Date ? range.from : null,
        to: range.to instanceof Date ? range.to : null,
      },
    });
  }
  const format = field.formatValue ?? ((n: number) => NUMBER.format(n));
  const from = typeof range.from === "number" ? format(range.from) : null;
  const to = typeof range.to === "number" ? format(range.to) : null;
  if (from !== null && to !== null) return `${from}–${to}`;
  if (from !== null) return formatLabel(labels.rangeFrom, { value: from });
  if (to !== null) return formatLabel(labels.rangeTo, { value: to });
  return null;
}

type Ctx = {
  fields: readonly SmartFilterField[];
  value: SmartFilterValue;
  setEntry: (key: string, entry: SmartFilterFieldValue | undefined) => void;
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
  /** Value per field key: a selection, or the bounds of a range field. */
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
  ref?: React.Ref<HTMLDivElement>;
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
  ref,
}: SmartFilterRootProps) {
  const [current, setCurrent] = useControllableState<SmartFilterValue>({
    value,
    defaultValue: defaultValue ?? EMPTY_VALUE,
    onChange: onValueChange,
  });
  const [text, setText] = useControllableState<string>({
    value: search,
    defaultValue: defaultSearch,
    onChange: onSearchChange,
  });
  const [open, setOpen] = React.useState(false);

  const context: Ctx = {
    fields,
    value: current,
    setEntry: (key, entry) => setCurrent((prev) => withFieldValue(prev, key, entry)),
    clearAll: () =>
      setCurrent((prev) =>
        fields.reduce((next, field) => withFieldValue(next, field.key, undefined), prev),
      ),
    total: fields.reduce((n, field) => n + entrySize(current[field.key]), 0),
    open,
    setOpen,
    search: text,
    setSearch: setText,
    labels: { ...SMART_FILTER_LABELS, ...labels },
    size,
    collapsedLimit,
  };

  return (
    <SmartFilterProvider value={context}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <div ref={ref} className={cx(styles.root, className)} data-size={size}>
          {children}
        </div>
      </Popover.Root>
    </SmartFilterProvider>
  );
}
SmartFilterRoot.displayName = "SmartFilter.Root";

// ---------------------------------------------------------------------------------------------
// Toolbar: filter button + search; the anchor of the panel
// ---------------------------------------------------------------------------------------------

export type SmartFilterToolbarProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /**
   * The search input (default `true`). `false` — the filter button alone, for a screen whose
   * text search lives elsewhere or does not exist.
   */
  searchable?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

function SmartFilterToolbar({ searchable = true, className, ...rest }: SmartFilterToolbarProps) {
  const { fields, total, open, setOpen, search, setSearch, labels, size } = useSmartFilter();
  const hasFilters = fields.length > 0;

  return (
    <>
      <Popover.Anchor>
        <div
          {...rest}
          className={cx(styles.toolbar, className)}
          data-slot="smart-filter-toolbar"
          data-searchable={searchable ? undefined : "false"}
        >
          {searchable && (
            <Input.Root
              size={size}
              className={styles.search}
              labels={{ clear: labels.clearSearch }}
            >
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
          )}
          {hasFilters && (
            <Button.Root
              variant="soft"
              tone="neutral"
              size={size}
              className={styles.filterButton}
              aria-expanded={open}
              aria-haspopup="dialog"
              onClick={() => setOpen(!open)}
            >
              <Button.Icon>
                <Icon name="action.filter" />
              </Button.Icon>
              {labels.filter}
              {total > 0 && <Badge.Root color="blue">{total}</Badge.Root>}
            </Button.Root>
          )}
        </div>
      </Popover.Anchor>
      {hasFilters && (
        <Popover.Content matchTriggerWidth={searchable} flush size={size}>
          <Panel searchable={searchable} />
        </Popover.Content>
      )}
    </>
  );
}
SmartFilterToolbar.displayName = "SmartFilter.Toolbar";

type OptionGroup = { label: string | undefined; options: SmartFilterOption[] };

/** Options in groups, in the order each group first appears; ungrouped options form one group. */
function groupOptions(options: SmartFilterOption[]): OptionGroup[] {
  const groups: OptionGroup[] = [];
  for (const option of options) {
    const group = groups.find((g) => g.label === option.group);
    if (group) group.options.push(option);
    else groups.push({ label: option.group, options: [option] });
  }
  return groups;
}

function Panel({ searchable }: { searchable: boolean }) {
  const {
    fields,
    value,
    setEntry,
    total,
    clearAll,
    setOpen,
    search,
    labels,
    size,
    collapsedLimit,
  } = useSmartFilter();
  const query = searchable ? search.trim() : "";
  const [expanded, setExpanded] = React.useState<ReadonlySet<string>>(() => new Set());

  const sections: { key: string; node: React.ReactNode }[] = [];
  const empty: string[] = [];
  if (query) {
    sections.push({
      key: "query",
      node: (
        <div className={styles.queryRow}>
          <Button.Root
            variant="ghost"
            tone="neutral"
            size={size}
            fullWidth
            onClick={() => setOpen(false)}
          >
            <Button.Icon>
              <Icon name="action.search" />
            </Button.Icon>
            {formatLabel(labels.searchText, { query })}
            <Kbd className={styles.queryKey}>↵</Kbd>
          </Button.Root>
        </div>
      ),
    });
  }

  for (const field of fields) {
    const entry = value[field.key];
    if (field.kind === "range" || field.kind === "date-range") {
      // A range has no values to match: while typing it stays only when its name matches.
      if (query && matchIndex(field.label, query) < 0) continue;
      sections.push({
        key: `field:${field.key}`,
        node: (
          <div className={styles.row} data-field={field.key}>
            <Typography as="span" variant="body-s" tone="secondary">
              {field.label}
            </Typography>
            {field.kind === "range" ? (
              <NumberRange
                field={field}
                range={isSmartFilterRange(entry) ? (entry as SmartFilterRange<number>) : undefined}
                onRange={(range) => setEntry(field.key, range)}
              />
            ) : (
              <Datepicker.Root
                mode="range"
                size={size}
                fullWidth
                aria-label={field.label}
                value={
                  isSmartFilterRange(entry)
                    ? (entry as SmartFilterRange<Date>)
                    : { from: null, to: null }
                }
                onValueChange={(range) => setEntry(field.key, range)}
              />
            )}
          </div>
        ),
      });
      continue;
    }

    const selection = selectionOf(entry);
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
    if (matched.length === 0) {
      if (query) empty.push(field.label);
      continue;
    }
    const collapsible = !query && matched.length > collapsedLimit && !expanded.has(field.key);
    const shown = collapsible ? matched.slice(0, collapsedLimit) : matched;
    const all = field.options.map((o) => o.value);
    const single = field.multiple === false;
    const groups = groupOptions(shown);
    const toggle = (option: SmartFilterOption) => (
      <ValueToggle
        key={option.value}
        option={option}
        size={size}
        mode={selectionModeOf(selection, option.value)}
        single={single}
        canHide={
          !single && (field.finite === false || canExcludeValue(selection, option.value, all))
        }
        query={query}
        onMode={(mode) =>
          setEntry(
            field.key,
            single
              ? toggleSingleValue(selection, option.value)
              : toggleSelectionMode(selection, option.value, mode),
          )
        }
      />
    );
    const more = collapsible ? (
      <Badge.Root
        size={size}
        variant="outline"
        onPress={() => setExpanded((prev) => new Set(prev).add(field.key))}
      >
        {formatLabel(labels.more, { count: matched.length - collapsedLimit })}
        <Badge.Icon>
          <Icon name="nav.chevronDown" />
        </Badge.Icon>
      </Badge.Root>
    ) : null;

    sections.push({
      key: `field:${field.key}`,
      node: (
        <div className={styles.row} data-field={field.key}>
          <Typography as="span" variant="body-s" tone="secondary">
            {field.label}
          </Typography>
          {groups.some((g) => g.label !== undefined) ? (
            <div className={styles.groups}>
              {groups.map((group, index) => (
                // biome-ignore lint/a11y/useSemanticElements: a labelled set of toggles, not a form fieldset
                <div
                  key={group.label ?? `group-${index}`}
                  className={styles.group}
                  role="group"
                  aria-label={group.label}
                >
                  {group.label !== undefined ? (
                    <Typography as="span" variant="caption" tone="muted">
                      {group.label}
                    </Typography>
                  ) : null}
                  <div className={styles.values}>
                    {group.options.map(toggle)}
                    {index === groups.length - 1 ? more : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.values}>
              {shown.map(toggle)}
              {more}
            </div>
          )}
        </div>
      ),
    });
  }

  if (empty.length > 0) {
    sections.push({
      key: "empty",
      node: (
        <EmptyPage.Root layout="compact" size={size} role="status">
          <EmptyPage.Description>
            {formatLabel(labels.noMatches, { fields: empty.join(", ") })}
          </EmptyPage.Description>
        </EmptyPage.Root>
      ),
    });
  }
  sections.push({
    key: "footer",
    node: (
      <div className={styles.footer}>
        <Typography as="span" variant="caption" tone="muted" className={styles.hint}>
          {labels.hint}
        </Typography>
        <Typography as="span" variant="caption" tone="muted">
          {formatLabel(labels.count, { count: total })}
        </Typography>
        {total > 0 && (
          <Button.Root variant="ghost" tone="neutral" size="xs" onClick={clearAll}>
            {labels.reset}
          </Button.Root>
        )}
      </div>
    ),
  });

  return (
    <>
      <Popover.Title>
        <VisuallyHidden>{labels.filter}</VisuallyHidden>
      </Popover.Title>
      {sections.map((section, index) => (
        <React.Fragment key={section.key}>
          {index > 0 && <Divider role="presentation" />}
          {section.node}
        </React.Fragment>
      ))}
    </>
  );
}

/** Typed text of a bound → a number; empty → open; anything else is not a number yet. */
function parseBound(text: string): number | null | undefined {
  const normalized = text.replace(/\s/g, "").replace(",", ".");
  if (normalized === "") return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : undefined;
}

const boundText = (n: number | null | undefined) => (typeof n === "number" ? String(n) : "");

/**
 * «от» and «до» of a number range: two kit Inputs. Typed text stays as typed (a trailing comma, a
 * minus) and the value follows every complete number; a lower bound above the upper one marks
 * both fields invalid.
 */
function NumberRange({
  field,
  range,
  onRange,
}: {
  field: SmartFilterRangeField;
  range: SmartFilterRange<number> | undefined;
  onRange: (range: SmartFilterRange<number>) => void;
}) {
  const { labels, size } = useSmartFilter();
  const from = range?.from ?? null;
  const to = range?.to ?? null;
  const [draft, setDraft] = React.useState({ from: boundText(from), to: boundText(to) });
  // The value changed outside (a removed chip, a reset): show it.
  const [seen, setSeen] = React.useState({ from, to });
  if (seen.from !== from || seen.to !== to) {
    setSeen({ from, to });
    if (parseBound(draft.from) !== from || parseBound(draft.to) !== to) {
      setDraft({ from: boundText(from), to: boundText(to) });
    }
  }
  const invalid = from !== null && to !== null && from > to;

  const bound = (side: "from" | "to") => (
    <Input.Root size={size} invalid={invalid} className={styles.bound}>
      <Input.Wrapper>
        <Input.Field
          inputMode="decimal"
          autoComplete="off"
          aria-label={formatLabel(side === "from" ? labels.fromLabel : labels.toLabel, {
            field: field.label,
          })}
          placeholder={side === "from" ? labels.from : labels.to}
          value={draft[side]}
          onValueChange={(text) => {
            setDraft((prev) => ({ ...prev, [side]: text }));
            const parsed = parseBound(text);
            if (parsed === undefined) return;
            onRange({ from, to, [side]: parsed });
          }}
        />
      </Input.Wrapper>
    </Input.Root>
  );

  return (
    <div className={styles.range}>
      {bound("from")}
      <span className={styles.rangeDash} aria-hidden="true">
        –
      </span>
      {bound("to")}
    </div>
  );
}

type ValueToggleProps = {
  option: SmartFilterOption;
  size: ControlSize;
  mode: SmartFilterMode | null;
  /** One value per field: no «−» action. */
  single: boolean;
  canHide: boolean;
  query: string;
  /** Asks for a mode; asking for the current one clears it. «Hide» is asked only when `canHide`. */
  onMode: (mode: SmartFilterMode) => void;
};

/** Tags stay readable: an xs Badge is too small for «Поле: значение», so the floor is s. */
const tagSizeOf = (size: ControlSize): ControlSize => (size === "xs" ? "s" : size);

const COLOR = { none: "gray", include: "blue", exclude: "red" } as const;

/**
 * The LinkButton tier whose text size equals the Badge text of a tag tier (Badge 12 · 12 · 12 ·
 * 13 · 14, LinkButton 12 · 13 · 14 · 16 · …), so a text action reads as part of the tag row.
 */
const TIER_BELOW: Record<ControlSize, ControlSize> = {
  xs: "xs",
  s: "xs",
  m: "xs",
  l: "s",
  xl: "m",
};

/**
 * A value is a pressable Badge: gray, blue = shown, red with «НЕ» = hidden. A press shows it; the «−»
 * Badge.Action (revealed on hover and focus, kept while hidden) hides it. Alt+click and Shift+Enter
 * hide too. A single-value field has no «−»: a press picks the value.
 */
function ValueToggle({ option, size, mode, single, canHide, query, onMode }: ValueToggleProps) {
  const { labels } = useSmartFilter();
  return (
    <Badge.Root
      size={tagSizeOf(size)}
      color={COLOR[mode ?? "none"]}
      pressed={mode === "include"}
      title={formatLabel(labels.showValue, { value: option.label })}
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
      {option.icon ? <Badge.Icon>{option.icon}</Badge.Icon> : null}
      <span>
        <HighlightMatch text={option.label} query={query} />
      </span>
      {single ? null : (
        <Badge.Action
          label={formatLabel(mode === "exclude" ? labels.unhideValue : labels.hideValue, {
            value: option.label,
          })}
          pressed={mode === "exclude"}
          persistent={mode === "exclude"}
          disabled={!canHide}
          onClick={() => onMode("exclude")}
        />
      )}
    </Badge.Root>
  );
}

// ---------------------------------------------------------------------------------------------
// Chips: applied filters as tags
// ---------------------------------------------------------------------------------------------

export type SmartFilterChipsProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** The applied filters as removable tags, with "add" and "clear all". Renders nothing without filters. */
function SmartFilterChips({ className, ...rest }: SmartFilterChipsProps) {
  const { fields, value, setEntry, total, clearAll, setOpen, setSearch, labels, size } =
    useSmartFilter();
  if (total === 0) return null;
  const tagSize = tagSizeOf(size);

  const chip = (key: string, text: string, negated: boolean, onRemove: () => void) => (
    <Badge.Root
      key={key}
      size={tagSize}
      color={negated ? "red" : "blue"}
      labels={{ remove: formatLabel(labels.remove, { value: text }) }}
      onRemove={onRemove}
      data-negated={negated || undefined}
    >
      {text}
    </Badge.Root>
  );

  return (
    <div {...rest} className={cx(styles.chips, className)} data-slot="smart-filter-chips">
      {fields.flatMap((field) => {
        const entry = value[field.key];
        if (!entry) return [];
        if (field.kind === "range" || field.kind === "date-range") {
          if (!isSmartFilterRange(entry)) return [];
          const text = rangeText(field, entry, labels);
          if (text === null) return [];
          return [
            chip(
              field.key,
              formatLabel(labels.chipInclude, { field: field.label, value: text }),
              false,
              () => setEntry(field.key, undefined),
            ),
          ];
        }
        const selection = selectionOf(entry);
        if (!selection) return [];
        const labelOf = (v: string) => field.options.find((o) => o.value === v)?.label ?? v;
        const tag = (v: string, negated: boolean) =>
          chip(
            `${field.key}:${v}`,
            formatLabel(negated ? labels.chipExclude : labels.chipInclude, {
              field: field.label,
              value: labelOf(v),
            }),
            negated,
            () => setEntry(field.key, removeSelectionValue(selection, v)),
          );
        return [
          ...selection.include.map((v) => tag(v, false)),
          ...selection.exclude.map((v) => tag(v, true)),
        ];
      })}
      {/* Actions in the tag row are tag-sized: a pressable gray Badge and a text action whose
          type matches the tags (LinkButton runs one tier larger than Badge). */}
      <Badge.Root
        size={tagSize}
        onPress={() => {
          setSearch("");
          setOpen(true);
        }}
      >
        <Badge.Icon>
          <Icon name="action.add" />
        </Badge.Icon>
        {labels.add}
      </Badge.Root>
      <LinkButton asChild tone="neutral" size={TIER_BELOW[tagSize]} className={styles.clearAll}>
        <button type="button" onClick={clearAll}>
          {labels.clearAll}
        </button>
      </LinkButton>
    </div>
  );
}
SmartFilterChips.displayName = "SmartFilter.Chips";

export const SmartFilter = {
  Root: SmartFilterRoot,
  Toolbar: SmartFilterToolbar,
  Chips: SmartFilterChips,
};
