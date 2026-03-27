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
        <SegmentedControl.Root defaultValue="light" size="m">
          <SegmentedControl.Item value="light">
            <SegmentedControl.Icon>
              <Icon name="theme.light" size="m" />
            </SegmentedControl.Icon>
            Light
          </SegmentedControl.Item>
          <SegmentedControl.Item value="dark">
            <SegmentedControl.Icon>
              <Icon name="theme.dark" size="m" />
            </SegmentedControl.Icon>
            Dark
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <div className={styles.demoRow}>
        <Typography.Root as="span" variant="body-compact" tone="muted">
          Icon-only + visually hidden text
        </Typography.Root>
        <SegmentedControl.Root defaultValue="grid" size="m">
          <SegmentedControl.Item value="feed">
            <SegmentedControl.Icon>
              <Icon name="nav.home" size="m" />
            </SegmentedControl.Icon>
            <span className={styles.visuallyHidden}>Feed</span>
          </SegmentedControl.Item>
          <SegmentedControl.Item value="grid">
            <SegmentedControl.Icon>
              <Icon name="nav.layoutGrid" size="m" />
            </SegmentedControl.Icon>
            <span className={styles.visuallyHidden}>Grid</span>
          </SegmentedControl.Item>
          <SegmentedControl.Item value="compact">
            <SegmentedControl.Icon>
              <Icon name="theme.light" size="m" />
            </SegmentedControl.Icon>
            <span className={styles.visuallyHidden}>Compact</span>
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
    </div>
  );
}
