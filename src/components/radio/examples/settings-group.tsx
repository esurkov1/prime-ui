import { Radio } from "prime-ui-kit";

import styles from "./radio-examples.module.css";

/** Settings screen: `fieldset` + `legend`, theme radios, one disabled tier-gated option. */
export default function SettingsGroupExample() {
  return (
    <fieldset className={styles.fieldsetPlain}>
      <legend className={styles.legend}>Appearance</legend>
      <div className={styles.columnTight}>
        <Radio.Root name="theme-example" value="light" defaultChecked>
          <Radio.Label>Light</Radio.Label>
          <Radio.Hint>Best for bright environments.</Radio.Hint>
        </Radio.Root>
        <Radio.Root name="theme-example" value="dark">
          <Radio.Label>Dark</Radio.Label>
          <Radio.Hint>Reduced glare in low light.</Radio.Hint>
        </Radio.Root>
        <Radio.Root name="theme-example" value="system">
          <Radio.Label>Match system</Radio.Label>
          <Radio.Hint>Follows your OS light/dark schedule.</Radio.Hint>
        </Radio.Root>
        <Radio.Root name="theme-example" value="contrast" disabled>
          <Radio.Label>High contrast</Radio.Label>
          <Radio.Hint>Available on Enterprise; contact sales to enable.</Radio.Hint>
        </Radio.Root>
      </div>
    </fieldset>
  );
}
