/** Deals narrowed by an amount from–to and a period from a calendar with presets, two months and an Apply footer; each range is one readable chip, and the bounds go to the server as from / to parameters — `kind`, `formatValue`, `calendar`, `matchesSmartFilter`, `isSmartFilterRange`. */
import {
  Card,
  DEFAULT_DATEPICKER_PRESETS,
  formatDateValue,
  isSmartFilterRange,
  List,
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
  {
    key: "closed",
    label: "Период",
    kind: "date-range",
    calendar: { presets: DEFAULT_DATEPICKER_PRESETS, months: 2, prompt: true, footer: true },
  },
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

const asParam = (bound: number | Date) =>
  bound instanceof Date ? formatDateValue(bound) : String(bound);

/** The query a server gets: a range becomes `key_from` / `key_to`, a selection its included values. */
function toQuery(value: SmartFilterValue) {
  const params = new URLSearchParams();
  for (const [key, entry] of Object.entries(value)) {
    if (isSmartFilterRange(entry)) {
      if (entry.from !== null) params.set(`${key}_from`, asParam(entry.from));
      if (entry.to !== null) params.set(`${key}_to`, asParam(entry.to));
    } else if (entry.include.length > 0) {
      params.set(key, entry.include.join(","));
    }
  }
  return params.toString();
}

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
      <Card.Root>
        <Card.Header>
          <Card.Title>Сделки</Card.Title>
          <Card.Description>
            {rows.length} из {DEALS.length}
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <List.Root aria-label="Сделки">
            {rows.map((deal) => (
              <List.Item key={deal.id}>
                <List.ItemText>{deal.client}</List.ItemText>
                <List.ItemMeta>{formatRubles(deal.amount)}</List.ItemMeta>
              </List.Item>
            ))}
          </List.Root>
        </Card.Body>
      </Card.Root>
      <Typography as="span" variant="code" tone="secondary">
        {`GET /deals?${toQuery(value)}`}
      </Typography>
    </div>
  );
}
