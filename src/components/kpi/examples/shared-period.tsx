/** One period for the whole row: the switch above the cards sets it once, the cards drop their own period line, and a state keeps its moment — `Kpi.Period`. */
import { Kpi, SegmentedControl } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Period = "week" | "month" | "quarter";

const ROWS: Record<
  Period,
  {
    compare: string;
    revenue: string;
    revenueChange: number;
    clients: string;
    clientsChange: number;
  }
> = {
  week: {
    compare: "к прошлой неделе",
    revenue: "2,1 млн ₽",
    revenueChange: 6,
    clients: "9",
    clientsChange: 2,
  },
  month: {
    compare: "к сентябрю",
    revenue: "8,4 млн ₽",
    revenueChange: 12,
    clients: "38",
    clientsChange: 6,
  },
  quarter: {
    compare: "ко II кварталу",
    revenue: "24,6 млн ₽",
    revenueChange: 21,
    clients: "104",
    clientsChange: 17,
  },
};

export default function KpiSharedPeriodExample() {
  const [period, setPeriod] = React.useState<Period>("month");
  const row = ROWS[period];

  return (
    <div className={styles.stack}>
      <SegmentedControl.Root
        value={period}
        onValueChange={(value) => setPeriod(value as Period)}
        aria-label="Период"
      >
        <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
        <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
        <SegmentedControl.Item value="quarter">Квартал</SegmentedControl.Item>
      </SegmentedControl.Root>
      <div className={styles.grid}>
        <Kpi.Root>
          <Kpi.Title>Выручка</Kpi.Title>
          <Kpi.Description>Оплаченные счета</Kpi.Description>
          <Kpi.Value>{row.revenue}</Kpi.Value>
          <Kpi.Delta value={row.revenueChange} tone="success">
            {`+${row.revenueChange}%`}
          </Kpi.Delta>
          <Kpi.Meta>{row.compare}</Kpi.Meta>
        </Kpi.Root>
        <Kpi.Root>
          <Kpi.Title>Новые клиенты</Kpi.Title>
          <Kpi.Description>Первый оплаченный счёт</Kpi.Description>
          <Kpi.Value>{row.clients}</Kpi.Value>
          <Kpi.Delta value={row.clientsChange} tone="success">
            {`+${row.clientsChange}`}
          </Kpi.Delta>
          <Kpi.Meta>{row.compare}</Kpi.Meta>
        </Kpi.Root>
        <Kpi.Root>
          <Kpi.Title>Просрочено</Kpi.Title>
          <Kpi.Period>на 22 окт</Kpi.Period>
          <Kpi.Value>1,2 млн ₽</Kpi.Value>
          <Kpi.Delta value={180} tone="danger">
            +180 тыс. ₽
          </Kpi.Delta>
          <Kpi.Meta>за неделю</Kpi.Meta>
        </Kpi.Root>
      </div>
    </div>
  );
}
