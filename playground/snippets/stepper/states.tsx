import * as React from "react";

import { Stepper } from "@/components/stepper/Stepper";

/** Неактивный шаг (`disabled`), ошибка на шаге (`status="error"`, кастомный индикатор) и обычный прогресс через `currentStep`. */
export default function StepperStatesSnippet() {
  const [disabledStep, setDisabledStep] = React.useState(1);
  const [errorStep, setErrorStep] = React.useState(1);

  return (
    <div className="flex flex-col gap-10">
      <Stepper.Root currentStep={disabledStep}>
        <Stepper.Step onClick={() => setDisabledStep(0)}>
          <Stepper.Indicator />
          <Stepper.Content title="Готово" />
        </Stepper.Step>
        <Stepper.Step disabled>
          <Stepper.Indicator />
          <Stepper.Content title="Недоступно" description="Откроется после проверки" />
        </Stepper.Step>
        <Stepper.Step onClick={() => setDisabledStep(2)}>
          <Stepper.Indicator />
          <Stepper.Content title="Финал" />
        </Stepper.Step>
      </Stepper.Root>

      <Stepper.Root currentStep={errorStep}>
        <Stepper.Step onClick={() => setErrorStep(0)}>
          <Stepper.Indicator />
          <Stepper.Content title="Оплата прошла" />
        </Stepper.Step>
        <Stepper.Step status="error" onClick={() => setErrorStep(1)}>
          <Stepper.Indicator>!</Stepper.Indicator>
          <Stepper.Content title="Ошибка доставки" description="Проверьте адрес и интервал" />
        </Stepper.Step>
        <Stepper.Step onClick={() => setErrorStep(2)}>
          <Stepper.Indicator />
          <Stepper.Content title="Подтверждение" />
        </Stepper.Step>
      </Stepper.Root>
    </div>
  );
}
