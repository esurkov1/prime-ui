import { ProgressCircle } from "@/components/progress-circle/ProgressCircle";
import { Typography } from "@/components/typography/Typography";

/** Четыре размера кольца: диаметр и толщина штриха из примитивов `progressCircle`. */
export default function ProgressCircleSizesSnippet() {
  return (
    <>
      <div className="previewLabeledCenter">
        <Typography.Root as="span" variant="body-compact" tone="muted">
          Размер s
        </Typography.Root>
        <ProgressCircle.Root value={50} size="s">
          50%
        </ProgressCircle.Root>
      </div>
      <div className="previewLabeledCenter">
        <Typography.Root as="span" variant="body-compact" tone="muted">
          Размер m
        </Typography.Root>
        <ProgressCircle.Root value={50} size="m">
          50%
        </ProgressCircle.Root>
      </div>
      <div className="previewLabeledCenter">
        <Typography.Root as="span" variant="body-compact" tone="muted">
          Размер l
        </Typography.Root>
        <ProgressCircle.Root value={50} size="l">
          50%
        </ProgressCircle.Root>
      </div>
      <div className="previewLabeledCenter">
        <Typography.Root as="span" variant="body-compact" tone="muted">
          Размер xl
        </Typography.Root>
        <ProgressCircle.Root value={50} size="xl">
          50%
        </ProgressCircle.Root>
      </div>
    </>
  );
}
