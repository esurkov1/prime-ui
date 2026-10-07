import * as React from "react";

type UseEscapeKeyOptions = {
  enabled: boolean;
  onEscape: () => void;
};

/**
 * Stack of active Escape layers (Modal, Drawer, Popover, Select…). Only the most recently
 * enabled layer reacts, so Escape inside a Select that lives in a Modal closes the Select only,
 * and a nested Drawer closes before its parent. An Escape whose default was prevented by a
 * nested control is ignored by every layer.
 */
const escapeLayers: symbol[] = [];

export function useEscapeKey({ enabled, onEscape }: UseEscapeKeyOptions) {
  const onEscapeRef = React.useRef(onEscape);
  onEscapeRef.current = onEscape;

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const layer = Symbol("escape-layer");
    escapeLayers.push(layer);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      // A nested control (listbox, combobox) already consumed this Escape.
      if (event.defaultPrevented) {
        return;
      }
      if (escapeLayers[escapeLayers.length - 1] !== layer) {
        return;
      }

      onEscapeRef.current();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      const index = escapeLayers.lastIndexOf(layer);
      if (index !== -1) {
        escapeLayers.splice(index, 1);
      }
    };
  }, [enabled]);
}
