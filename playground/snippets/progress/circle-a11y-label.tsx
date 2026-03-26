import { ProgressCircle } from "@/components/progress-circle/ProgressCircle";
import { Typography } from "@/components/typography/Typography";

/**
 * Без текста в центре: доступное имя задаётся пропом `label` (aria-label на SVG).
 * Полезно для компактных карточек и иконок-индикаторов.
 */
export default function ProgressCircleA11yLabelSnippet() {
  return (
    <div className="row rowAlignCenter rowGapMedium">
      <ProgressCircle.Root
        value={62}
        max={100}
        size="m"
        label="Синхронизация данных, 62 процента"
      />
      <div className="row rowAlignCenter rowGapTight">
        <ProgressCircle.Root value={4} max={12} size="s" label="Месяц 4 из 12 в подписке" />
        <Typography.Root as="span" variant="body-small">
          Подписка · месяц 4 из 12
        </Typography.Root>
      </div>
    </div>
  );
}
