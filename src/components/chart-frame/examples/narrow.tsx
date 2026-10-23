/** A 320px column: the header keeps one line each and the title gives way to the action, the plot gets lower and a self-sizing SVG stretches to it — `height`, `rows`. */
import { Button, ChartFrame, type ChartFrameSeries, chartColors, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

const SERIES: ChartFrameSeries[] = [{ id: "mrr", label: "Выручка" }];

const MRR = [
  { month: "ноя", value: 6.1 },
  { month: "дек", value: 6.3 },
  { month: "янв", value: 6.2 },
  { month: "фев", value: 6.6 },
  { month: "мар", value: 6.9 },
  { month: "апр", value: 7.0 },
  { month: "май", value: 7.4 },
  { month: "июн", value: 7.3 },
  { month: "июл", value: 7.8 },
  { month: "авг", value: 8.1 },
  { month: "сен", value: 8.0 },
  { month: "окт", value: 8.4 },
];

const ROWS = MRR.map(({ month, value }) => ({ label: month, values: { mrr: value } }));

const LINE = MRR.map(
  ({ value }, i) => `${i ? "L" : "M"}${(i / (MRR.length - 1)) * 100},${(9 - value) * 25}`,
).join("");

const formatMillions = (value: number) => `${value.toLocaleString("ru-RU")} млн ₽`;

export default function ChartFrameNarrowExample() {
  return (
    <div className={styles.narrow}>
      <ChartFrame.Root series={SERIES} rows={ROWS} formatValue={formatMillions}>
        <ChartFrame.Header>
          <ChartFrame.Title>Регулярная выручка</ChartFrame.Title>
          <ChartFrame.Description>За 12 месяцев</ChartFrame.Description>
          <ChartFrame.Actions>
            <Button.Root variant="soft" tone="neutral">
              <Button.Icon>
                <Icon name="action.download" />
              </Button.Icon>
              CSV
            </Button.Root>
          </ChartFrame.Actions>
        </ChartFrame.Header>
        <ChartFrame.Value>
          8,4 млн ₽<ChartFrame.Delta tone="success">+38% за год</ChartFrame.Delta>
        </ChartFrame.Value>
        <ChartFrame.Plot height={120}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d={`${LINE}L100,100L0,100Z`} fill={chartColors.series[0]} fillOpacity={0.1} />
            <path
              d={LINE}
              fill="none"
              stroke={chartColors.series[0]}
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </ChartFrame.Plot>
      </ChartFrame.Root>
    </div>
  );
}
