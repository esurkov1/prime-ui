/** The same month of active users as a smooth curve, straight segments and steps — `curve`. */
import { Sparkline, type SparklinePoint, Typography } from "prime-ui-kit";

const USERS: SparklinePoint[] = [
  { label: "сен, 1 нед.", value: 1240 },
  { label: "сен, 2 нед.", value: 1380 },
  { label: "сен, 3 нед.", value: 1310 },
  { label: "сен, 4 нед.", value: 1620 },
  { label: "окт, 1 нед.", value: 1590 },
  { label: "окт, 2 нед.", value: 1840 },
];

const CURVES = ["smooth", "linear", "step"] as const;

export default function SparklineCurveExample() {
  return (
    <div>
      {CURVES.map((curve) => (
        <div key={curve}>
          <Sparkline data={USERS} label="Активные пользователи" curve={curve} />
          <Typography as="span" variant="caption" tone="muted">
            {curve}
          </Typography>
        </div>
      ))}
    </div>
  );
}
