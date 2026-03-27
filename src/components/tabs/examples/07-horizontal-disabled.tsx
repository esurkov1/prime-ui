import { Tabs, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Disabled `Tabs.Tab`: not clickable, skipped in arrow-key roving; panel exists but is unreachable
 * until the tab could be enabled (matches `playground/snippets/tabs/horizontal-disabled.tsx`).
 */
export default function TabsExampleHorizontalDisabled() {
  return (
    <Tabs.Root defaultValue="overview">
      <Tabs.List>
        <Tabs.Tab value="overview">
          <Tabs.Label>Overview</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="analytics">
          <Tabs.Label>Analytics</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="reports" disabled>
          <Tabs.Label>Reports</Tabs.Label>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">
        <Typography.Root as="p" variant="body-default" className={styles.body}>
          Overview panel content.
        </Typography.Root>
      </Tabs.Panel>
      <Tabs.Panel value="analytics">
        <Typography.Root as="p" variant="body-default" className={styles.body}>
          Analytics panel content.
        </Typography.Root>
      </Tabs.Panel>
      <Tabs.Panel value="reports">
        <Typography.Root as="p" variant="body-default" className={styles.body}>
          Reports panel content (shown only if this tab becomes enabled).
        </Typography.Root>
      </Tabs.Panel>
    </Tabs.Root>
  );
}
