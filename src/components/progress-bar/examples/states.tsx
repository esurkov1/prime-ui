/** Loading takes the bar's own geometry, so the data lands without a jump — `loading`. */
import { ProgressBar, type ProgressSegment, Typography } from "prime-ui-kit";

const SOURCES: ProgressSegment[] = [
  { value: 412, label: "Сайт", color: "blue" },
  { value: 268, label: "Звонки", color: "orange" },
  { value: 120, label: "Партнёры", color: "teal" },
];

export default function ProgressBarStatesExample() {
  return (
    <>
      <div>
        <div>
          <ProgressBar value={64} label="Импорт контактов" showValue />
          <Typography as="span" variant="caption" tone="muted">
            value
          </Typography>
        </div>
        <div>
          <ProgressBar value={0} label="Импорт контактов" loading />
          <Typography as="span" variant="caption" tone="muted">
            loading
          </Typography>
        </div>
      </div>
      <div>
        <div>
          <ProgressBar segments={SOURCES} label="Лиды по источникам" legend />
          <Typography as="span" variant="caption" tone="muted">
            legend
          </Typography>
        </div>
        <div>
          <ProgressBar segments={SOURCES} label="Лиды по источникам" legend loading />
          <Typography as="span" variant="caption" tone="muted">
            legend · loading
          </Typography>
        </div>
      </div>
    </>
  );
}
