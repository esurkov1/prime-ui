import * as React from "react";

import { readCssLengthPx } from "./usePosition";

/** A length token of the kit: `--prime-space-7`, `--prime-control-m-height`, `--prime-radius-l`. */
export type LengthToken = `--prime-${string}`;

/**
 * The value of a length token in px (rem and px tokens), read from the document, for geometry that
 * CSS cannot take — SVG coordinates, a canvas, a virtualizer's row height. Follows a theme or a
 * density change: re-reads when `data-theme`, `class` or `style` changes on `<html>` or any
 * element below it, and when the viewport is resized (rem follows the root font size). Without a
 * DOM, or for a token that is not a length, returns `fallbackPx`.
 */
export function useTokenValue(token: LengthToken, fallbackPx = 0): number {
  const [value, setValue] = React.useState(() => readCssLengthPx(token, fallbackPx));

  React.useLayoutEffect(() => {
    const update = () => setValue(readCssLengthPx(token, fallbackPx));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
      subtree: true,
    });
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [token, fallbackPx]);

  return value;
}
