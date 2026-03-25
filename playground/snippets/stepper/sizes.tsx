import * as React from "react";

import { Stepper } from "@/components/stepper/Stepper";

/** Четыре размера — по одному Stepper.Root на строку. */
export default function StepperSizesSnippet() {
  const [stepS, setStepS] = React.useState(1);
  const [stepM, setStepM] = React.useState(1);
  const [stepL, setStepL] = React.useState(1);
  const [stepXL, setStepXL] = React.useState(1);

  return (
    <>
      <Stepper.Root size="s" currentStep={stepS}>
        <Stepper.Step onClick={() => setStepS(0)}>
          <Stepper.Indicator />
          <Stepper.Content title="Account" description="Create or link account" />
        </Stepper.Step>
        <Stepper.Step onClick={() => setStepS(1)}>
          <Stepper.Indicator />
          <Stepper.Content title="Details" description="Fill profile details" />
        </Stepper.Step>
        <Stepper.Step onClick={() => setStepS(2)}>
          <Stepper.Indicator />
          <Stepper.Content title="Review" description="Confirm and submit" />
        </Stepper.Step>
      </Stepper.Root>
      <Stepper.Root size="m" currentStep={stepM}>
        <Stepper.Step onClick={() => setStepM(0)}>
          <Stepper.Indicator />
          <Stepper.Content title="Account" description="Create or link account" />
        </Stepper.Step>
        <Stepper.Step onClick={() => setStepM(1)}>
          <Stepper.Indicator />
          <Stepper.Content title="Details" description="Fill profile details" />
        </Stepper.Step>
        <Stepper.Step onClick={() => setStepM(2)}>
          <Stepper.Indicator />
          <Stepper.Content title="Review" description="Confirm and submit" />
        </Stepper.Step>
      </Stepper.Root>
      <Stepper.Root size="l" currentStep={stepL}>
        <Stepper.Step onClick={() => setStepL(0)}>
          <Stepper.Indicator />
          <Stepper.Content title="Account" description="Create or link account" />
        </Stepper.Step>
        <Stepper.Step onClick={() => setStepL(1)}>
          <Stepper.Indicator />
          <Stepper.Content title="Details" description="Fill profile details" />
        </Stepper.Step>
        <Stepper.Step onClick={() => setStepL(2)}>
          <Stepper.Indicator />
          <Stepper.Content title="Review" description="Confirm and submit" />
        </Stepper.Step>
      </Stepper.Root>
      <Stepper.Root size="xl" currentStep={stepXL}>
        <Stepper.Step onClick={() => setStepXL(0)}>
          <Stepper.Indicator />
          <Stepper.Content title="Account" description="Create or link account" />
        </Stepper.Step>
        <Stepper.Step onClick={() => setStepXL(1)}>
          <Stepper.Indicator />
          <Stepper.Content title="Details" description="Fill profile details" />
        </Stepper.Step>
        <Stepper.Step onClick={() => setStepXL(2)}>
          <Stepper.Indicator />
          <Stepper.Content title="Review" description="Confirm and submit" />
        </Stepper.Step>
      </Stepper.Root>
    </>
  );
}
