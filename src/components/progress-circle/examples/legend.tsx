/** A ring of category shares with a legend beside it, in the categories' chart colors — `color`, `legend`, `formatValue`. */
import { Card, ProgressCircle, type ProgressSegment } from "prime-ui-kit";

import styles from "./examples.module.css";

const TRAFFIC: ProgressSegment[] = [
  { value: 18_420, label: "Поиск", color: "blue" },
  { value: 9_310, label: "Реклама", color: "orange" },
  { value: 6_050, label: "Соцсети", color: "pink" },
  { value: 2_870, label: "Рассылки", color: "purple" },
  { value: 1_240, label: "Прочее", color: "gray" },
];

const formatVisits = (value: number) => value.toLocaleString("ru-RU");

export default function ProgressCircleLegendExample() {
  return (
    <Card.Root className={styles.card}>
      <Card.Body>
        <ProgressCircle
          size="xl"
          segments={TRAFFIC}
          segmentGap="hairline"
          legend
          formatValue={formatVisits}
          aria-label="Визиты по каналам"
        >
          37,9 тыс.
        </ProgressCircle>
      </Card.Body>
    </Card.Root>
  );
}
