/** While the series loads the plot is a Skeleton of its own height that cross-fades into the data — `loading`. */
import { Sparkline, type SparklinePoint, Typography } from "prime-ui-kit";

const REVENUE: SparklinePoint[] = [
  { label: "июл", value: 2_840_000 },
  { label: "авг", value: 3_120_000 },
  { label: "сен", value: 2_960_000 },
  { label: "окт", value: 3_410_000 },
];

const formatRubles = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;

export default function SparklineStatesExample() {
  return (
    <>
      <div>
        <div>
          <Sparkline data={REVENUE} label="Выручка" formatValue={formatRubles} />
          <Typography as="span" variant="caption" tone="muted">
            data
          </Typography>
        </div>
      </div>
      <div>
        <div>
          <Sparkline data={[]} label="Выручка" loading />
          <Typography as="span" variant="caption" tone="muted">
            loading
          </Typography>
        </div>
      </div>
    </>
  );
}
