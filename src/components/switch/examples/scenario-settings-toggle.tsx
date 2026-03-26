import { Switch } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Settings screen: independent notification toggles with short hints.
 */
export default function SwitchScenarioSettingsToggle() {
  return (
    <fieldset className={styles.settingsGroup}>
      <legend className={styles.legend}>Notification preferences</legend>
      <Switch.Root size="m" defaultChecked name="notify_email">
        <Switch.Label>Email notifications</Switch.Label>
        <Switch.Hint>Order status, receipts, and security alerts.</Switch.Hint>
      </Switch.Root>
      <Switch.Root size="m" name="notify_push">
        <Switch.Label>Push notifications</Switch.Label>
        <Switch.Hint>Mobile alerts for time-sensitive updates only.</Switch.Hint>
      </Switch.Root>
      <Switch.Root size="m" name="notify_marketing">
        <Switch.Label>Tips and offers</Switch.Label>
        <Switch.Hint>Optional product news; never required for core service.</Switch.Hint>
      </Switch.Root>
    </fieldset>
  );
}
