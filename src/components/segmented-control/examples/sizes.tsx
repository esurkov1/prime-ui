import { SegmentedControl, Typography } from "prime-ui-kit";

import styles from "./segmented-examples.module.css";

/** Same segment labels across control sizes `s`–`xl` (mirrors playground/snippets/segmented/sizes). */
export default function SegmentedSizesExample() {
  return (
    <div className={styles.demoStack}>
      <div className={styles.demoRow}>
        <Typography.Root as="span" variant="body-compact" tone="muted">
          SegmentedControl s
        </Typography.Root>
        <SegmentedControl.Root defaultValue="day" size="s">
          <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
          <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <div className={styles.demoRow}>
        <Typography.Root as="span" variant="body-compact" tone="muted">
          SegmentedControl m
        </Typography.Root>
        <SegmentedControl.Root defaultValue="day" size="m">
          <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
          <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <div className={styles.demoRow}>
        <Typography.Root as="span" variant="body-compact" tone="muted">
          SegmentedControl l
        </Typography.Root>
        <SegmentedControl.Root defaultValue="day" size="l">
          <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
          <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <div className={styles.demoRow}>
        <Typography.Root as="span" variant="body-compact" tone="muted">
          SegmentedControl xl
        </Typography.Root>
        <SegmentedControl.Root defaultValue="day" size="xl">
          <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
          <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
    </div>
  );
}
