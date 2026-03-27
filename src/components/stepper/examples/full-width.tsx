import { Stepper } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/** Horizontal rail with `className="w-full justify-between"` inside a wide card. */
export default function StepperFullWidthExample() {
  const [step, setStep] = React.useState(2);

  return (
    <div className={styles.fullWidthCard}>
      <Stepper.Root
        orientation="horizontal"
        currentStep={step}
        className={styles.horizontalSpreadRoot}
      >
        <Stepper.Step type="button" onClick={() => setStep(0)}>
          <Stepper.Indicator />
          <Stepper.Content title="Build" />
        </Stepper.Step>
        <Stepper.SeparatorIcon />
        <Stepper.Step type="button" onClick={() => setStep(1)}>
          <Stepper.Indicator />
          <Stepper.Content title="Test" />
        </Stepper.Step>
        <Stepper.SeparatorIcon />
        <Stepper.Step type="button" onClick={() => setStep(2)}>
          <Stepper.Indicator />
          <Stepper.Content title="Release" />
        </Stepper.Step>
      </Stepper.Root>
    </div>
  );
}
