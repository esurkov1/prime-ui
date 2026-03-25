import * as React from "react";

import { Stepper } from "@/components/stepper/Stepper";

/** Псевдоним `Stepper.Item`, явный `index` для номера в индикаторе и `Stepper.SeparatorIcon` как отдельный элемент списка между шагами. */
export default function StepperFeaturesSnippet() {
  const [step, setStep] = React.useState(0);

  return (
    <Stepper.Root orientation="horizontal" currentStep={step}>
      <Stepper.Item onClick={() => setStep(0)}>
        <Stepper.ItemIndicator />
        <Stepper.Content title="Текущий шаг" />
      </Stepper.Item>
      <Stepper.SeparatorIcon />
      <Stepper.Item index={2} onClick={() => setStep(2)}>
        <Stepper.ItemIndicator />
        <Stepper.Content
          title="Свой номер"
          description="index=2 → в кружке 3, статус считается от currentStep"
        />
      </Stepper.Item>
      <Stepper.SeparatorIcon />
      <Stepper.Item onClick={() => setStep(3)}>
        <Stepper.ItemIndicator />
        <Stepper.Content
          title="Автонумерация"
          description="следующий индекс после предыдущих шагов"
        />
      </Stepper.Item>
    </Stepper.Root>
  );
}
