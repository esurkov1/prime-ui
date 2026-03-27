import { ProgressCircle, Typography } from "prime-ui-kit";

/**
 * Typical fill levels and clamping: `value` is clamped to `[0, max]`; if `max <= 0`, scale falls back to `100`.
 * Playground: `snippets/progress/circle-states.tsx`.
 */
export default function StatesExample() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--prime-sys-spacing-xl)",
        alignItems: "flex-end",
        justifyContent: "center",
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
          value 0
        </Typography.Root>
        <ProgressCircle.Root value={0} size="m">
          0%
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
          value 50
        </Typography.Root>
        <ProgressCircle.Root value={50} size="m">
          50%
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
          value 100
        </Typography.Root>
        <ProgressCircle.Root value={100} size="m">
          100%
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
          value −20 → 0
        </Typography.Root>
        <ProgressCircle.Root value={-20} size="m">
          clamp
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
          value 140, max 100
        </Typography.Root>
        <ProgressCircle.Root value={140} max={100} size="m">
          full
        </ProgressCircle.Root>
      </div>
    </div>
  );
}
