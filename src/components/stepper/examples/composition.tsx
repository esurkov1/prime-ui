import { IconMail, Stepper } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/** Custom `Indicator`, `Content`, and an extra icon beside the label. */
export default function StepperCompositionExample() {
  const [step, setStep] = React.useState(1);

  return (
    <Stepper.Root orientation="horizontal" currentStep={step} className={styles.horizontalRail2xl}>
      <Stepper.Step type="button" onClick={() => setStep(0)}>
        <Stepper.Indicator>✓</Stepper.Indicator>
        <Stepper.Content title="Invite" description="Email sent" />
      </Stepper.Step>
      <Stepper.SeparatorIcon />
      <Stepper.Step type="button" onClick={() => setStep(1)}>
        <Stepper.Indicator />
        <div className={styles.stepLabelRow}>
          <IconMail className={styles.iconMuted} aria-hidden />
          <Stepper.Content title="Confirm email" description="Use the link from the message" />
        </div>
      </Stepper.Step>
      <Stepper.SeparatorIcon />
      <Stepper.Step type="button" onClick={() => setStep(2)}>
        <Stepper.Indicator />
        <Stepper.Content title="Done" />
      </Stepper.Step>
    </Stepper.Root>
  );
}
