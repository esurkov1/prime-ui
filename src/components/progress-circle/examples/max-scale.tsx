import { ProgressCircle, Typography } from "prime-ui-kit";

/** Same fill ratio with different `max` scales (percent, steps, large quotas) (playground: `snippets/progress/circle-max-scale.tsx`). */
export default function MaxScaleExample() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--prime-sys-spacing-xl)",
        alignItems: "flex-end",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--prime-sys-spacing-s)",
        }}
      >
        <Typography.Root as="span" variant="body-compact" tone="muted">
          45 of 100
        </Typography.Root>
        <ProgressCircle.Root value={45} max={100} size="m">
          45%
        </ProgressCircle.Root>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--prime-sys-spacing-s)",
        }}
      >
        <Typography.Root as="span" variant="body-compact" tone="muted">
          3 of 5 steps
        </Typography.Root>
        <ProgressCircle.Root value={3} max={5} size="m">
          3/5
        </ProgressCircle.Root>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--prime-sys-spacing-s)",
        }}
      >
        <Typography.Root as="span" variant="body-compact" tone="muted">
          750 of 1000
        </Typography.Root>
        <ProgressCircle.Root value={750} max={1000} size="m">
          75%
        </ProgressCircle.Root>
      </div>
    </div>
  );
}
