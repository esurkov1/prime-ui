import { parseColor } from "react-aria-components";

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
