import { IconCheck, IconCircleDot, IconDownload, ProgressCircle, Typography } from "prime-ui-kit";

/** Center slot: icon, short label, and numeric breakdowns (playground: `snippets/progress/circle-composition.tsx`). */
export default function CompositionExample() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--prime-sys-spacing-m)",
        alignItems: "center",
      }}
    >
      <ProgressCircle.Root value={72} max={100} size="xl">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--prime-sys-spacing-xs)",
          }}
        >
          <IconCircleDot size="l" aria-hidden />
          <Typography.Root as="span" variant="body-small" weight="medium">
            On track
          </Typography.Root>
        </div>
      </ProgressCircle.Root>
      <ProgressCircle.Root value={33} max={80} size="l">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--prime-sys-spacing-xs)",
          }}
        >
          <Typography.Root as="span" variant="body-large" weight="semibold">
            33
          </Typography.Root>
          <Typography.Root as="span" variant="body-compact" tone="muted">
            of 80
          </Typography.Root>
        </div>
      </ProgressCircle.Root>
      <ProgressCircle.Root value={65} max={100}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--prime-sys-spacing-xs)",
          }}
        >
          <IconDownload aria-hidden />
          <Typography.Root as="span" variant="body-compact" weight="medium">
            65%
          </Typography.Root>
        </div>
      </ProgressCircle.Root>
      <ProgressCircle.Root value={100} max={100} size="s">
        <IconCheck size="s" aria-hidden />
      </ProgressCircle.Root>
    </div>
  );
}
