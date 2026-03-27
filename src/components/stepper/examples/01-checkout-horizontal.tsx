import { Stepper } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/**
 * Checkout: horizontal ordered list with chevron separators; steps jump when clicked.
 */
export default function StepperExampleCheckoutHorizontal() {
  const [step, setStep] = React.useState(1);

  return (
    <div className={styles.stack}>
      <Stepper.Root orientation="horizontal" currentStep={step} className={styles.rail}>
        <Stepper.Step type="button" onClick={() => setStep(0)}>
          <Stepper.Indicator />
          <Stepper.Content title="Cart" description="Review items" />
        </Stepper.Step>
        <Stepper.SeparatorIcon />
        <Stepper.Step type="button" onClick={() => setStep(1)}>
          <Stepper.Indicator />
          <Stepper.Content title="Shipping" description="Address & delivery" />
        </Stepper.Step>
        <Stepper.SeparatorIcon />
        <Stepper.Step type="button" onClick={() => setStep(2)}>
          <Stepper.Indicator />
          <Stepper.Content title="Payment" description="Card or wallet" />
        </Stepper.Step>
      </Stepper.Root>
    </div>
  );
}
