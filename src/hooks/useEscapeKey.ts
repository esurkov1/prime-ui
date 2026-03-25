import * as React from "react";

type UseEscapeKeyOptions = {
  enabled: boolean;
  onEscape: () => void;
};

export function useEscapeKey({ enabled, onEscape }: UseEscapeKeyOptions) {
  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      onEscape();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [enabled, onEscape]);
}
