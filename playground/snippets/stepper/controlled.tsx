import * as React from "react";

import { Button } from "@/components/button/Button";
import { Stepper } from "@/components/stepper/Stepper";

/** Внешнее состояние: `currentStep` на `Stepper.Root` и кнопки «Назад» / «Далее». */
export default function StepperControlledSnippet() {
  const [step, setStep] = React.useState(0);
  const last = 2;

  return (
    <div className="flex flex-col gap-4">
      <Stepper.Root currentStep={step} className="w-full max-w-md">
        <Stepper.Step onClick={() => setStep(0)}>
          <Stepper.Indicator />
          <Stepper.Content title="Условия" description="Ознакомьтесь с правилами" />
          <Stepper.Arrow />
        </Stepper.Step>
        <Stepper.Step onClick={() => setStep(1)}>
          <Stepper.Indicator />
          <Stepper.Content title="Данные" description="Заполните контакты" />
          <Stepper.Arrow />
        </Stepper.Step>
        <Stepper.Step onClick={() => setStep(2)}>
          <Stepper.Indicator />
          <Stepper.Content title="Итог" description="Проверка перед отправкой" />
        </Stepper.Step>
      </Stepper.Root>
      <div className="flex gap-2">
        <Button.Root
          mode="stroke"
          variant="neutral"
          disabled={step <= 0}
          onClick={() => setStep((s) => s - 1)}
        >
          Назад
        </Button.Root>
        <Button.Root
          mode="filled"
          variant="primary"
          disabled={step >= last}
          onClick={() => setStep((s) => s + 1)}
        >
          Далее
        </Button.Root>
      </div>
    </div>
  );
}
