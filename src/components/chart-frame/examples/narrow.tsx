/** A 320px column: the actions drop under the title, the plot gets lower and a self-sizing SVG stretches to it — `children`, `height`. */
import { Button, ChartFrame, chartColors, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

const MRR = [6.1, 6.3, 6.2, 6.6, 6.9, 7.0, 7.4, 7.3, 7.8, 8.1, 8.0, 8.4];

const LINE = MRR.map(
  (v, i) => `${i ? "L" : "M"}${(i / (MRR.length - 1)) * 100},${(9 - v) * 25}`,
).join("");

export default function ChartFrameNarrowExample() {
  return (
    <div className={styles.narrow}>
      <ChartFrame.Root>
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
