import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";

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

/**
 * Row selection: controlled / uncontrolled ids, «select all» over every id in the data, Shift+click
 * ranges from the last toggled row, press-and-drag across checkbox cells and a polite count
 * announcement. The cell handlers are stable, so memoized rows do not re-render when the
 * selection of other rows changes.
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
  const [dragging, setDragging] = React.useState(false);

  /** The latest render's data for the stable handlers. */
  const latest = React.useRef({ selectedSet, visibleKeys, setSelectedKeys, announce });
  latest.current = { selectedSet, visibleKeys, setSelectedKeys, announce };
  /** Shift-range anchor, the active drag's teardown, and «the click after a drag is no toggle». */
  const session = React.useRef<{
    anchor: React.Key | null;
    stopDrag: (() => void) | null;
    dragged: boolean;
  }>({ anchor: null, stopDrag: null, dragged: false });
  React.useEffect(() => () => session.current.stopDrag?.(), []);

  const handlers = React.useMemo<RowSelectionHandlers>(() => {
    const commit = (next: Set<React.Key>) => {
      latest.current.selectedSet = next;
      latest.current.setSelectedKeys(Array.from(next));
      setAnnouncement(latest.current.announce(next.size));
    };
    /** Sets every rendered row between two indices (inclusive) to `value`. */
    const applyRange = (from: number, to: number, value: boolean) => {
      const next = new Set(latest.current.selectedSet);
      const keys = latest.current.visibleKeys;
      for (let i = Math.min(from, to); i <= Math.max(from, to); i += 1) {
        const key = keys[i];
        if (key === undefined) continue;
        if (value) next.add(key);
        else next.delete(key);
      }
      commit(next);
    };

    return {
      onPointerDown(index, event) {
        if (event.button !== 0 || event.pointerType === "touch") return;
        // No native text selection or focus jump while pressing / dragging; the box takes focus
        // without a ring (pointer press), so Space continues from it.
        event.preventDefault();
        event.currentTarget
          .querySelector("input")
          ?.focus({ preventScroll: true, focusVisible: false } as FocusOptions);
        const startKey = latest.current.visibleKeys[index];
        if (startKey === undefined) return;
        const value = !latest.current.selectedSet.has(startKey);
        session.current.dragged = false;
        let last = index;

        const onMove = (moveEvent: PointerEvent) => {
          const cell = document
            .elementFromPoint(moveEvent.clientX, moveEvent.clientY)
            ?.closest<HTMLElement>("[data-select-index]");
          if (!cell || !tableRef.current?.contains(cell)) return;
          const next = Number(cell.dataset.selectIndex);
          if (Number.isNaN(next) || next === last) return;
          if (!session.current.dragged) {
            session.current.dragged = true;
            setDragging(true);
          }
          applyRange(last, next, value);
          last = next;
          session.current.anchor = latest.current.visibleKeys[next] ?? session.current.anchor;
        };
        const stop = () => {
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", stop);
          window.removeEventListener("pointercancel", stop);
          session.current.stopDrag = null;
          setDragging(false);
        };
        session.current.stopDrag?.();
        session.current.stopDrag = stop;
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", stop);
        window.addEventListener("pointercancel", stop);
      },

      onClick(index, event) {
        event.stopPropagation();
        // The checkbox label forwards a click on the box visual to the input: only that second
        // click (on the input) counts.
        const target = event.target as HTMLElement;
        if (!(target instanceof HTMLInputElement) && target.closest("label")) return;
        // A drag already applied its range; a pointer click that ends it is no toggle.
        if (session.current.dragged && event.detail > 0) {
          session.current.dragged = false;
          return;
        }
        const keys = latest.current.visibleKeys;
        const key = keys[index];
        if (key === undefined) return;
        const anchorIndex =
          event.shiftKey && session.current.anchor !== null
            ? keys.indexOf(session.current.anchor)
            : -1;
        applyRange(
          anchorIndex >= 0 ? anchorIndex : index,
          index,
          !latest.current.selectedSet.has(key),
        );
        session.current.anchor = key;
      },
    };
  }, [tableRef]);

  const selectedInData = allKeys.filter((key) => selectedSet.has(key)).length;
  const allSelected = allKeys.length > 0 && selectedInData === allKeys.length;

  const toggleAll = () => {
    const next = new Set(selectedSet);
    for (const key of allKeys) {
      if (allSelected) next.delete(key);
      else next.add(key);
    }
    latest.current.selectedSet = next;
    setSelectedKeys(Array.from(next));
    setAnnouncement(announce(next.size));
  };

  return {
    selectedSet,
    allSelected,
    someSelected: selectedInData > 0 && !allSelected,
    announcement,
    dragging,
    toggleAll,
    handlers,
  };
}
