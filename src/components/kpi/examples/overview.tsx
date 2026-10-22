/** A row of KPI cards: the title over what the figure counts and its period, the value, and the change with what it compares under it — `Kpi.Title`, `Kpi.Period`, `Kpi.Value`, `Kpi.Delta`, `Kpi.Meta`. */
import { Kpi } from "prime-ui-kit";

import styles from "./examples.module.css";

const KPIS = [
  {
    title: "Выручка",
    description: "Оплаченные счета",
    period: "1–31 окт",
    value: "4,2 млн ₽",
    change: 18,
    delta: "+18%",
    tone: "success",
    meta: "к сентябрю · 3,56 млн ₽",
  },
  {
    title: "Новые клиенты",
    description: "Первый оплаченный счёт",
    period: "Октябрь",
    value: "38",
    change: 6,
    delta: "+6",
    tone: "success",
    meta: "к сентябрю · из них 12 по рекомендации",
  },
  {
    title: "Просрочено",
    description: "9 счетов",
    period: "на 22 окт, 09:40",
    value: "1,2 млн ₽",
    change: 180,
    delta: "+180 тыс. ₽",
    tone: "danger",
    meta: "за неделю",
  },
] as const;

export default function KpiOverviewExample() {
  return (
    <div className={styles.grid}>
      {KPIS.map((kpi) => (
        <Kpi.Root key={kpi.title}>
          <Kpi.Title>{kpi.title}</Kpi.Title>
          <Kpi.Description>{kpi.description}</Kpi.Description>
          <Kpi.Period>{kpi.period}</Kpi.Period>
          <Kpi.Value>{kpi.value}</Kpi.Value>
          <Kpi.Delta value={kpi.change} tone={kpi.tone}>
            {kpi.delta}
          </Kpi.Delta>
          <Kpi.Meta>{kpi.meta}</Kpi.Meta>
        </Kpi.Root>
      ))}
    </div>
  );
}
