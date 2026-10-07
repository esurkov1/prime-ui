import * as React from "react";

function paint(table: HTMLTableElement, columnId: string | null) {
  for (const cell of table.querySelectorAll<HTMLElement>("[data-column-id]")) {
    if (columnId !== null && cell.dataset.columnId === columnId) {
      cell.dataset.columnHovered = "true";
    } else {
      delete cell.dataset.columnHovered;
    }
  }
}

/**
 * Column highlight: one delegated `pointerover` on the table marks the cells of the hovered column
 * with `data-column-hovered` directly in the DOM. Hovering never re-renders the table.
 */
export function useColumnHover(enabled: boolean) {
  return React.useMemo(() => {
    if (!enabled) return undefined;
    let current: string | null = null;
    return {
      onPointerOver(event: React.PointerEvent<HTMLTableElement>) {
        const cell = (event.target as Element).closest<HTMLElement>("[data-column-id]");
        const columnId = cell?.dataset.columnId ?? null;
        if (columnId === current) return;
        current = columnId;
        paint(event.currentTarget, columnId);
      },
      onPointerLeave(event: React.PointerEvent<HTMLTableElement>) {
        current = null;
        paint(event.currentTarget, null);
      },
    };
  }, [enabled]);
}
