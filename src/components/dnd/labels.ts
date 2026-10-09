/**
 * System strings of the drag-and-drop layer. `{label}`, `{position}`, `{total}`, `{list}`,
 * `{reason}` are substituted.
 */
export type DndLabels = {
  /** `aria-label` of `Dnd.Handle`. */
  handle: string;
  /** Name of the lock a `Dnd.Handle` shows in a `locked` item. */
  locked: string;
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
  /** Live region: an item was moved to a linked list with the keyboard: `{list}` is its name. */
  movedTo: string;
  /** Live region: a linked list refused an item moved with the keyboard. */
  refused: string;
  /** Live region: a target refused the item and said why (`canDrop` answered a string). */
  refusedReason: string;
};

export const defaultDndLabels: DndLabels = {
  handle: "Перетащить",
  locked: "Закреплено",
  roleDescription: "перетаскиваемый элемент",
  grabbed: "{label}: взят",
  dropped: "{label}: перемещён",
  returned: "{label}: возвращён на место",
  cancelled: "{label}: перемещение отменено",
  moved: "{label}: позиция {position} из {total}",
  movedTo: "{label}: «{list}», позиция {position} из {total}",
  refused: "{label}: «{list}» не принимает элемент",
  refusedReason: "{label}: {reason}",
};
