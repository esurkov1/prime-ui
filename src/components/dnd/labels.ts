/** System strings of the drag-and-drop layer. `{label}`, `{position}`, `{total}` are substituted. */
export type DndLabels = {
  /** `aria-label` of `Dnd.Handle`. */
  handle: string;
  /** `aria-roledescription` of every draggable element. */
  roleDescription: string;
  /** Live region: an item was picked up. */
  grabbed: string;
  /** Live region: an item was dropped on a target. */
  dropped: string;
  /** Live region: an item was released over nothing and went back. */
  returned: string;
  /** Live region: the drag was cancelled (Escape, system interruption). */
  cancelled: string;
  /** Live region: an item was moved with the keyboard. */
  moved: string;
};

export const defaultDndLabels: DndLabels = {
  handle: "Перетащить",
  roleDescription: "перетаскиваемый элемент",
  grabbed: "{label}: взят",
  dropped: "{label}: перемещён",
  returned: "{label}: возвращён на место",
  cancelled: "{label}: перемещение отменено",
  moved: "{label}: позиция {position} из {total}",
};

export function formatLabel(
  template: string,
  values: { label: string; position?: number; total?: number },
): string {
  return template
    .replaceAll("{label}", values.label)
    .replaceAll("{position}", String(values.position ?? ""))
    .replaceAll("{total}", String(values.total ?? ""));
}
