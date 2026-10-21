import type * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Icon } from "@/icons";

import { usePartPresence } from "./partPresence";
import type { ControlSize } from "./states";

/** The strings every view menu shares: the trigger's text and the item that puts the default back. */
export const VIEW_MENU_TEXT = { view: "Вид", reset: "По умолчанию" } as const;

/** Whether two lists of ids hold the same ids, in any order. */
export function sameIds(a: readonly string[], b: readonly string[]): boolean {
  const set = new Set(b);
  return new Set(a).size === set.size && a.every((id) => set.has(id));
}

/** `hidden` with `id` shown (`visible`) or hidden, the other ids kept in their order. */
export function toggleHidden(hidden: readonly string[], id: string, visible: boolean): string[] {
  const rest = hidden.filter((each) => each !== id);
  return visible ? rest : [...rest, id];
}

/**
 * `items` in `order` (ids of the items; unknown ids are skipped, items it misses keep their place
 * after the listed ones, in their own order).
 */
function orderItems<T extends { id: string }>(items: readonly T[], order: readonly string[]): T[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  const listed = order.flatMap((id) => {
    const item = byId.get(id);
    return item ? [item] : [];
  });
  const seen = new Set(listed.map((item) => item.id));
  return [...listed, ...items.filter((item) => !seen.has(item.id))];
}

/** `ids` with `id` moved before `beforeId` (`null`: to the end). */
function moveId(ids: readonly string[], id: string, beforeId: string | null): string[] {
  const rest = ids.filter((each) => each !== id);
  const at = beforeId === null ? rest.length : rest.indexOf(beforeId);
  rest.splice(at < 0 ? rest.length : at, 0, id);
  return rest;
}

const sameOrder = (a: readonly string[], b: readonly string[]) =>
  a.length === b.length && a.every((id, index) => b[index] === id);

type ViewMenuButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  /** The visible text («Вид»). */
  label: string;
  /** How many items the view shows now: the count badge. */
  shown: number;
  size: ControlSize;
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * The one trigger of every view menu (what a table, a board or a schedule shows): a soft neutral
 * Button with the `view.columns` icon, its text and a Badge with the count of shown items, named
 * as read aloud («Вид 4», not «Вид4»). Goes inside `Dropdown.Trigger`.
 */
export function ViewMenuButton({ label, shown, size, ...rest }: ViewMenuButtonProps) {
  return (
    <Button.Root
      aria-label={`${label} ${shown}`}
      {...rest}
      variant="soft"
      tone="neutral"
      size={size}
    >
      <Button.Icon>
        <Icon name="view.columns" />
      </Button.Icon>
      {label}
      <Badge.Root>{shown}</Badge.Root>
    </Button.Root>
  );
}

/** The item that puts the default view back. */
type ViewMenuReset = { label: string; onSelect: () => void };

/**
 * The reset zone: a separator and the reset item while the view differs from the default; they
 * rise in when a change makes them useful and close up when the view is the default again. Inside
 * the menu's content, so a menu that opens on a changed view shows them still.
 */
function ResetZone({ reset }: { reset: ViewMenuReset | null }) {
  const separator = usePartPresence<HTMLDivElement>({ present: reset !== null, axis: "block" });
  const item = usePartPresence<HTMLButtonElement>({ present: reset !== null, axis: "block" });
  if (!reset) return null;
  return (
    <>
      <Dropdown.Separator ref={separator.ref} className={separator.className} />
      <Dropdown.Item ref={item.ref} className={item.className} onSelect={reset.onSelect}>
        {reset.label}
      </Dropdown.Item>
    </>
  );
}

type ViewMenuContentProps = {
  /** The groups of items (`ViewMenuItems`). */
  children: React.ReactNode;
  /** The reset item; `null` while the view is the default (the item leaves). */
  reset: ViewMenuReset | null;
  size: ControlSize;
  align?: "auto" | "end";
};

/**
 * The menu of a view: below its trigger, its groups of items, then the reset zone. A menu whose
 * items reorder brings the drag session its lists need (inside a table, the table's).
 */
export function ViewMenuContent({ children, reset, size, align = "auto" }: ViewMenuContentProps) {
  return (
    <Dropdown.Content side="bottom" align={align} size={size}>
      {children}
      <ResetZone reset={reset} />
    </Dropdown.Content>
  );
}

/** One row of a view menu: a check item that shows or hides a part of the view. */
export type ViewMenuEntry = {
  id: string;
  /** The item's content. */
  label: React.ReactNode;
  /** What the item is called by its grip and in the move announcements. */
  name: string;
  checked: boolean;
  disabled?: boolean;
  /** Holds its place when the items reorder: a lock instead of the grip. */
  locked?: boolean;
  /** The heading of the item's group; items without one go under the menu's `groupLabel`. */
  group?: string;
};

/** The items reorder (the host's order triad). */
export type ViewMenuReorder = {
  onReorder: (id: string, beforeId: string | null) => void;
  /** The name of an item's grip; `{label}` is the item's `name`. */
  handleLabel: string;
};

