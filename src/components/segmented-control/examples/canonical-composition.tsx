import { Icon, SegmentedControl, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./segmented-examples.module.css";

/**
 * Canonical composition: controlled group, icon + text, and icon-only segments with visually hidden labels.
 */
export default function CanonicalCompositionExample() {
  const [period, setPeriod] = React.useState("week");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-l)",
        alignItems: "flex-start",
      }}
    >
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

      <SegmentedControl.Root value={period} onValueChange={setPeriod}>
        <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
        <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
        <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
      </SegmentedControl.Root>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--prime-sys-spacing-s)",
          alignItems: "flex-start",
        }}
      >
        <Typography.Root as="span" variant="body-compact" tone="muted">
          Layout preview
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
        </SegmentedControl.Root>
      </div>
    </div>
  );
}
