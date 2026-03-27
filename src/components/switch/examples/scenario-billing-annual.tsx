import { Switch, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/**
 * Billing: annual plan as a single on/off switch with savings context.
 */
export default function SwitchScenarioBillingAnnual() {
  const [annual, setAnnual] = React.useState(false);

  return (
    <div className={styles.stack}>
      <Typography.Root as="p" variant="body-default" className={styles.muted}>
        Choose how you are billed. Annual includes two months free on the Pro plan.
      </Typography.Root>
      <Switch.Root checked={annual} onCheckedChange={setAnnual} name="billing_cycle">
        <Switch.Label>Bill annually</Switch.Label>
        <Switch.Hint>
          {annual
            ? "You will be charged once per year at the discounted rate."
            : "Switch on to save compared to twelve monthly charges."}
        </Switch.Hint>
      </Switch.Root>
    </div>
  );
}
