import { SegmentedControl, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./segmented-examples.module.css";

/** Controlled selection with `value` and `onValueChange` (mirrors playground/snippets/segmented/controlled). */
export default function SegmentedControlledExample() {
  const [controlled, setControlled] = React.useState("week");

  return (
    <div className={styles.demoStack}>
      <SegmentedControl.Root value={controlled} onValueChange={setControlled}>
        <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
        <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
        <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
      </SegmentedControl.Root>
      <Typography.Root as="p" variant="body-compact" tone="muted" className={styles.demoCaption}>
        Selected: <strong>{controlled}</strong> — state is held in React (<code>value</code> +{" "}
        <code>onValueChange</code>).
      </Typography.Root>
    </div>
  );
}
