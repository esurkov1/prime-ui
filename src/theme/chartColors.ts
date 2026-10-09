/**
 * The chart palette as CSS values, for a chart library that takes colors as strings (SVG `fill`,
 * `stroke`, a series `color`). Each is a `var(--prime-color-chart-*)`: it follows the theme with no
 * re-render. Assign `series` in order and never cycle; fold a ninth series into `other`.
 */
export const chartColors = {
  /** Categorical series 1…8: blue, orange, teal, yellow, pink, green, purple, red. */
  series: [
    "var(--prime-color-chart-1)",
    "var(--prime-color-chart-2)",
    "var(--prime-color-chart-3)",
    "var(--prime-color-chart-4)",
    "var(--prime-color-chart-5)",
    "var(--prime-color-chart-6)",
    "var(--prime-color-chart-7)",
    "var(--prime-color-chart-8)",
  ],
  /** The «Прочее» series or share. */
  other: "var(--prime-color-chart-other)",
  /** Gridlines. */
  grid: "var(--prime-color-chart-grid)",
  /** The axis line and ticks; axis labels take `--prime-color-text-muted`. */
  axis: "var(--prime-color-chart-axis)",
  /** Sequential magnitude 1…5 (heatmap cells), from near the ground to full. */
  scale: [
    "var(--prime-color-chart-scale-1)",
    "var(--prime-color-chart-scale-2)",
    "var(--prime-color-chart-scale-3)",
    "var(--prime-color-chart-scale-4)",
    "var(--prime-color-chart-scale-5)",
  ],
  /** Text on scale steps 4–5; steps 1–3 take `--prime-color-text-primary`. */
  scaleFg: "var(--prime-color-chart-scale-fg)",
} as const;

export type ChartColors = typeof chartColors;
