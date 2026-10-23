/** The unit after the figure, smaller and quieter: rubles, percent, hours, a figure without a unit; S and M write a large sum short — `Kpi.Unit`. */
import { Kpi } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function KpiUnitsExample() {
  return (
    <div className={styles.row}>
      <Kpi.Root>
        <Kpi.Title>Выручка</Kpi.Title>
        <Kpi.Value>
          8,7<Kpi.Unit>млн ₽</Kpi.Unit>
        </Kpi.Value>
        <Kpi.Period>1–22 окт</Kpi.Period>
      </Kpi.Root>
      <Kpi.Root>
        <Kpi.Title>Конверсия в оплату</Kpi.Title>
        <Kpi.Value>
          27<Kpi.Unit>%</Kpi.Unit>
        </Kpi.Value>
        <Kpi.Period>Октябрь</Kpi.Period>
      </Kpi.Root>
      <Kpi.Root>
        <Kpi.Title>Первый ответ</Kpi.Title>
        <Kpi.Value>
          3,4<Kpi.Unit>ч</Kpi.Unit>
        </Kpi.Value>
        <Kpi.Period>Сегодня</Kpi.Period>
      </Kpi.Root>
      <Kpi.Root>
        <Kpi.Title>Заказы</Kpi.Title>
        <Kpi.Value>1 204</Kpi.Value>
        <Kpi.Period>1–22 окт</Kpi.Period>
      </Kpi.Root>
    </div>
  );
}
