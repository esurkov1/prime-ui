/** The line under the value: the period, then the note after a dot; each part is optional — a page with one shared period leaves the period out — `Kpi.Period`, `Kpi.Meta`. */
import { Kpi } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function KpiLineExample() {
  return (
    <div className={styles.row}>
      <Kpi.Root>
        <Kpi.Title>Первый ответ</Kpi.Title>
        <Kpi.Value>
          3,4<Kpi.Unit>ч</Kpi.Unit>
        </Kpi.Value>
        <Kpi.Delta value={40} tone="warning">
          +40 мин
        </Kpi.Delta>
        <Kpi.Period>Сегодня</Kpi.Period>
        <Kpi.Meta>SLA 4 ч</Kpi.Meta>
      </Kpi.Root>
      <Kpi.Root>
        <Kpi.Title>Заказы</Kpi.Title>
        <Kpi.Value>204</Kpi.Value>
        <Kpi.Delta value={2} tone="success">
          +2 %
        </Kpi.Delta>
        <Kpi.Period>29 сен – 22 окт</Kpi.Period>
      </Kpi.Root>
      <Kpi.Root>
        <Kpi.Title>Просрочено</Kpi.Title>
        <Kpi.Value>
          1,2<Kpi.Unit>млн ₽</Kpi.Unit>
        </Kpi.Value>
        <Kpi.Delta value={180} tone="danger">
          +180 тыс. ₽
        </Kpi.Delta>
        <Kpi.Meta>9 счетов · 4 клиента</Kpi.Meta>
      </Kpi.Root>
    </div>
  );
}
