import { ProgressCircle, Typography } from "prime-ui-kit";

/**
 * No text in the ring: the accessible name comes from `label` (`aria-label` on the SVG).
 * Pair with visible copy beside the ring when the UI needs a readable caption.
 * Playground: `snippets/progress/circle-a11y-label.tsx`.
 */
export default function A11yLabelExample() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--prime-sys-spacing-m)",
        alignItems: "center",
      }}
    >
      <ProgressCircle.Root value={62} max={100} label="Data sync, 62 percent complete" />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--prime-sys-spacing-s)",
        }}
      >
        <ProgressCircle.Root value={4} max={12} size="s" label="Subscription month 4 of 12" />
        <Typography.Root as="span" variant="body-small">
          Subscription · month 4 of 12
        </Typography.Root>
      </div>
    </div>
  );
}
