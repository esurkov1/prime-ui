import { Radio } from "prime-ui-kit";

import styles from "./radio-examples.module.css";

/** Product alerts: mutually exclusive delivery channel (not multi-select — use Checkbox for that). */
export default function NotificationChannelExample() {
  return (
    <fieldset className={styles.fieldsetPlain}>
      <legend className={styles.legend}>Security alerts</legend>
      <p className={styles.helperBelowLegend}>
        Choose one primary channel for account and login notices.
      </p>
      <div className={styles.columnTight}>
        <Radio.Root name="security-alert-example" value="email" defaultChecked>
          <Radio.Label>Email</Radio.Label>
          <Radio.Hint>Sent to your verified address immediately.</Radio.Hint>
        </Radio.Root>
        <Radio.Root name="security-alert-example" value="sms">
          <Radio.Label>SMS</Radio.Label>
          <Radio.Hint>Requires a phone number on file.</Radio.Hint>
        </Radio.Root>
        <Radio.Root name="security-alert-example" value="app">
          <Radio.Label>Mobile app only</Radio.Label>
          <Radio.Hint>No email or SMS; push when the app is installed.</Radio.Hint>
        </Radio.Root>
      </div>
    </fieldset>
  );
}
