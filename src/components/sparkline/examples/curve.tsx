/** The same month of active users as a smooth curve, straight segments and steps — `curve`. */
import { Card, Sparkline, type SparklinePoint } from "prime-ui-kit";

import styles from "./examples.module.css";

const USERS: SparklinePoint[] = [
  { label: "сен, 1 нед.", value: 1240 },
  { label: "сен, 2 нед.", value: 1380 },
  { label: "сен, 3 нед.", value: 1310 },
  { label: "сен, 4 нед.", value: 1620 },
  { label: "окт, 1 нед.", value: 1590 },
  { label: "окт, 2 нед.", value: 1840 },
];

const CURVES = [
  { curve: "smooth", title: "Плавная кривая" },
  { curve: "linear", title: "Прямые отрезки" },
  { curve: "step", title: "Ступени" },
] as const;

export default function SparklineCurveExample() {
  return (
    <>
      {CURVES.map(({ curve, title }) => (
        <Card.Root key={curve} className={styles.card}>
          <Card.Body>
            <Sparkline data={USERS} label={title} curve={curve} />
          </Card.Body>
        </Card.Root>
      ))}
    </>
  );
}
