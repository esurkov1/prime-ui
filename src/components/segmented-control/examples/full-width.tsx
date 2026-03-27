import { SegmentedControl } from "prime-ui-kit";

import styles from "./segmented-examples.module.css";

/** Override root `width: fit-content` with a full-width class in a narrow shelf (mirrors playground/snippets/segmented/full-width). */
export default function SegmentedFullWidthExample() {
  return (
    <div className={styles.fullWidthShelf}>
      <SegmentedControl.Root defaultValue="day" size="m" className={styles.fullWidthRoot}>
        <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
        <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
        <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
      </SegmentedControl.Root>
    </div>
  );
}
