/** A figure against its target and a figure split by stage: a bar to the plan with what is left, and the leads of the month by stage with a legend — `Kpi.Media`, `ProgressBar`. */
import { Icon, Kpi, ProgressBar, type ProgressSegment } from "prime-ui-kit";

import styles from "./examples.module.css";

const LEADS: ProgressSegment[] = [
  { value: 90, label: "Запрос", color: "blue" },
  { value: 110, label: "Переговоры", color: "orange" },
  { value: 45, label: "Сделка", color: "teal" },
];

export default function KpiProgressExample() {
  return (
    <div className={styles.wide}>
      <Kpi.Root>
        <Kpi.Icon>
          <Icon name="object.trophy" />
        </Kpi.Icon>
        <Kpi.Title>План продаж</Kpi.Title>
        <Kpi.Period>Октябрь · осталось 9 дней</Kpi.Period>
        <Kpi.Value>72%</Kpi.Value>
        <Kpi.Delta tone="warning">отстаём на 6%</Kpi.Delta>
        <Kpi.Meta>30,2 из 42 млн ₽</Kpi.Meta>
        <Kpi.Media>
          <ProgressBar value={72} size="s" aria-label="План продаж выполнен на 72%" />
        </Kpi.Media>
      </Kpi.Root>
      <Kpi.Root>
        <Kpi.Title>Лиды</Kpi.Title>
        <Kpi.Period>Октябрь</Kpi.Period>
        <Kpi.Value>245</Kpi.Value>
        <Kpi.Delta value={8.3} tone="success">
          +8,3%
        </Kpi.Delta>
        <Kpi.Meta>к сентябрю · было 226</Kpi.Meta>
        <Kpi.Media>
          <ProgressBar segments={LEADS} segmentGap="hairline" aria-label="Лиды по стадиям" legend />
        </Kpi.Media>
      </Kpi.Root>
    </div>
  );
}
