import { ProgressCircle } from "@/components/progress-circle/ProgressCircle";
import { Typography } from "@/components/typography/Typography";

/**
 * Без текста в центре: доступное имя задаётся пропом `label` (aria-label на SVG).
 * Полезно для компактных карточек и иконок-индикаторов.
 */
export default function ProgressCircleA11yLabelSnippet() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "center" }}>
      <ProgressCircle.Root
        value={62}
        max={100}
        size="m"
        label="Синхронизация данных, 62 процента"
      />
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <ProgressCircle.Root value={4} max={12} size="s" label="Месяц 4 из 12 в подписке" />
        <Typography.Root as="span" size="s">
          Подписка · месяц 4 из 12
        </Typography.Root>
      </div>
    </div>
  );
}
