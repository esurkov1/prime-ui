import { Stepper } from "prime-ui-kit";
import * as React from "react";

/** `Stepper.Item` / `ItemIndicator` aliases, explicit `index`, list `SeparatorIcon` nodes. */
export default function StepperFeaturesExample() {
  const [step, setStep] = React.useState(0);

  return (
    <Stepper.Root orientation="horizontal" currentStep={step}>
      <Stepper.Item type="button" onClick={() => setStep(0)}>
        <Stepper.ItemIndicator />
        <Stepper.Content title="Current step" />
      </Stepper.Item>
      <Stepper.SeparatorIcon />
      <Stepper.Item type="button" index={2} onClick={() => setStep(2)}>
        <Stepper.ItemIndicator />
        <Stepper.Content
          title="Custom number"
          description="index=2 → circle shows 3; status still follows currentStep"
        />
      </Stepper.Item>
      <Stepper.SeparatorIcon />
      <Stepper.Item type="button" onClick={() => setStep(3)}>
        <Stepper.ItemIndicator />
        <Stepper.Content title="Auto index" description="next index after preceding steps" />
      </Stepper.Item>
    </Stepper.Root>
  );
}
