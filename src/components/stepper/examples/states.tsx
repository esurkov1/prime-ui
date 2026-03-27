import { Stepper } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/** Disabled step and `status="error"` with custom `Indicator` content. */
export default function StepperStatesExample() {
  const [disabledStep, setDisabledStep] = React.useState(1);
  const [errorStep, setErrorStep] = React.useState(1);

  return (
    <div className={styles.stackLoose}>
      <Stepper.Root currentStep={disabledStep}>
        <Stepper.Step type="button" onClick={() => setDisabledStep(0)}>
          <Stepper.Indicator />
          <Stepper.Content title="Done" />
        </Stepper.Step>
        <Stepper.Step type="button" disabled>
          <Stepper.Indicator />
          <Stepper.Content title="Unavailable" description="Opens after verification" />
        </Stepper.Step>
        <Stepper.Step type="button" onClick={() => setDisabledStep(2)}>
          <Stepper.Indicator />
          <Stepper.Content title="Finish" />
        </Stepper.Step>
      </Stepper.Root>

      <Stepper.Root currentStep={errorStep}>
        <Stepper.Step type="button" onClick={() => setErrorStep(0)}>
          <Stepper.Indicator />
          <Stepper.Content title="Payment OK" />
        </Stepper.Step>
        <Stepper.Step type="button" status="error" onClick={() => setErrorStep(1)}>
          <Stepper.Indicator>!</Stepper.Indicator>
          <Stepper.Content title="Delivery error" description="Check address and slot" />
        </Stepper.Step>
        <Stepper.Step type="button" onClick={() => setErrorStep(2)}>
          <Stepper.Indicator />
          <Stepper.Content title="Confirm" />
        </Stepper.Step>
      </Stepper.Root>
    </div>
  );
}
