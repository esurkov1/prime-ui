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

      <SegmentedControl.Root value={period} onValueChange={setPeriod} size="m">
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
        </SegmentedControl.Root>
      </div>
    </div>
  );
}
