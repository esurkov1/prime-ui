/** On a narrow card the title and the line under it cut, the actions keep their corner, and a group stacks its figures below 22rem — `Kpi.Actions`, `Kpi.Group`. */
import { Button, Icon, Kpi } from "prime-ui-kit";

import styles from "./examples.module.css";

const WIDTHS = [
  { id: "narrow", className: styles.w18 },
  { id: "wide", className: styles.w40 },
];

export default function KpiNarrowExample() {
  return (
    <div className={styles.stack}>
      {WIDTHS.map((width) => (
        <div key={width.id} className={styles.stack}>
          <div className={width.className}>
            <Kpi.Root>
              <Kpi.Icon>
                <Icon name="object.receipt" />
              </Kpi.Icon>
              <Kpi.Title>Просроченные счета</Kpi.Title>
              <Kpi.Description>9 счетов у 7 клиентов</Kpi.Description>
              <Kpi.Period>на 22 окт, 09:40</Kpi.Period>
              <Kpi.Actions>
                <Button.Root variant="soft" tone="neutral" size="s">
                  Напомнить
                </Button.Root>
              </Kpi.Actions>
              <Kpi.Value>1,2 млн ₽</Kpi.Value>
              <Kpi.Delta value={180} tone="danger">
                +180 тыс. ₽
              </Kpi.Delta>
              <Kpi.Meta>за неделю</Kpi.Meta>
            </Kpi.Root>
          </div>
          <div className={width.className}>
            <Kpi.Group>
              <Kpi.Root>
                <Kpi.Title>Конверсия</Kpi.Title>
                <Kpi.Value>3,8%</Kpi.Value>
              </Kpi.Root>
              <Kpi.Root>
                <Kpi.Title>Средний чек</Kpi.Title>
                <Kpi.Value>2 450 ₽</Kpi.Value>
              </Kpi.Root>
            </Kpi.Group>
          </div>
        </div>
      ))}
    </div>
  );
}
