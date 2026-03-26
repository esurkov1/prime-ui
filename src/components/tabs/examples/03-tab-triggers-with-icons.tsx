import { Icon, Tabs, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Icon + label in each trigger; keep a visible `Tabs.Label` (or equivalent text) so the tab name is
 * not only conveyed by the glyph.
 */
export default function TabsExampleTriggersWithIcons() {
  return (
    <Tabs.Root defaultValue="inbox">
      <Tabs.List>
        <Tabs.Tab value="inbox">
          <Tabs.Icon>
            <Icon name="field.email" tone="subtle" />
          </Tabs.Icon>
          <Tabs.Label>Inbox</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="library">
          <Tabs.Icon>
            <Icon name="nav.layoutGrid" tone="subtle" />
          </Tabs.Icon>
          <Tabs.Label>Library</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="vault">
          <Tabs.Icon>
            <Icon name="status.locked" tone="subtle" />
          </Tabs.Icon>
          <Tabs.Label>Vault</Tabs.Label>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="inbox">
        <Typography.Root as="p" variant="body-default" className={styles.body}>
          Messages and mentions for the signed-in user.
        </Typography.Root>
      </Tabs.Panel>
      <Tabs.Panel value="library">
        <Typography.Root as="p" variant="body-default" className={styles.body}>
          Collections and grids of assets linked to this project.
        </Typography.Root>
      </Tabs.Panel>
      <Tabs.Panel value="vault">
        <Typography.Root as="p" variant="body-default" className={styles.body}>
          Restricted credentials and secrets with stricter access rules.
        </Typography.Root>
      </Tabs.Panel>
    </Tabs.Root>
  );
}
