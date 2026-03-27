import { SegmentedControl, Typography } from "prime-ui-kit";

import styles from "./segmented-examples.module.css";

/** Default group, one disabled item, entire group disabled (mirrors playground/snippets/segmented/states). */
export default function SegmentedStatesExample() {
  return (
    <div className={styles.demoStack}>
      <div className={styles.demoRow}>
        <Typography.Root as="span" variant="body-compact" tone="muted">
          Default
        </Typography.Root>
        <SegmentedControl.Root defaultValue="day">
          <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
          <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <div className={styles.demoRow}>
        <Typography.Root as="span" variant="body-compact" tone="muted">
          One segment disabled
        </Typography.Root>
        <SegmentedControl.Root defaultValue="active">
          <SegmentedControl.Item value="active">Active</SegmentedControl.Item>
          <SegmentedControl.Item value="paused" disabled>
            Paused
          </SegmentedControl.Item>
          <SegmentedControl.Item value="archived">Archived</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <div className={styles.demoRow}>
        <Typography.Root as="span" variant="body-compact" tone="muted">
          Entire control disabled
        </Typography.Root>
        <SegmentedControl.Root defaultValue="day" disabled>
          <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
          <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
    </div>
  );
}
