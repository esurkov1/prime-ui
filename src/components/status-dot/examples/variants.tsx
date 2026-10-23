/** Every tone of the dot; the word names the state without the color — `tone`. */
import { StatusDot, Typography } from "prime-ui-kit";

const TONES = [
  { tone: "neutral", label: "Не запускалась" },
  { tone: "accent", label: "Выполняется" },
  { tone: "success", label: "Работает" },
  { tone: "warning", label: "Задержка" },
  { tone: "danger", label: "Ошибка" },
] as const;

export default function StatusDotVariantsExample() {
  return (
    <div>
      {TONES.map(({ tone, label }) => (
        <div key={tone}>
          <StatusDot tone={tone}>{label}</StatusDot>
          <Typography as="span" variant="caption" tone="muted">
            {tone}
          </Typography>
        </div>
      ))}
    </div>
  );
}
