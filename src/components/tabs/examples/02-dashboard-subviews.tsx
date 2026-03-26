import { Tabs, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Dashboard sub-views: equal-width triggers across the card width via `flex` on each tab (no
 * dedicated `fullWidth` prop on Tabs).
 */
export default function TabsExampleDashboardSubviews() {
  return (
    <div className={styles.surface}>
      <Tabs.Root defaultValue="overview" className={styles.fullWidthRoot}>
        <Tabs.List className={styles.fullWidthList}>
          <Tabs.Tab value="overview" className={styles.flexTab}>
            <Tabs.Label>Overview</Tabs.Label>
          </Tabs.Tab>
          <Tabs.Tab value="metrics" className={styles.flexTab}>
            <Tabs.Label>Metrics</Tabs.Label>
          </Tabs.Tab>
          <Tabs.Tab value="activity" className={styles.flexTab}>
            <Tabs.Label>Activity</Tabs.Label>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">
          <Typography.Root as="p" variant="body-default" className={styles.body}>
            Snapshot cards and at-a-glance health for the current period.
          </Typography.Root>
        </Tabs.Panel>
        <Tabs.Panel value="metrics">
          <Typography.Root as="p" variant="body-default" className={styles.body}>
            Conversion, latency, and volume trends. Heavy charts belong here; inactive tabs unmount.
          </Typography.Root>
        </Tabs.Panel>
        <Tabs.Panel value="activity">
          <Typography.Root as="p" variant="body-default" className={styles.body}>
            Recent user and system events with filters applied from the toolbar above.
          </Typography.Root>
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  );
}
