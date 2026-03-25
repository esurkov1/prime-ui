import * as React from "react";

import { Stepper } from "@/components/stepper/Stepper";
import { IconMail } from "@/icons";

/** Кастомное содержимое `Stepper.Indicator`, подпись с описанием и иконка рядом с текстом шага. */
export default function StepperCompositionSnippet() {
  const [step, setStep] = React.useState(1);

  return (
    <Stepper.Root orientation="horizontal" currentStep={step} className="w-full max-w-2xl">
      <Stepper.Step onClick={() => setStep(0)}>
        <Stepper.Indicator>✓</Stepper.Indicator>
        <Stepper.Content title="Приглашение" description="Письмо отправлено" />
      </Stepper.Step>
      <Stepper.SeparatorIcon />
      <Stepper.Step onClick={() => setStep(1)}>
        <Stepper.Indicator />
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <IconMail
            className="mt-0.5 size-4 shrink-0 text-[var(--prime-sys-color-content-secondary)]"
            aria-hidden
          />
          <Stepper.Content
            title="Подтверждение почты"
            description="Перейдите по ссылке из письма"
          />
        </div>
      </Stepper.Step>
      <Stepper.SeparatorIcon />
      <Stepper.Step onClick={() => setStep(2)}>
        <Stepper.Indicator />
        <Stepper.Content title="Готово" />
      </Stepper.Step>
    </Stepper.Root>
  );
}
