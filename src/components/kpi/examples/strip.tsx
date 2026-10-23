/** A strip of small cards over a table: the title and the period on one line, the value with its change under them; nothing else on S — `size`. */
import { Kpi } from "prime-ui-kit";

import styles from "./examples.module.css";

const FIGURES = [
  { title: "Выручка", value: "8,7", unit: "млн ₽", change: 9.6, delta: "+9,6 %", tone: "success" },
  { title: "Заказы", value: "204", unit: "", change: 2, delta: "+2 %", tone: "success" },
  { title: "Средний чек", value: "42 700", unit: "₽", change: 0, delta: "0 %", tone: "neutral" },
  { title: "Отток", value: "3,1", unit: "%", change: 0.6, delta: "+0,6 п. п.", tone: "danger" },
  { title: "Возвраты", value: "146", unit: "тыс. ₽", change: -12, delta: "−12 %", tone: "success" },
  { title: "Новые клиенты", value: "38", unit: "", change: 6, delta: "+6", tone: "success" },
] as const;

export default function KpiStripExample() {
  return (
    <div className={styles.strip}>
      {FIGURES.map((figure) => (
        <Kpi.Root key={figure.title} size="s">
          <Kpi.Title>{figure.title}</Kpi.Title>
          <Kpi.Period>1–22 окт</Kpi.Period>
          <Kpi.Value>
            {figure.value}
            {figure.unit ? <Kpi.Unit>{figure.unit}</Kpi.Unit> : null}
          </Kpi.Value>
          <Kpi.Delta value={figure.change} tone={figure.tone}>
            {figure.delta}
          </Kpi.Delta>
        </Kpi.Root>
      ))}
    </div>
  );
}
