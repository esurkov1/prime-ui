/** Every way to draw the ring and every arc color; the tone tells the outcome, not the progress — `variant`, `tone`, `color`, `track`. */
import { ProgressCircle, Typography } from "prime-ui-kit";

const VARIANTS = [
  { variant: "line", label: "Загрузка", value: 64, max: 100 },
  { variant: "steps", label: "Шаги профиля", value: 3, max: 5 },
  { variant: "ticks", label: "Загрузка", value: 64, max: 100 },
] as const;

const TONES = [
  { tone: "accent", label: "Загрузка", value: 45 },
  { tone: "success", label: "Готово", value: 100 },
  { tone: "warning", label: "Квота", value: 88 },
  { tone: "danger", label: "Сбой импорта", value: 20 },
  { tone: "info", label: "Синхронизация", value: 30 },
  { tone: "neutral", label: "Индексация", value: 55 },
  { tone: "inherit", label: "Экспорт", value: 64 },
] as const;

const HUES = [
  { color: "yellow", label: "Бронь", value: 0 },
  { color: "blue", label: "В аренде", value: 60 },
] as const;

export default function ProgressCircleVariantsExample() {
  return (
    <>
      <div>
        {VARIANTS.map(({ variant, label, value, max }) => (
          <div key={variant}>
            <ProgressCircle variant={variant} value={value} max={max} aria-label={label}>
              {variant === "steps" ? `${value}/${max}` : `${value}%`}
            </ProgressCircle>
            <Typography as="span" variant="caption" tone="muted">
              {variant}
            </Typography>
          </div>
        ))}
      </div>
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
        {HUES.map(({ color, label, value }) => (
          <div key={color}>
            <ProgressCircle value={value} color={color} track="tinted" aria-label={label}>
              {`${value}%`}
            </ProgressCircle>
            <Typography as="span" variant="caption" tone="muted">
              {`${color} · tinted`}
            </Typography>
          </div>
        ))}
      </div>
    </>
  );
}
