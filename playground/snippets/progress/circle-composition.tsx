import { ProgressCircle } from "@/components/progress-circle/ProgressCircle";
import { Typography } from "@/components/typography/Typography";
import { IconCheck, IconCircleDot, IconDownload } from "@/icons";

/** Центр кольца — слот `children`: иконка, подпись и вспомогательный текст. */
export default function ProgressCircleCompositionSnippet() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "center" }}>
      <ProgressCircle.Root value={72} max={100} size="xl">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <IconCircleDot size="l" />
          <Typography.Root as="span" size="s" weight="medium">
            Готово
          </Typography.Root>
        </div>
      </ProgressCircle.Root>
      <ProgressCircle.Root value={33} max={80} size="l">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.125rem",
          }}
        >
          <Typography.Root as="span" size="l" weight="semibold">
            33
          </Typography.Root>
          <Typography.Root as="span" size="xs" tone="muted">
            из 80
          </Typography.Root>
        </div>
      </ProgressCircle.Root>
      <ProgressCircle.Root value={65} max={100} size="m">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.125rem",
          }}
        >
          <IconDownload size="m" />
          <Typography.Root as="span" size="xs" weight="medium">
            65%
          </Typography.Root>
        </div>
      </ProgressCircle.Root>
      <ProgressCircle.Root value={100} max={100} size="s">
        <IconCheck size="s" />
      </ProgressCircle.Root>
    </div>
  );
}
