import { ProgressCircle } from "@/components/progress-circle/ProgressCircle";
import { Typography } from "@/components/typography/Typography";

/** Одна и та же доля заполнения при разных верхних границах `max` (проценты, шаги, крупная шкала). */
export default function ProgressCircleMaxScaleSnippet() {
  return (
    <>
      <div className="previewLabeledCenter">
        <Typography.Root as="span" size="xs" tone="muted">
          45 из 100
        </Typography.Root>
        <ProgressCircle.Root value={45} max={100} size="m">
          45%
        </ProgressCircle.Root>
      </div>
      <div className="previewLabeledCenter">
        <Typography.Root as="span" size="xs" tone="muted">
          3 из 5 шагов
        </Typography.Root>
        <ProgressCircle.Root value={3} max={5} size="m">
          3/5
        </ProgressCircle.Root>
      </div>
      <div className="previewLabeledCenter">
        <Typography.Root as="span" size="xs" tone="muted">
          750 из 1000
        </Typography.Root>
        <ProgressCircle.Root value={750} max={1000} size="m">
          75%
        </ProgressCircle.Root>
      </div>
    </>
  );
}
