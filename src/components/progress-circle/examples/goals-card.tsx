/** Quarter goals in a card: an `m` ring with the percentage inside and a caption next to it. Use it for compact KPI tiles. */
import { ProgressCircle, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const goals = [
  { title: "Выручка", value: 84, note: "₽ 4,2 из 5 млн", tone: "accent" },
  { title: "Новые клиенты", value: 100, note: "312 из 300", tone: "success" },
  { title: "Обращения", value: 61, note: "SLA 61% в срок", tone: "warning" },
] as const;

export default function ProgressCircleGoalsCardExample() {
  return (
    <div className={styles.card}>
      <Typography.Root as="h3" variant="title-s">
        Цели на IV квартал
      </Typography.Root>
      <div className={styles.goals}>
        {goals.map((g) => (
          <div key={g.title} className={styles.goal}>
            <ProgressCircle.Root value={g.value} tone={g.tone} label={g.title}>
              {`${g.value}%`}
            </ProgressCircle.Root>
            <span className={styles.goalText}>
              <Typography.Root as="span" variant="body-s">
                {g.title}
              </Typography.Root>
              <Typography.Root as="span" variant="caption" tone="muted" className={styles.meta}>
                {g.note}
              </Typography.Root>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
