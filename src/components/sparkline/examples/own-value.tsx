/** Unique clients in dialogs: the period's own count is neither the sum nor the mean of the days, so the card passes it with the previous period's count — `value`, `compareTo`. */
import { Kpi, Sparkline, type SparklinePoint, useSparkline } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Clients who wrote each day, 2 — 15 October 2026; one client writes on many days. */
const CLIENTS_BY_DAY: SparklinePoint[] = [
  { label: "2 окт", value: 184 },
  { label: "3 окт", value: 201 },
  { label: "4 окт", value: 146 },
  { label: "5 окт", value: 132 },
  { label: "6 окт", value: 218 },
  { label: "7 окт", value: 226 },
  { label: "8 окт", value: 209 },
  { label: "9 окт", value: 231 },
  { label: "10 окт", value: 240 },
  { label: "11 окт", value: 158 },
  { label: "12 окт", value: 141 },
  { label: "13 окт", value: 237 },
  { label: "14 окт", value: 252 },
  { label: "15 окт", value: 244 },
];

/** Unique clients over the period and over the 14 days before. */
const UNIQUE_CLIENTS = 1_386;
const PREVIOUS_UNIQUE_CLIENTS = 1_270;

export default function SparklineOwnValueExample() {
  const clients = useSparkline({
    data: CLIENTS_BY_DAY,
    value: UNIQUE_CLIENTS,
    compareTo: PREVIOUS_UNIQUE_CLIENTS,
  });

  return (
    <Kpi.Root className={styles.card}>
      <Kpi.Title>Клиенты в диалогах</Kpi.Title>
      <Kpi.Value>{clients.valueText}</Kpi.Value>
      <Kpi.Delta reading={clients} />
      <Kpi.Period>{clients.date}</Kpi.Period>
      <Kpi.Media>
        <Sparkline {...clients.plot} label="Клиенты по дням" />
      </Kpi.Media>
    </Kpi.Root>
  );
}
