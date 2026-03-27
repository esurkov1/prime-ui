import { Button, Stepper } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/** Parent-owned `currentStep` with Back / Next controls. */
export default function StepperControlledExample() {
  const [step, setStep] = React.useState(0);
  const last = 2;

  return (
    <div className={styles.stackCompact}>
      <Stepper.Root currentStep={step} className={styles.horizontalRailMd}>
        <Stepper.Step type="button" onClick={() => setStep(0)}>
          <Stepper.Indicator />
          <Stepper.Content title="Terms" description="Read the rules" />
          <Stepper.Arrow />
        </Stepper.Step>
        <Stepper.Step type="button" onClick={() => setStep(1)}>
          <Stepper.Indicator />
          <Stepper.Content title="Details" description="Contact fields" />
          <Stepper.Arrow />
        </Stepper.Step>
        <Stepper.Step type="button" onClick={() => setStep(2)}>
          <Stepper.Indicator />
          <Stepper.Content title="Summary" description="Review before submit" />
        </Stepper.Step>
      </Stepper.Root>
      <div className={styles.actions}>
        <Button.Root
          mode="stroke"
          variant="neutral"
          disabled={step <= 0}
          onClick={() => setStep((s) => s - 1)}
        >
          Back
        </Button.Root>
        <Button.Root
          mode="filled"
          variant="primary"
          disabled={step >= last}
          onClick={() => setStep((s) => s + 1)}
        >
          Next
        </Button.Root>
      </div>
    </div>
  );
}
