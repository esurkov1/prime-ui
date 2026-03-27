import { Button, Stepper } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/**
 * Onboarding wizard: vertical semantic stepper, controlled index, back / next actions.
 */
export default function StepperExampleOnboardingVertical() {
  const [step, setStep] = React.useState(0);
  const last = 2;

  return (
    <div className={styles.stack}>
      <Stepper.Root currentStep={step} orientation="vertical" className={styles.rail}>
        <Stepper.Step type="button" onClick={() => setStep(0)}>
          <Stepper.Indicator />
          <Stepper.Content title="Welcome" description="Product tour and goals" />
          <Stepper.Arrow />
        </Stepper.Step>
        <Stepper.Step type="button" onClick={() => setStep(1)}>
          <Stepper.Indicator />
          <Stepper.Content title="Team" description="Invite collaborators" />
          <Stepper.Arrow />
        </Stepper.Step>
        <Stepper.Step type="button" onClick={() => setStep(2)}>
          <Stepper.Indicator />
          <Stepper.Content title="Done" description="You are ready to build" />
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
