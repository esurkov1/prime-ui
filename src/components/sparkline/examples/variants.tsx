/** The same week as an area, a bare line and bars from zero — `variant`. */
import { Sparkline, type SparklinePoint, Typography } from "prime-ui-kit";

const ORDERS: SparklinePoint[] = [
  { label: "2 окт", value: 38 },
  { label: "3 окт", value: 44 },
  { label: "4 окт", value: 41 },
  { label: "5 окт", value: 29 },
  { label: "6 окт", value: 33 },
  { label: "7 окт", value: 47 },
  { label: "8 окт", value: 52 },
];

const VARIANTS = ["area", "line", "bars"] as const;

export default function SparklineVariantsExample() {
  return (
    <div>
      {VARIANTS.map((variant) => (
        <div key={variant}>
          <Sparkline data={ORDERS} label="Заказы за неделю" variant={variant} />
          <Typography as="span" variant="caption" tone="muted">
            {variant}
          </Typography>
        </div>
      ))}
    </div>
  );
}
