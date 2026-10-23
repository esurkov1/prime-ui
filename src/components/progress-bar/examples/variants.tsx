/** Every way to draw the scale and every fill color; the tone tells the outcome, not the progress — `variant`, `tone`. */
import { ProgressBar, Typography } from "prime-ui-kit";

const TONES = [
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
      <div>
        <div>
          <ProgressBar variant="line" value={64} label="Загрузка" showValue />
          <Typography as="span" variant="caption" tone="muted">
            line
          </Typography>
        </div>
        <div>
          <ProgressBar variant="steps" value={3} max={5} label="Профиль: 3 из 5" />
          <Typography as="span" variant="caption" tone="muted">
            steps
          </Typography>
        </div>
        <div>
          <ProgressBar variant="ticks" value={64} label="Загрузка" showValue />
          <Typography as="span" variant="caption" tone="muted">
            ticks
          </Typography>
        </div>
      </div>
      {TONES.map((row) => (
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
