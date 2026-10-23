/** Loading: the value, the change and the line under it are Skeletons in their geometry, the head stays; the data fades in — `loading`. */
import { Kpi, Sparkline, type SparklinePoint, Typography } from "prime-ui-kit";

/** Daily revenue of 1–22 October, thousands of rubles. */
const REVENUE: SparklinePoint[] = Array.from({ length: 22 }, (_, i) => {
  const date = new Date(2026, 9, 1 + i);
  const weekend = date.getDay() === 0 || date.getDay() === 6;
  const value = 440 + 60 * Math.sin(i / 3.4) + i * 2.4;
  return { date, value: Math.round(weekend ? value * 0.45 : value) };
});

const STATES = [
  { caption: "loading", loading: true },
  { caption: "данные", loading: false },
] as const;

export default function KpiStatesExample() {
  return (
    <>
      <div>
        {STATES.map((state) => (
          <div key={state.caption}>
            <Kpi.Root loading={state.loading}>
              <Kpi.Title>Выручка</Kpi.Title>
              <Kpi.Value>
                8,7<Kpi.Unit>млн ₽</Kpi.Unit>
              </Kpi.Value>
              <Kpi.Delta value={9.6} tone="success">
                +9,6 %
              </Kpi.Delta>
              <Kpi.Period>1–22 окт</Kpi.Period>
              <Kpi.Meta>план 9,5 млн ₽</Kpi.Meta>
              <Kpi.Media>
                <Sparkline data={REVENUE} loading={state.loading} label="Выручка по дням" />
              </Kpi.Media>
            </Kpi.Root>
            <Typography as="span" variant="caption" tone="muted">
              {state.caption}
            </Typography>
          </div>
        ))}
      </div>
    </>
  );
}
