/** The change by meaning, not by sign: churn up is danger with the arrow up, costs down is success with the arrow down, zero is neutral with no arrow, nothing to compare with — no badge — `Kpi.Delta`, `tone`. */
import { Kpi } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function KpiToneExample() {
  return (
    <div className={styles.row}>
      <Kpi.Root>
        <Kpi.Title>Отток</Kpi.Title>
        <Kpi.Value>
          3,1<Kpi.Unit>%</Kpi.Unit>
        </Kpi.Value>
        <Kpi.Delta value={0.6} tone="danger">
          +0,6 п. п.
        </Kpi.Delta>
        <Kpi.Period>Октябрь</Kpi.Period>
      </Kpi.Root>
      <Kpi.Root>
        <Kpi.Title>Расходы</Kpi.Title>
        <Kpi.Value>
          1,84<Kpi.Unit>млн ₽</Kpi.Unit>
        </Kpi.Value>
        <Kpi.Delta value={-4} tone="success">
          −4 %
        </Kpi.Delta>
        <Kpi.Period>Октябрь</Kpi.Period>
      </Kpi.Root>
      <Kpi.Root>
        <Kpi.Title>Средний чек</Kpi.Title>
        <Kpi.Value>
          42 700<Kpi.Unit>₽</Kpi.Unit>
        </Kpi.Value>
        <Kpi.Delta value={0}>0 %</Kpi.Delta>
        <Kpi.Period>Октябрь</Kpi.Period>
      </Kpi.Root>
      <Kpi.Root>
        <Kpi.Title>Новые клиенты</Kpi.Title>
        <Kpi.Value>38</Kpi.Value>
        <Kpi.Period>Первый месяц</Kpi.Period>
      </Kpi.Root>
    </div>
  );
}
