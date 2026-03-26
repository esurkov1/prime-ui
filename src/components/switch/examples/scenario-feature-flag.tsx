import { Switch } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/**
 * Controlled feature flag: parent owns state; hint explains rollout scope.
 */
export default function SwitchScenarioFeatureFlag() {
  const [enabled, setEnabled] = React.useState(true);

  return (
    <div className={styles.stackDense}>
      <Switch.Root
        size="m"
        checked={enabled}
        onCheckedChange={setEnabled}
        name="flag_new_dashboard"
      >
        <Switch.Label>New dashboard experience</Switch.Label>
        <Switch.Hint>
          Applies to this workspace only. Users may need to refresh after toggling.
        </Switch.Hint>
      </Switch.Root>
      <p className={styles.muted} aria-live="polite">
        Flag is <strong>{enabled ? "on" : "off"}</strong> for members on the next session.
      </p>
    </div>
  );
}
