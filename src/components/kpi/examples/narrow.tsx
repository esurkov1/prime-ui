/** On a narrow card nothing wraps and nothing leaves it: the title, the line under the value and the totals are cut with an ellipsis, the value last; the slot keeps its corner — `size`. */
import { Badge, Kpi } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function KpiNarrowExample() {
  return (
    <div className={styles.phone}>
      <Kpi.Root>
        <Kpi.Title>Выручка по оплаченным счетам за период</Kpi.Title>
        <Kpi.Actions>
          <Badge.Root>Прогноз</Badge.Root>
        </Kpi.Actions>
        <Kpi.Value>
          8,7<Kpi.Unit>млн ₽</Kpi.Unit>
        </Kpi.Value>
        <Kpi.Delta value={9.6} tone="success">
          +9,6 %
        </Kpi.Delta>
        <Kpi.Period>1–22 окт</Kpi.Period>
        <Kpi.Meta>план 9,5 млн ₽ по всем регионам и каналам</Kpi.Meta>
      </Kpi.Root>
      <Kpi.Root size="xl">
        <Kpi.Title>Выручка</Kpi.Title>
        <Kpi.Description>Оплаченные счета всех филиалов</Kpi.Description>
        <Kpi.Value>
          8 704 000<Kpi.Unit>₽</Kpi.Unit>
        </Kpi.Value>
        <Kpi.Delta value={9.6} tone="success">
          +9,6 %
        </Kpi.Delta>
        <Kpi.Period>1–22 окт</Kpi.Period>
        <Kpi.Footer>
          <Kpi.Total label="Счетов">412</Kpi.Total>
          <Kpi.Total label="Средний чек">21 100 ₽</Kpi.Total>
          <Kpi.Total label="Возвраты">146 000 ₽</Kpi.Total>
        </Kpi.Footer>
      </Kpi.Root>
    </div>
  );
}
