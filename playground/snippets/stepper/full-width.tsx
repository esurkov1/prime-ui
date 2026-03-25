import * as React from "react";

import { Stepper } from "@/components/stepper/Stepper";

/** Горизонтальный степпер на всю ширину карточки: корень с `className="w-full"` в узком контейнере превью. */
export default function StepperFullWidthSnippet() {
  const [step, setStep] = React.useState(2);

  return (
    <div className="w-full max-w-full border border-[var(--prime-sys-color-stroke-subtle)] p-4">
      <Stepper.Root orientation="horizontal" currentStep={step} className="w-full justify-between">
        <Stepper.Step onClick={() => setStep(0)}>
          <Stepper.Indicator />
          <Stepper.Content title="Сборка" />
        </Stepper.Step>
        <Stepper.SeparatorIcon />
        <Stepper.Step onClick={() => setStep(1)}>
          <Stepper.Indicator />
          <Stepper.Content title="Тест" />
        </Stepper.Step>
        <Stepper.SeparatorIcon />
        <Stepper.Step onClick={() => setStep(2)}>
          <Stepper.Indicator />
          <Stepper.Content title="Релиз" />
        </Stepper.Step>
      </Stepper.Root>
    </div>
  );
}
