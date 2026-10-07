/** Every arc color; the tone tells the outcome, not the progress — `tone`. */
import { ProgressCircle, Typography } from "prime-ui-kit";

const TONES = [
  { tone: "accent", label: "Загрузка", value: 45 },
  { tone: "success", label: "Готово", value: 100 },
  { tone: "warning", label: "Квота", value: 88 },
  { tone: "danger", label: "Сбой импорта", value: 20 },
  { tone: "info", label: "Синхронизация", value: 30 },
  { tone: "neutral", label: "Индексация", value: 55 },
] as const;

export default function ProgressCircleVariantsExample() {
  return (
    <div>
      {TONES.map(({ tone, label, value }) => (
        <div key={tone}>
          <ProgressCircle value={value} tone={tone} aria-label={label}>
            {`${value}%`}
          </ProgressCircle>
          <Typography as="span" variant="caption" tone="muted">
            {tone}
          </Typography>
        </div>
      ))}
    </div>
  );
}
