/** A ring of ticks: the plan's share in the centre, and channel shares beside a legend — `variant`, `segments`, `legend`. */
import { Card, ProgressCircle, type ProgressSegment } from "prime-ui-kit";

import styles from "./examples.module.css";

const LEADS: ProgressSegment[] = [
  { value: 52, label: "Сайт", color: "blue" },
  { value: 32, label: "Email-рассылки", color: "purple" },
  { value: 24, label: "Партнёры", color: "teal" },
  { value: 18, label: "Рекомендации", color: "orange" },
];

export default function ProgressCircleTicksExample() {
  return (
    <Card.Root className={styles.card}>
      <Card.Body>
        <ProgressCircle size="xl" variant="ticks" value={68} aria-label="План продаж за октябрь">
          68%
        </ProgressCircle>
        <ProgressCircle
          size="xl"
          variant="ticks"
          segments={LEADS}
          legend
          aria-label="Лиды по каналам"
        >
          126
        </ProgressCircle>
      </Card.Body>
    </Card.Root>
  );
}
