/** A figure made of parts: ticks of the parts under the value, their legend — color, name, value, share — in the footer; M shows up to three parts — `Kpi.Legend`, `Kpi.Footer`, `ProgressBar`. */
import { Kpi, ProgressBar, type ProgressSegment } from "prime-ui-kit";

import styles from "./examples.module.css";

const CHANNELS: ProgressSegment[] = [
  { value: 591, label: "Сайт", color: "blue" },
  { value: 360, label: "Партнёры", color: "orange" },
  { value: 231, label: "Реклама", color: "teal" },
];

export default function KpiPartsExample() {
  return (
    <div className={styles.wide}>
      <Kpi.Root>
        <Kpi.Title>Лиды</Kpi.Title>
        <Kpi.Value>1 182</Kpi.Value>
        <Kpi.Delta value={-4} tone="danger">
          −4 %
        </Kpi.Delta>
        <Kpi.Period>Октябрь</Kpi.Period>
        <Kpi.Media>
          <ProgressBar variant="ticks" segments={CHANNELS} aria-label="Лиды по каналам" />
        </Kpi.Media>
        <Kpi.Footer>
          <Kpi.Legend segments={CHANNELS} />
        </Kpi.Footer>
      </Kpi.Root>
      <Kpi.Root size="l">
        <Kpi.Title>Лиды</Kpi.Title>
        <Kpi.Description>По каналам</Kpi.Description>
        <Kpi.Value>1 182</Kpi.Value>
        <Kpi.Delta value={-4} tone="danger">
          −4 %
        </Kpi.Delta>
        <Kpi.Period>Октябрь</Kpi.Period>
        <Kpi.Meta>конверсия 27 %</Kpi.Meta>
        <Kpi.Media>
          <ProgressBar variant="ticks" segments={CHANNELS} aria-label="Лиды по каналам" />
        </Kpi.Media>
        <Kpi.Footer>
          <Kpi.Legend segments={CHANNELS} />
        </Kpi.Footer>
      </Kpi.Root>
    </div>
  );
}
