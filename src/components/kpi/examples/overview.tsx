/** Two standard cards of a row: the title, the value with its unit and change, the period and a note under it, a chart at the bottom — `Kpi.Title`, `Kpi.Value`, `Kpi.Unit`, `Kpi.Delta`, `Kpi.Period`, `Kpi.Meta`, `Kpi.Media`. */
import { Kpi, Sparkline, type SparklinePoint } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Daily revenue of 1–22 October, thousands of rubles: weekends are quieter. */
const REVENUE: SparklinePoint[] = Array.from({ length: 22 }, (_, i) => {
  const date = new Date(2026, 9, 1 + i);
  const weekend = date.getDay() === 0 || date.getDay() === 6;
  const value = 440 + 60 * Math.sin(i / 3.4) + i * 2.4;
  return { date, value: Math.round(weekend ? value * 0.45 : value) };
});

export default function KpiOverviewExample() {
  return (
    <div className={styles.row}>
      <Kpi.Root>
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
          <Sparkline data={REVENUE} label="Выручка по дням" />
        </Kpi.Media>
      </Kpi.Root>
      <Kpi.Root>
        <Kpi.Title>Отток</Kpi.Title>
        <Kpi.Value>
          3,1<Kpi.Unit>%</Kpi.Unit>
        </Kpi.Value>
        <Kpi.Delta value={0.6} tone="danger">
          +0,6 п. п.
        </Kpi.Delta>
        <Kpi.Period>Октябрь</Kpi.Period>
        <Kpi.Meta>порог 4 %</Kpi.Meta>
      </Kpi.Root>
    </div>
  );
}
