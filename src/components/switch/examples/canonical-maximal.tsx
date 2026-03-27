import { Switch } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Full composition: label column, hint under the text, default size `m`.
 */
export default function SwitchCanonicalMaximal() {
  return (
    <div className={styles.stackDense}>
      <Switch.Root defaultChecked name="product_updates">
        <Switch.Label>Product updates</Switch.Label>
        <Switch.Hint>
          At most one email per week. You can change this anytime in notification settings.
        </Switch.Hint>
      </Switch.Root>
    </div>
  );
}
