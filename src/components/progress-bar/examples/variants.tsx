/** Every fill color; the tone tells the outcome, not the progress — `tone`. */
import { ProgressBar, Typography } from "prime-ui-kit";

const ROWS = [
  [
    { tone: "accent", label: "Загрузка", value: 42 },
    { tone: "success", label: "Готово", value: 100 },
    { tone: "warning", label: "Квота", value: 86 },
  ],
  [
    { tone: "danger", label: "Импорт прерван", value: 30 },
    { tone: "info", label: "Синхронизация", value: 20 },
    { tone: "neutral", label: "Индексация", value: 55 },
  ],
] as const;

export default function ProgressBarVariantsExample() {
  return (
    <>
      {ROWS.map((row) => (
        <div key={row[0].tone}>
          {row.map(({ tone, label, value }) => (
            <div key={tone}>
              <ProgressBar value={value} tone={tone} label={label} showValue />
              <Typography as="span" variant="caption" tone="muted">
                {tone}
              </Typography>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
