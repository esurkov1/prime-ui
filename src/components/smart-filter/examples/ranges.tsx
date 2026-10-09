/** Deals narrowed by an amount from–to and a period from the calendar; each range is one readable chip — `kind`, `formatValue`, `matchesSmartFilter`. */
import {
  matchesSmartFilter,
  SmartFilter,
  type SmartFilterField,
  type SmartFilterValue,
  Typography,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const formatRubles = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;

const FIELDS: SmartFilterField[] = [
  { key: "amount", label: "Сумма", kind: "range", formatValue: formatRubles },
  { key: "closed", label: "Период", kind: "date-range" },
  {
    key: "stage",
    label: "Этап",
    options: [
      { value: "proposal", label: "Предложение" },
      { value: "contract", label: "Договор" },
      { value: "won", label: "Выиграна" },
    ],
  },
];

const DEALS = [
  {
    id: "d-118",
    client: "ООО «Гранит»",
    amount: 94_750,
    closed: new Date(2026, 2, 3),
    stage: "won",
  },
  {
    id: "d-121",
    client: "АО «Альфа Медиа»",
    amount: 380_000,
    closed: new Date(2026, 2, 12),
    stage: "contract",
  },
  {
    id: "d-124",
    client: "ИП Орлов Д. С.",
    amount: 18_000,
    closed: new Date(2026, 2, 20),
    stage: "proposal",
  },
  {
    id: "d-130",
    client: "ООО «Север»",
    amount: 1_250_000,
    closed: new Date(2026, 3, 2),
    stage: "won",
  },
];

const INITIAL: SmartFilterValue = { amount: { from: 50_000, to: 500_000 } };

export default function SmartFilterRangesExample() {
  const [value, setValue] = React.useState<SmartFilterValue>(INITIAL);
  const rows = DEALS.filter(
    (deal) =>
      matchesSmartFilter(value.amount, deal.amount) &&
      matchesSmartFilter(value.closed, deal.closed) &&
      matchesSmartFilter(value.stage, deal.stage),
  );

  return (
    <div className={styles.stack}>
      <SmartFilter.Root fields={FIELDS} value={value} onValueChange={setValue}>
        <SmartFilter.Toolbar />
        <SmartFilter.Chips />
      </SmartFilter.Root>
      {rows.map((deal) => (
        <div key={deal.id} className={styles.request}>
          <Typography as="span" variant="body-m" truncate className={styles.route}>
            {deal.client}
          </Typography>
          <Typography as="span" variant="body-m" tone="secondary">
            {formatRubles(deal.amount)}
          </Typography>
        </div>
      ))}
    </div>
  );
}
