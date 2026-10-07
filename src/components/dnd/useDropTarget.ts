import * as React from "react";

import { useDragController } from "./context";
import type { DragItem } from "./dragSession";
import type { Point } from "./geometry";

// How long a target keeps its "something just landed here" tint after a drop.
const FLASH_MS = 700;

export type DropTargetOptions<TValue, TData = unknown> = {
  /** Which drag kinds this target answers to. */
  accepts: string | readonly string[] | ((item: DragItem) => boolean);
  /** Turns a pointer position into what a drop here would mean (an insertion point, a slot number). `null` means "not over anything droppable". */
  resolve: (point: Point, item: DragItem<TData>, element: HTMLElement) => TValue | null;
  /** Whether the resolved spot will take this item. Separate from `resolve` so a preview can still be drawn where the refusal is. */
  canDrop?: ((value: TValue, item: DragItem<TData>) => boolean) | undefined;
  onDrop: (value: TValue, item: DragItem<TData>) => void;
  disabled?: boolean | undefined;
  onEnter?: ((item: DragItem<TData>) => void) | undefined;
  onLeave?: (() => void) | undefined;
  /** Flashes the target once a drop lands, so the eye can follow where the item went. */
  flashOnDrop?: boolean | undefined;
};

export type DropTargetProps = {
  ref: React.RefCallback<HTMLElement | null>;
  "data-dnd-over"?: true | undefined;
  "data-dnd-reject"?: true | undefined;
  "data-dnd-flash"?: true | undefined;
};

export type DropTargetHandle<TValue> = {
  /** The id the target registered under; `DragSnapshot.overId` names it while the pointer is over. */
  id: string;
  /** True while a pointer carrying an accepted item is inside, whether or not the spot can take a drop. */
  isOver: boolean;
  /** The registered element, for callers that also measure it. */
  element: HTMLElement | null;
  /** What `resolve` last returned. */
  value: TValue | null;
  canDrop: boolean;
  props: DropTargetProps;
};

function acceptsFor(accepts: DropTargetOptions<never>["accepts"]): (item: DragItem) => boolean {
  if (typeof accepts === "function") return accepts;
  if (typeof accepts === "string") return (item) => item.kind === accepts;
  return (item) => accepts.includes(item.kind);
}

/** Registers an element as somewhere a drag can land. The target owns the meaning of a drop. */
export function useDropTarget<TValue, TData = unknown>(
  options: DropTargetOptions<TValue, TData>,
): DropTargetHandle<TValue> {
  const controller = useDragController();
  const id = React.useId();
  const optionsRef = React.useRef(options);
  React.useEffect(() => {
    optionsRef.current = options;
  });

  const [element, setElement] = React.useState<HTMLElement | null>(null);
  const [state, setState] = React.useState<{
    isOver: boolean;
    value: TValue | null;
    canDrop: boolean;
  }>({ isOver: false, value: null, canDrop: false });
  const [flashing, setFlashing] = React.useState(false);

  const ref = React.useCallback<React.RefCallback<HTMLElement | null>>((node) => {
    setElement(node);
  }, []);

  const disabled = options.disabled ?? false;

  React.useEffect(() => {
    if (!element || disabled) return;
    const typed = (item: DragItem) => item as DragItem<TData>;
    return controller.registerTarget({
      id,
      element,
      accepts: (item) => acceptsFor(optionsRef.current.accepts)(item),
      enter: (item) => {
        optionsRef.current.onEnter?.(typed(item));
        setState((current) => (current.isOver ? current : { ...current, isOver: true }));
      },
      over: (point, item) => {
        const value = optionsRef.current.resolve(point, typed(item), element);
        const canDrop =
          value !== null && (optionsRef.current.canDrop?.(value, typed(item)) ?? true);
        setState((current) =>
          current.isOver && current.canDrop === canDrop && Object.is(current.value, value)
            ? current
            : { isOver: true, value, canDrop },
        );
        return canDrop;
      },
      leave: () => {
        optionsRef.current.onLeave?.();
        setState({ isOver: false, value: null, canDrop: false });
      },
      drop: (point, item) => {
        const value = optionsRef.current.resolve(point, typed(item), element);
        setState({ isOver: false, value: null, canDrop: false });
        if (value === null) return;
        if (!(optionsRef.current.canDrop?.(value, typed(item)) ?? true)) return;
        optionsRef.current.onDrop(value, typed(item));
        if (optionsRef.current.flashOnDrop) setFlashing(true);
      },
    });
  }, [controller, element, disabled, id]);

  React.useEffect(() => {
    if (!flashing) return;
    const timer = setTimeout(() => setFlashing(false), FLASH_MS);
    return () => clearTimeout(timer);
  }, [flashing]);

  return {
    id,
    element,
    isOver: state.isOver,
    value: state.value,
    canDrop: state.canDrop,
    props: {
      ref,
      "data-dnd-over": state.isOver || undefined,
      "data-dnd-reject": (state.isOver && !state.canDrop) || undefined,
      "data-dnd-flash": flashing || undefined,
    },
  };
}
