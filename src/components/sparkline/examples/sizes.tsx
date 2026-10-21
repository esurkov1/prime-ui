/** One week of orders at every tier, from a 40 px plot to a 128 px one — `size`. */
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

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function SparklineSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <Sparkline data={ORDERS} label="Заказы за неделю" size={size} />
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
        </div>
      ))}
    </div>
  );
}
