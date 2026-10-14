/** Monthly profit with a sign: losses go below the zero line, the current month rests highlighted and any bar shows its value under the pointer or the arrows — `variant`, `highlight`. */
import { Card, Sparkline, type SparklinePoint } from "prime-ui-kit";

import styles from "./examples.module.css";

const PROFIT: SparklinePoint[] = [
  { label: "янв", value: 420_000 },
  { label: "фев", value: 310_000 },
  { label: "мар", value: -120_000 },
  { label: "апр", value: 180_000 },
  { label: "мая", value: 540_000 },
  { label: "июн", value: 610_000 },
  { label: "июл", value: -60_000 },
  { label: "авг", value: 280_000 },
  { label: "сен", value: 470_000 },
  { label: "окт", value: 390_000 },
  { label: "ноя", value: null },
  { label: "дек", value: null },
];

/** October is the current month: November and December are still empty. */
const CURRENT_MONTH = 9;

const formatRubles = (value: number) =>
  `${value < 0 ? "−" : ""}${Math.abs(value).toLocaleString("ru-RU")} ₽`;

export default function SparklineSignedBarsExample() {
  return (
    <Card.Root className={styles.card}>
      <Card.Body>
        <Sparkline
          data={PROFIT}
          label="Прибыль по месяцам, 2026"
          variant="bars"
          highlight={CURRENT_MONTH}
          formatValue={formatRubles}
        />
      </Card.Body>
    </Card.Root>
  );
}
