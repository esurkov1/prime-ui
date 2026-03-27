import { Icon, SegmentedControl, Typography } from "prime-ui-kit";

import styles from "./segmented-examples.module.css";

/** Icon + text and icon-only segments with visually hidden labels (mirrors playground/snippets/segmented/composition). */
export default function SegmentedCompositionExample() {
  return (
    <div className={styles.demoStack}>
      <div className={styles.demoRow}>
        <Typography.Root as="span" variant="body-compact" tone="muted">
          Icon and label
        </Typography.Root>
        <SegmentedControl.Root defaultValue="light">
          <SegmentedControl.Item value="light">
            <SegmentedControl.Icon>
              <Icon surface="none" name="theme.light" />
            </SegmentedControl.Icon>
            Light
          </SegmentedControl.Item>
          <SegmentedControl.Item value="dark">
            <SegmentedControl.Icon>
              <Icon surface="none" name="theme.dark" />
            </SegmentedControl.Icon>
            Dark
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <div className={styles.demoRow}>
        <Typography.Root as="span" variant="body-compact" tone="muted">
          Icon-only + visually hidden text
        </Typography.Root>
        <SegmentedControl.Root defaultValue="grid">
          <SegmentedControl.Item value="feed">
            <SegmentedControl.Icon>
              <Icon surface="none" name="nav.home" />
            </SegmentedControl.Icon>
            <span className={styles.visuallyHidden}>Feed</span>
          </SegmentedControl.Item>
          <SegmentedControl.Item value="grid">
            <SegmentedControl.Icon>
              <Icon surface="none" name="nav.layoutGrid" />
            </SegmentedControl.Icon>
            <span className={styles.visuallyHidden}>Grid</span>
          </SegmentedControl.Item>
          <SegmentedControl.Item value="compact">
            <SegmentedControl.Icon>
              <Icon surface="none" name="theme.light" />
            </SegmentedControl.Icon>
            <span className={styles.visuallyHidden}>Compact</span>
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
    </div>
  );
}
