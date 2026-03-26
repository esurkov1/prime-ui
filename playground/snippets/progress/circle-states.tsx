import { ProgressCircle } from "@/components/progress-circle/ProgressCircle";
import { Typography } from "@/components/typography/Typography";

/**
 * Типичные уровни заполнения и нормализация: значение клампится в [0, max];
 * при max ≤ 0 подставляется 100.
 */
export default function ProgressCircleStatesSnippet() {
  return (
    <>
      <div className="previewLabeledCenter">
        <Typography.Root as="span" variant="body-compact" tone="muted">
          value 0
        </Typography.Root>
        <ProgressCircle.Root value={0} size="m">
          0%
        </ProgressCircle.Root>
      </div>
      <div className="previewLabeledCenter">
        <Typography.Root as="span" variant="body-compact" tone="muted">
          value 50
        </Typography.Root>
        <ProgressCircle.Root value={50} size="m">
          50%
        </ProgressCircle.Root>
      </div>
      <div className="previewLabeledCenter">
        <Typography.Root as="span" variant="body-compact" tone="muted">
          value 100
        </Typography.Root>
        <ProgressCircle.Root value={100} size="m">
          100%
        </ProgressCircle.Root>
      </div>
      <div className="previewLabeledCenter">
        <Typography.Root as="span" variant="body-compact" tone="muted">
          value −20 → 0
        </Typography.Root>
        <ProgressCircle.Root value={-20} size="m">
          clamp
        </ProgressCircle.Root>
      </div>
      <div className="previewLabeledCenter">
        <Typography.Root as="span" variant="body-compact" tone="muted">
          value 140, max 100
        </Typography.Root>
        <ProgressCircle.Root value={140} max={100} size="m">
          full
        </ProgressCircle.Root>
      </div>
    </>
  );
}
