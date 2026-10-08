import * as React from "react";

import { prefersReducedMotion } from "@/hooks/usePresence";

import { useDragController } from "./context";
import type { DragItem } from "./dragSession";
import type { Point } from "./geometry";

export type DropTargetOptions<TValue, TData = unknown> = {
  /** Which drag kinds this target answers to. */
  accepts: string | readonly string[] | ((item: DragItem) => boolean);
  /** Turns a pointer position into what a drop here would mean (an insertion point, a slot number). `null` means "not over anything droppable". */
  resolve: (point: Point, item: DragItem<TData>, element: HTMLElement) => TValue | null;
  /** Whether the resolved spot will take this item. Separate from `resolve` so a preview can still be drawn where the refusal is. */
  canDrop?: ((value: TValue, item: DragItem<TData>) => boolean) | undefined;
  onDrop: (value: TValue, item: DragItem<TData>) => void;
  disabled?: boolean | undefined;
  /**
   * The drop stays aimed here while the pointer crosses empty space after leaving (the gutter
   * between lists), and a release there drops here at the last resolved spot.
   */
  holdsDrop?: boolean | undefined;
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
  /** Ends the drop flash when its animation finishes. */
  onAnimationEnd: (event: React.AnimationEvent<HTMLElement>) => void;
};

export type DropTargetHandle = {
  /** The id the target registered under; `DragSnapshot.overId` names it while the pointer is over. */
  id: string;
  /** True while a pointer carrying an accepted item is inside, whether or not the spot can take a drop. */
  isOver: boolean;
  /** The registered element, for callers that also measure it. */
  element: HTMLElement | null;
  props: DropTargetProps;
};

function acceptsFor(accepts: DropTargetOptions<never>["accepts"]): (item: DragItem) => boolean {
  if (typeof accepts === "function") return accepts;
  if (typeof accepts === "string") return (item) => item.kind === accepts;
  return (item) => accepts.includes(item.kind);
}

const OUTSIDE = { isOver: false, canDrop: false };

/**
 * Registers an element as somewhere a drag can land. The target owns the meaning of a drop. Only
 * «over / can drop» is React state: a pointer move that changes neither re-renders nothing.
 */
export function useDropTarget<TValue, TData = unknown>(
  options: DropTargetOptions<TValue, TData>,
): DropTargetHandle {
  const controller = useDragController();
  const id = React.useId();
  const optionsRef = React.useRef(options);
  React.useEffect(() => {
    optionsRef.current = options;
  });

  const [element, setElement] = React.useState<HTMLElement | null>(null);
  const [state, setState] = React.useState(OUTSIDE);
  const [flashing, setFlashing] = React.useState(false);

  const ref = React.useCallback<React.RefCallback<HTMLElement | null>>((node) => {
    setElement(node);
  }, []);

  const disabled = options.disabled ?? false;

  React.useEffect(() => {
    if (!element || disabled) return;
    // The session hands every target the untyped item; this target's kinds decide what it carries.
    const typed = (item: DragItem) => item as DragItem<TData>;
    // What the pointer last resolved here: a release over empty space drops it.
    let last: { value: TValue | null; canDrop: boolean } = { value: null, canDrop: false };
    const resolveAt = (point: Point, item: DragItem) => {
      const value = optionsRef.current.resolve(point, typed(item), element);
      const canDrop = value !== null && (optionsRef.current.canDrop?.(value, typed(item)) ?? true);
      last = { value, canDrop };
      return last;
    };
    const land = (value: TValue | null, canDrop: boolean, item: DragItem) => {
      setState(OUTSIDE);
      if (value === null || !canDrop) return;
      optionsRef.current.onDrop(value, typed(item));
      // Under reduced motion the flash has no animation, so nothing would end it.
      if (optionsRef.current.flashOnDrop && !prefersReducedMotion()) setFlashing(true);
    };
    return controller.registerTarget({
      id,
      element,
      accepts: (item) => acceptsFor(optionsRef.current.accepts)(item),
      holdsDrop: optionsRef.current.holdsDrop ?? false,
      enter: (item) => {
        optionsRef.current.onEnter?.(typed(item));
        setState((current) => (current.isOver ? current : { ...current, isOver: true }));
      },
      over: (point, item) => {
        const { canDrop } = resolveAt(point, item);
        setState((current) =>
          current.isOver && current.canDrop === canDrop ? current : { isOver: true, canDrop },
        );
        return canDrop;
      },
      leave: () => {
        optionsRef.current.onLeave?.();
        setState(OUTSIDE);
      },
      drop: (point, item) => {
        const { value, canDrop } = resolveAt(point, item);
        land(value, canDrop, item);
      },
      dropHeld: (item) => land(last.value, last.canDrop, item),
    });
  }, [controller, element, disabled, id]);

  const onAnimationEnd = React.useCallback((event: React.AnimationEvent<HTMLElement>) => {
    if (event.target === event.currentTarget) setFlashing(false);
  }, []);

  return {
    id,
    element,
    isOver: state.isOver,
    props: {
      ref,
      "data-dnd-over": state.isOver || undefined,
      "data-dnd-reject": (state.isOver && !state.canDrop) || undefined,
      "data-dnd-flash": flashing || undefined,
      onAnimationEnd,
    },
  };
}
