import { Stepper } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Checkout with a prior step flagged `error` while a later step stays active (e.g. fix shipping
 * from the payment screen).
 */
export default function StepperExampleCheckoutStepError() {
  return (
    <div className={styles.stack}>
      <Stepper.Root orientation="horizontal" currentStep={2} size="m" className={styles.rail}>
        <Stepper.Step type="button">
          <Stepper.Indicator />
          <Stepper.Content title="Cart" />
        </Stepper.Step>
        <Stepper.SeparatorIcon />
        <Stepper.Step type="button" status="error">
          <Stepper.Indicator />
          <Stepper.Content title="Shipping" description="Address could not be verified" />
        </Stepper.Step>
        <Stepper.SeparatorIcon />
        <Stepper.Step type="button">
          <Stepper.Indicator />
          <Stepper.Content title="Payment" />
        </Stepper.Step>
      </Stepper.Root>
    </div>
  );
}
