import { Tabs, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Settings-style layout: vertical tab rail beside the active panel (narrow viewports can switch to
 * horizontal or Accordion; see layout recipes in the kit skill).
 */
export default function TabsExampleSettingsVerticalRail() {
  return (
    <Tabs.Root defaultValue="profile" orientation="vertical" className={styles.settingsRow}>
      <Tabs.List>
        <Tabs.Tab value="profile">
          <Tabs.Label>Profile</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="security">
          <Tabs.Label>Security</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="billing">
          <Tabs.Label>Billing</Tabs.Label>
        </Tabs.Tab>
      </Tabs.List>
      <div className={styles.settingsContent}>
        <Tabs.Panel value="profile">
          <div className={styles.stack}>
            <Typography.Root as="p" variant="body-default" className={styles.body}>
              Update your display name, avatar, and how your profile appears to teammates.
            </Typography.Root>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="security">
          <Typography.Root as="p" variant="body-default" className={styles.body}>
            Passwords, two-factor authentication, and active sessions for this workspace.
          </Typography.Root>
        </Tabs.Panel>
        <Tabs.Panel value="billing">
          <Typography.Root as="p" variant="body-default" className={styles.body}>
            Plans, invoices, and payment methods. Changes apply at the start of the next cycle.
          </Typography.Root>
        </Tabs.Panel>
      </div>
    </Tabs.Root>
  );
}
