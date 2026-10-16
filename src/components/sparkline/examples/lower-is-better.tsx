/** First response time by day, where a fall is good: growth paints the change red, a fall green — `better`, `summary`, `compareTo`. */
import { Card, Sparkline, type SparklinePoint } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Mean first response by day, minutes, 2 — 15 October 2026. */
const RESPONSE: SparklinePoint[] = [
  { label: "2 окт", value: 4.2 },
  { label: "3 окт", value: 3.8 },
  { label: "4 окт", value: 4.6 },
  { label: "5 окт", value: 5.1 },
  { label: "6 окт", value: 4.4 },
  { label: "7 окт", value: 3.9 },
  { label: "8 окт", value: 3.6 },
  { label: "9 окт", value: 4.8 },
  { label: "10 окт", value: 5.6 },
  { label: "11 окт", value: 5.2 },
  { label: "12 окт", value: 4.9 },
  { label: "13 окт", value: 5.4 },
  { label: "14 окт", value: 5.8 },
  { label: "15 окт", value: 5.5 },
];

/** The mean of the 14 days before, minutes. */
const PREVIOUS_AVERAGE = 4.1;

const MINUTES = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });

const formatMinutes = (value: number) => `${MINUTES.format(value)} мин`;

export default function SparklineLowerIsBetterExample() {
  return (
    <Card.Root className={styles.card}>
      <Card.Body>
        <Sparkline
          data={RESPONSE}
          label="Время первого ответа"
          summary="average"
          compareTo={PREVIOUS_AVERAGE}
          better="lower"
          formatValue={formatMinutes}
        />
      </Card.Body>
    </Card.Root>
  );
}
