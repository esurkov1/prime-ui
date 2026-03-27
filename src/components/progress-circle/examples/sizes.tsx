import { ProgressCircle, Typography } from "prime-ui-kit";

/** Four ring sizes: diameter and stroke from `progressCircle` primitives (playground: `snippets/progress/circle-sizes.tsx`). */
export default function SizesExample() {
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
          Size s
        </Typography.Root>
        <ProgressCircle.Root value={50} size="s">
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
          Size m
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
          Size l
        </Typography.Root>
        <ProgressCircle.Root value={50} size="l">
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
          Size xl
        </Typography.Root>
        <ProgressCircle.Root value={50} size="xl">
          50%
        </ProgressCircle.Root>
      </div>
    </div>
  );
}
