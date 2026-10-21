import * as React from "react";

import { Dnd } from "@/components/dnd/Dnd";
import { Dropdown } from "@/components/dropdown/Dropdown";

import { formatLabel } from "./formatLabel";
import {
  groupsOf,
  type ViewMenuEntry,
  type ViewMenuItemsProps,
  type ViewMenuReorder,
  type ViewMenuSortable,
} from "./ViewMenu";
import styles from "./ViewMenu.module.css";

const MOVE_KEYS = "Alt+ArrowUp Alt+ArrowDown";
const entryId = (entry: ViewMenuEntry) => entry.id;
const entryName = (entry: ViewMenuEntry) => entry.name;

/**
 * The items of a view menu that reorder: one labelled `Dropdown.Group` per group, each a
 * `Dnd.Sortable` list of its own (an item moves only inside its group). A grip ends each item (a
 * lock on one that holds its place; a held press drags on touch), and Alt + ↑ / ↓ on the focused
 * item moves it, the focus staying on it in its new place.
 */
export function SortableViewMenuItems({
  entries,
  groupLabel,
  onToggle,
  reorder,
}: ViewMenuItemsProps & { reorder: ViewMenuReorder }) {
  /** The item a keyboard move carried: it keeps the focus once it is drawn in its new place. */
  const refocus = React.useRef<string | null>(null);
  const kind = React.useId();

  React.useLayoutEffect(() => {
    const id = refocus.current;
    if (id === null) return;
    refocus.current = null;
    // One menu is open at a time: the item is in it.
    const item = document.querySelector<HTMLElement>(
      `[role="menu"] [data-dnd-item="${CSS.escape(id)}"] [role="menuitemcheckbox"]`,
    );
    if (item && document.activeElement !== item) item.focus({ focusVisible: true } as FocusOptions);
  });

  const onReorder = (group: readonly ViewMenuEntry[], id: string, before: string | null) => {
    // The end of a group is the place before the entry that follows it in the whole order.
    const last = group.at(-1);
    const after = last ? entries[entries.indexOf(last) + 1] : undefined;
    const beforeId = before ?? after?.id ?? null;
    // A move from the keyboard: the focused item keeps the focus where it lands.
    const focused = document.activeElement;
    const item = focused?.closest<HTMLElement>("[data-dnd-item]");
    if (item?.dataset.dndItem === id && focused?.getAttribute("role") === "menuitemcheckbox") {
      refocus.current = id;
    }
    reorder.onReorder(id, beforeId);
  };

  return (
    <>
      {groupsOf(entries, groupLabel).map(([label, group], index) => (
        <Dropdown.Group key={label} label={label}>
          <Dnd.Sortable
            items={group}
            getId={entryId}
            getLabel={entryName}
            onReorder={(id, before) => onReorder(group, id, before)}
            handle
            kind={`${kind}-${index}`}
            className={styles.list}
            renderItem={(entry) => (
              <Dnd.SortableItem id={entry.id} locked={entry.locked} className={styles.item}>
                <Dropdown.CheckboxItem
                  checked={entry.checked}
                  disabled={entry.disabled}
                  onCheckedChange={(visible) => onToggle(entry.id, visible)}
                  className={styles.check}
                  aria-keyshortcuts={entry.locked ? undefined : MOVE_KEYS}
                >
                  {entry.label}
                </Dropdown.CheckboxItem>
                {/* The menu moves focus between its items: the grip is for the pointer (a press
                    leaves the focus where it was: the lifted item leaves the layout), the item
                    itself takes Alt + ↑ / ↓. */}
                <Dnd.Handle
                  tabIndex={-1}
                  onMouseDown={(event) => event.preventDefault()}
                  aria-label={formatLabel(reorder.handleLabel, { label: entry.name })}
                />
              </Dnd.SortableItem>
            )}
          />
        </Dropdown.Group>
      ))}
    </>
  );
}

/** What `ViewMenu` takes as `sortable`: the lists and the drag session they need. */
export const VIEW_MENU_SORTABLE: ViewMenuSortable = {
  Items: SortableViewMenuItems,
  Root: Dnd.Root,
};