/** The entries by group, groups in the order their first entry comes. */
export function groupsOf(entries: readonly ViewMenuEntry[], fallback: string) {
  const groups = new Map<string, ViewMenuEntry[]>();
  for (const entry of entries) {
    const label = entry.group ?? fallback;
    const list = groups.get(label);
    if (list) list.push(entry);
    else groups.set(label, [entry]);
  }
  return [...groups];
}

export type ViewMenuItemsProps = {
  entries: readonly ViewMenuEntry[];
  /** The heading of the items without a `group`. */
  groupLabel: string;
  onToggle: (id: string, visible: boolean) => void;
};

/** The items of a view menu that only show and hide: one labelled group of check items per group. */
export function ViewMenuItems({ entries, groupLabel, onToggle }: ViewMenuItemsProps) {
  return groupsOf(entries, groupLabel).map(([label, group]) => (
    <Dropdown.Group key={label} label={label}>
      {group.map((entry) => (
        <Dropdown.CheckboxItem
          key={entry.id}
          checked={entry.checked}
          disabled={entry.disabled}
          onCheckedChange={(visible) => onToggle(entry.id, visible)}
        >
          {entry.label}
        </Dropdown.CheckboxItem>
      ))}
    </Dropdown.Group>
  ));
}

/**
 * How a view menu reorders its items: the sortable lists and the drag session around the menu
 * (`VIEW_MENU_SORTABLE` from `viewMenuSortable`). Injected, so a menu that only shows and hides
 * carries no drag code.
 */
export type ViewMenuSortable = {
  Items: React.ComponentType<ViewMenuItemsProps & { reorder: ViewMenuReorder }>;
  Root: React.ComponentType<{ children: React.ReactNode }>;
};

/** One thing a view may show or hide: a card field, a category of bars. */
type ViewMenuItem = { id: string; label: string; group?: string };

type ViewMenuProps = {
  items: readonly ViewMenuItem[];
  hidden: readonly string[];
  /** The view «По умолчанию» puts back. */
  defaultHidden: readonly string[];
  onHiddenChange: (hidden: string[]) => void;
  /** The order of the items (ids); with `onOrderChange` the items reorder. */
  order?: readonly string[];
  onOrderChange?: (order: string[]) => void;
  /** The sortable lists, with `onOrderChange`. */
  sortable?: ViewMenuSortable;
  labels: { view: string; group: string; reset: string; reorder?: string };
  size: ControlSize;
  /** The trigger's own attributes, class and ref. */
  triggerProps?: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    ref?: React.Ref<HTMLButtonElement>;
  };
};

/**
 * A view menu over a list of items: the shared trigger, a check item per item (grouped by `group`),
 * a grip per item with `onOrderChange`, and the reset item while the view differs from the default
 * (`defaultHidden`, the order of `items`), which puts both back. `KanbanFieldsMenu` and
 * `GanttCategoriesMenu`; `DataTableColumnsMenu` composes `ViewMenuButton`, `ViewMenuContent` and
 * the items around its columns. Reordering needs `sortable` (`VIEW_MENU_SORTABLE`).
 */
export function ViewMenu({
  items,
  hidden,
  defaultHidden,
  onHiddenChange,
  order,
  onOrderChange,
  sortable,
  labels,
  size,
  triggerProps,
}: ViewMenuProps) {
  const hiddenSet = new Set(hidden);
  const shown = items.filter((item) => !hiddenSet.has(item.id)).length;
  const ordered = orderItems(items, order ?? []);
  const ids = ordered.map((item) => item.id);
  const defaultOrder = items.map((item) => item.id);
  const hiddenChanged = !sameIds(hidden, defaultHidden);
  const orderChanged = onOrderChange !== undefined && !sameOrder(ids, defaultOrder);
  const itemsProps: ViewMenuItemsProps = {
    groupLabel: labels.group,
    entries: ordered.map((item) => ({
      id: item.id,
      label: item.label,
      name: item.label,
      group: item.group,
      checked: !hiddenSet.has(item.id),
    })),
    onToggle: (id, visible) => onHiddenChange(toggleHidden(hidden, id, visible)),
  };
  const menu = (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <ViewMenuButton {...triggerProps} label={labels.view} shown={shown} size={size} />
      </Dropdown.Trigger>
      <ViewMenuContent
        size={size}
        reset={
          hiddenChanged || orderChanged
            ? {
                label: labels.reset,
                onSelect: () => {
                  if (hiddenChanged) onHiddenChange([...defaultHidden]);
                  if (orderChanged) onOrderChange?.(defaultOrder);
                },
              }
            : null
        }
      >
        {sortable && onOrderChange ? (
          <sortable.Items
            {...itemsProps}
            reorder={{
              onReorder: (id, beforeId) => onOrderChange(moveId(ids, id, beforeId)),
              handleLabel: labels.reorder ?? "{label}",
            }}
          />
        ) : (
          <ViewMenuItems {...itemsProps} />
        )}
      </ViewMenuContent>
    </Dropdown.Root>
  );
  return sortable && onOrderChange ? <sortable.Root>{menu}</sortable.Root> : menu;
}
