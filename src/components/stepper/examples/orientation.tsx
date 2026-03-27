import { Stepper } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/** Horizontal flow with `SeparatorIcon`; vertical default with `Arrow` on active rows. */
export default function StepperOrientationExample() {
  const [horizontalStep, setHorizontalStep] = React.useState(1);
  const [verticalStep, setVerticalStep] = React.useState(1);

  return (
    <div className={styles.stackLoose}>
      <Stepper.Root
        orientation="horizontal"
        currentStep={horizontalStep}
        className={styles.horizontalRailXl}
      >
        <Stepper.Step type="button" onClick={() => setHorizontalStep(0)}>
          <Stepper.Indicator />
          <Stepper.Content title="Cart" />
        </Stepper.Step>
        <Stepper.SeparatorIcon />
        <Stepper.Step type="button" onClick={() => setHorizontalStep(1)}>
          <Stepper.Indicator />
          <Stepper.Content title="Shipping" />
        </Stepper.Step>
        <Stepper.SeparatorIcon />
        <Stepper.Step type="button" onClick={() => setHorizontalStep(2)}>
          <Stepper.Indicator />
          <Stepper.Content title="Payment" />
        </Stepper.Step>
      </Stepper.Root>

      <Stepper.Root currentStep={verticalStep}>
        <Stepper.Step type="button" onClick={() => setVerticalStep(0)}>
          <Stepper.Indicator />
          <Stepper.Content title="Draft" />
          <Stepper.Arrow />
        </Stepper.Step>
        <Stepper.Step type="button" onClick={() => setVerticalStep(1)}>
          <Stepper.Indicator />
          <Stepper.Content title="Edits" description="Edit body copy" />
          <Stepper.Arrow />
        </Stepper.Step>
        <Stepper.Step type="button" onClick={() => setVerticalStep(2)}>
          <Stepper.Indicator />
          <Stepper.Content title="Publish" />
        </Stepper.Step>
      </Stepper.Root>
    </div>
  );
}
