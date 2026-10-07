import { parseColor } from "react-aria-components";

import { Icon } from "@/icons";

import styles from "./swatch.module.css";

/*
 * One color swatch for ColorSwatches, ColorPresets and ColorPicker: the color layer (an SVG rect,
 * so no inline style; a checkerboard for "no color"), the selected check and the shared swatch
 * button look. Hosts size it with `--swatch-size` / `--swatch-radius` and mark the selection
 * with `data-state="checked"` and the check contrast with `data-contrast` (`markContrast`).
 */

/** Class of a selectable swatch (button or option) sized by `--swatch-size` / `--swatch-radius`. */
export const swatchClass = styles.swatch;

/** Color layer of a swatch; `null` draws the "no color" checkerboard. */
export function SwatchFill({ value }: { value: string | null }) {
  if (value == null) return <span aria-hidden className={styles.checker} />;
  return (
    <svg className={styles.fill} aria-hidden="true" viewBox="0 0 1 1" preserveAspectRatio="none">
      <rect width="1" height="1" fill={value} />
    </svg>
  );
}

/** Check mark of the selected swatch; its color contrasts with the swatch (`data-contrast`). */
export function SwatchCheck() {
  return <Icon name="action.check" strokeWidth={3} className={styles.check} />;
}

/** Case- and space-insensitive color comparison; `null` means "no color". */
export function sameColor(a: string | null, b: string | null): boolean {
  return (a ?? "").trim().toLowerCase() === (b ?? "").trim().toLowerCase();
}

/** `dark` when a dark mark contrasts better with the color than a light one (WCAG luminance). */
export function markContrast(value: string): "light" | "dark" {
  try {
    const rgb = parseColor(value).toFormat("rgb");
    const lin = (c: number) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    const l =
      0.2126 * lin(rgb.getChannelValue("red")) +
      0.7152 * lin(rgb.getChannelValue("green")) +
      0.0722 * lin(rgb.getChannelValue("blue"));
    // Equal contrast against white (L=1) and black (L=0) at L ≈ 0.179.
    return l > 0.179 ? "dark" : "light";
  } catch {
    return "dark";
  }
}
