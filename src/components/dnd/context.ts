import * as React from "react";

import { type DragController, IDLE_SNAPSHOT } from "./dragSession";
import { defaultDndLabels } from "./labels";

// What a component with no `Dnd.Root` above it gets: an engine that never starts a drag and never
// registers a target. A component that merely CONTAINS a draggable stays mountable anywhere; it just
// is not draggable (its keyboard reorder and clicks work as usual).
const INERT: DragController = {
  store: {
    getSnapshot: () => IDLE_SNAPSHOT,
    subscribe: () => () => {},
    setState: () => {},
  },
  registerTarget: () => () => {},
  beginPointerDrag: () => {},
  announce: () => {},
  labels: () => defaultDndLabels,
  cancel: () => {},
  subscribeOverlay: () => () => {},
  destroy: () => {},
};

export const DragControllerContext = React.createContext<DragController | null>(null);

/** The one drag session every drag hook runs in, mounted by `Dnd.Root`. */
export function useDragController(): DragController {
  return React.useContext(DragControllerContext) ?? INERT;
}
