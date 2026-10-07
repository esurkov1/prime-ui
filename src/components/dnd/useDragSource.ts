import * as React from "react";

import { useDragController } from "./context";
import type { Activation, DragItem, DragOutcome, DragSnapshot } from "./dragSession";
import type { Point, Rect } from "./geometry";
import { useStoreSelector } from "./store";

// A press on a control inside a draggable (a button, a field) is that control's press; the drag must
// not steal it. Handled once here, not by a stopPropagation in every component.
const INTERACTIVE = "button, input, select, textarea, a[href], [data-dnd-ignore]";
// ...unless the control IS the grip: `Dnd.Handle` is a button so it can be reached by keyboard.
const HANDLE = "[data-dnd-handle]";

export type DragSourceItem<TData> = {
  id: string;
  data: TData;
  /** What the live region says about the item. */
  label: string;
};

export type DragSourceProps = {
  "data-dnd-item": string;
  "data-dragging"?: true | undefined;
  "aria-roledescription"?: string | undefined;
  onPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
};

export type DragSourceOptions<TData> = {
  kind: string;
  disabled?: boolean | undefined;
  /** Only a press on a `[data-dnd-handle]` element starts the drag. */
  handleOnly?: boolean | undefined;
  /** Overrides the per-input defaults (mouse: 4px of travel, touch: a 180ms hold). */
  activation?: Activation | undefined;
  onDragStart?: ((item: DragItem<TData>, point: Point, origin: Rect) => void) | undefined;
  onDragEnd?: ((item: DragItem<TData>, outcome: DragOutcome) => void) | undefined;
};

export type DragSourceHandle<TData> = {
  /** The id in flight from THIS source kind, or null. */
  draggingId: string | null;
  props: (item: DragSourceItem<TData>) => DragSourceProps;
};

/**
 * Turns any element into a drag source without a ref and without a component of its own: the element
 * comes from the press itself, so a list built in `.map()` needs one hook, not one component per row.
 */
export function useDragSource<TData = unknown>(
  options: DragSourceOptions<TData>,
): DragSourceHandle<TData> {
  const controller = useDragController();
  // Read at event time: a drag outlives many renders.
  const optionsRef = React.useRef(options);
  React.useEffect(() => {
    optionsRef.current = options;
  });

  const { kind } = options;
  const select = React.useCallback(
    (state: DragSnapshot) => (state.item?.kind === kind ? state.item.id : null),
    [kind],
  );
  const draggingId = useStoreSelector(controller.store, select);

  const props = React.useCallback(
    (item: DragSourceItem<TData>): DragSourceProps => ({
      "data-dnd-item": item.id,
      "data-dragging": draggingId === item.id || undefined,
      "aria-roledescription": options.disabled ? undefined : controller.labels().roleDescription,
      onPointerDown: (event) => {
        const current = optionsRef.current;
        if (current.disabled) return;
        const target = event.target instanceof Element ? event.target : null;
        const onHandle = target?.closest(HANDLE) != null;
        if (current.handleOnly && !onHandle) return;
        if (target?.closest(INTERACTIVE) && !onHandle) return;
        controller.beginPointerDrag<TData>({
          event: event.nativeEvent,
          element: event.currentTarget,
          item: { kind: current.kind, id: item.id, data: item.data, label: item.label },
          ...(current.activation !== undefined ? { activation: current.activation } : {}),
          onDragStart: (dragged, point, origin) =>
            optionsRef.current.onDragStart?.(dragged, point, origin),
          onDragEnd: (dragged, outcome) => optionsRef.current.onDragEnd?.(dragged, outcome),
        });
      },
    }),
    [controller, draggingId, options.disabled],
  );

  return { draggingId, props };
}

/** What is in flight right now, for components that react to a drag they did not start. */
export function useDraggedItem<TData = unknown>(kind?: string): DragItem<TData> | null {
  const controller = useDragController();
  const select = React.useCallback(
    (state: DragSnapshot) => {
      if (!state.item) return null;
      if (kind !== undefined && state.item.kind !== kind) return null;
      return state.item as DragItem<TData>;
    },
    [kind],
  );
  return useStoreSelector(controller.store, select);
}
