import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { useRangeSelection } from "@/internal/useRangeSelection";

type UseRowSelectionOptions = {
  selected?: React.Key[];
  defaultSelected: React.Key[];
  onSelectedChange?: (selected: React.Key[]) => void;
  /** Ids of the rendered rows in order: Shift ranges and drags run over them. */
  visibleKeys: React.Key[];
  /** Every id in the data: the scope of «select all». */
  allKeys: React.Key[];
  tableRef: React.RefObject<HTMLTableElement | null>;
  /** Announcement after a change, from the selected count. */
  announce: (count: number) => string;
};

export type RowSelectionHandlers = {
  /** Press on a checkbox cell: starts a drag across checkboxes (mouse and pen). */
  onPointerDown: (index: number, event: React.PointerEvent<HTMLElement>) => void;
  /** Click (pointer or Space) on a checkbox cell: toggles the row; Shift extends from the anchor. */
  onClick: (index: number, event: React.MouseEvent<HTMLElement>) => void;
};

/** A checkbox cell under the pointer, with its row index. */
const hitCell = (element: Element) => {
  const cell = element.closest<HTMLElement>("[data-select-index]");
  if (!cell) return null;
  const index = Number(cell.dataset.selectIndex);
  return Number.isNaN(index) ? null : index;
};

/**
 * Row selection: controlled / uncontrolled ids, «select all» over every id in the data, and the
 * shared range selection (`internal/useRangeSelection`) over the checkbox cells — Shift+click
 * ranges from the anchor, press-and-drag across checkboxes with the table's scroller following,
 * «the click after a drag is no toggle» — plus a polite count announcement. The cell handlers are
 * stable, so memoized rows do not re-render when the selection of other rows changes.
 */
export function useRowSelection({
  selected,
  defaultSelected,
  onSelectedChange,
  visibleKeys,
  allKeys,
  tableRef,
  announce,
}: UseRowSelectionOptions) {
  const [selectedKeys, setSelectedKeys] = useControllableState<React.Key[]>({
    value: selected,
    defaultValue: defaultSelected,
    onChange: onSelectedChange,
  });
  const selectedSet = React.useMemo(() => new Set(selectedKeys), [selectedKeys]);
  const [announcement, setAnnouncement] = React.useState("");
  /** The selection as of the last commit: several commits may land before the next render. */
  const current = React.useRef(selectedSet);
  current.current = selectedSet;

  const commit = (next: Set<React.Key>) => {
    current.current = next;
    setSelectedKeys(Array.from(next));
    setAnnouncement(announce(next.size));
  };

  const range = useRangeSelection<React.Key>({
    keys: visibleKeys,
    isSelected: (key) => current.current.has(key),
    apply: (keys, value) => {
      const next = new Set(current.current);
      for (const key of keys) {
        if (value) next.add(key);
        else next.delete(key);
      }
      commit(next);
    },
    containerRef: tableRef,
    hit: hitCell,
    autoScroll: true,
  });

  const handlers = React.useMemo<RowSelectionHandlers>(
    () => ({
      onPointerDown(index, event) {
        if (event.button !== 0 || event.pointerType === "touch") return;
        // The box takes focus without a ring (a pointer press), so Space continues from it.
        event.currentTarget
          .querySelector("input")
          ?.focus({ preventScroll: true, focusVisible: false } as FocusOptions);
        range.handlers.onPointerDown(index, event);
      },
      onClick(index, event) {
        event.stopPropagation();
        // The checkbox label forwards a click on the box visual to the input: only that second
        // click (on the input) counts.
        const target = event.target as HTMLElement;
        if (!(target instanceof HTMLInputElement) && target.closest("label")) return;
        range.handlers.onClick(index, event);
      },
    }),
    [range.handlers],
  );

  const selectedInData = allKeys.filter((key) => selectedSet.has(key)).length;
  const allSelected = allKeys.length > 0 && selectedInData === allKeys.length;

  const toggleAll = () => {
    const next = new Set(selectedSet);
    for (const key of allKeys) {
      if (allSelected) next.delete(key);
      else next.add(key);
    }
    commit(next);
  };

  return {
    selectedKeys,
    selectedSet,
    allSelected,
    someSelected: selectedInData > 0 && !allSelected,
    announcement,
    dragging: range.dragging,
    toggleAll,
    clear: () => commit(new Set()),
    handlers,
  };
}
