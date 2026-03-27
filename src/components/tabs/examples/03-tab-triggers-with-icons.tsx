import { Icon, Tabs, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Multiple `Tabs.Icon` slots per trigger (left/right of `Tabs.Label`) and two icons in one tab —
 * matches `playground/snippets/tabs/with-icons.tsx`. Keep a visible `Tabs.Label` for the accessible
 * name.
 */
export default function TabsExampleTriggersWithIcons() {
  return (
    <Tabs.Root defaultValue="overview">
      <Tabs.List>
        <Tabs.Tab value="overview">
          <Tabs.Icon>
            <Icon surface="none" name="nav.layoutGrid" tone="subtle" />
          </Tabs.Icon>
          <Tabs.Label>Overview</Tabs.Label>
          <Tabs.Icon>
            <Icon surface="none" name="nav.chevronRight" tone="subtle" />
          </Tabs.Icon>
        </Tabs.Tab>
        <Tabs.Tab value="dashboard">
          <Tabs.Icon>
            <Icon surface="none" name="nav.layoutGrid" tone="subtle" />
          </Tabs.Icon>
          <Tabs.Label>Dashboard</Tabs.Label>
          <Tabs.Icon>
            <Icon surface="none" name="nav.chevronRight" tone="subtle" />
          </Tabs.Icon>
        </Tabs.Tab>
        <Tabs.Tab value="settings">
          <Tabs.Icon>
            <Icon surface="none" name="nav.layoutGrid" tone="subtle" />
          </Tabs.Icon>
          <Tabs.Icon>
            <Icon surface="none" name="field.email" tone="subtle" />
          </Tabs.Icon>
          <Tabs.Label>Settings</Tabs.Label>
          <Tabs.Icon>
            <Icon surface="none" name="nav.chevronRight" tone="subtle" />
          </Tabs.Icon>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">
        <Typography.Root as="p" variant="body-default" className={styles.body}>
          Overview content.
        </Typography.Root>
      </Tabs.Panel>
      <Tabs.Panel value="dashboard">
        <Typography.Root as="p" variant="body-default" className={styles.body}>
          Dashboard content.
        </Typography.Root>
      </Tabs.Panel>
      <Tabs.Panel value="settings">
        <Typography.Root as="p" variant="body-default" className={styles.body}>
          Settings content.
        </Typography.Root>
      </Tabs.Panel>
    </Tabs.Root>
  );
}
