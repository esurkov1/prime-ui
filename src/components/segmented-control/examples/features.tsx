import { SegmentedControl, Typography } from "prime-ui-kit";

import styles from "./segmented-examples.module.css";

/** Two, three, and four segments; arrow keys on the focused radiogroup (mirrors playground/snippets/segmented/features). */
export default function SegmentedFeaturesExample() {
  return (
    <div className={styles.demoStack}>
      <div className={styles.demoRow}>
        <Typography.Root as="span" variant="body-compact" tone="muted">
          Two segments
        </Typography.Root>
        <SegmentedControl.Root defaultValue="all" size="m">
          <SegmentedControl.Item value="all">All tasks</SegmentedControl.Item>
          <SegmentedControl.Item value="mine">Mine</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <div className={styles.demoRow}>
        <Typography.Root as="span" variant="body-compact" tone="muted">
          Three segments
        </Typography.Root>
        <SegmentedControl.Root defaultValue="day" size="m">
          <SegmentedControl.Item value="day">Today</SegmentedControl.Item>
          <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <div className={styles.demoRow}>
        <Typography.Root as="span" variant="body-compact" tone="muted">
          Four segments
        </Typography.Root>
        <SegmentedControl.Root defaultValue="q1" size="m">
          <SegmentedControl.Item value="q1">Q1</SegmentedControl.Item>
          <SegmentedControl.Item value="q2">Q2</SegmentedControl.Item>
          <SegmentedControl.Item value="q3">Q3</SegmentedControl.Item>
          <SegmentedControl.Item value="q4">Q4</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <Typography.Root as="p" variant="body-compact" tone="muted" className={styles.demoCaption}>
        With focus on the <code>radiogroup</code>, ArrowLeft / ArrowRight move selection (disabled
        items are skipped).
      </Typography.Root>
    </div>
  );
}
