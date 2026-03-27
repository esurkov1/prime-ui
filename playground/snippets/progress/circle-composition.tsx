import { ProgressCircle } from "@/components/progress-circle/ProgressCircle";
import { Typography } from "@/components/typography/Typography";
import { IconCheck, IconCircleDot, IconDownload } from "@/icons";

/** Центр кольца — слот `children`: иконка, подпись и вспомогательный текст. */
export default function ProgressCircleCompositionSnippet() {
  return (
    <div className="row rowAlignCenter rowGapMedium">
      <ProgressCircle.Root value={72} max={100} size="xl">
        <div className="previewLabeledCenter">
          <IconCircleDot size="l" />
          <Typography.Root as="span" variant="body-small" weight="medium">
            Готово
          </Typography.Root>
        </div>
      </ProgressCircle.Root>
      <ProgressCircle.Root value={33} max={80} size="l">
        <div className="previewLabeledCenter">
          <Typography.Root as="span" variant="body-large" weight="semibold">
            33
          </Typography.Root>
          <Typography.Root as="span" variant="body-compact" tone="muted">
            из 80
          </Typography.Root>
        </div>
      </ProgressCircle.Root>
      <ProgressCircle.Root value={65} max={100}>
        <div className="previewLabeledCenter">
          <IconDownload />
          <Typography.Root as="span" variant="body-compact" weight="medium">
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
