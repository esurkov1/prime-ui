import * as React from "react";

import { Stepper } from "@/components/stepper/Stepper";

/** `orientation="horizontal"` с `Stepper.SeparatorIcon` между кнопками и вертикальный режим по умолчанию со `Stepper.Arrow` у активного шага. */
export default function StepperOrientationSnippet() {
  const [horizontalStep, setHorizontalStep] = React.useState(1);
  const [verticalStep, setVerticalStep] = React.useState(1);

  return (
    <div className="flex flex-col gap-10">
      <Stepper.Root
        orientation="horizontal"
        currentStep={horizontalStep}
        className="w-full max-w-xl"
      >
        <Stepper.Step onClick={() => setHorizontalStep(0)}>
          <Stepper.Indicator />
          <Stepper.Content title="Корзина" />
        </Stepper.Step>
        <Stepper.SeparatorIcon />
        <Stepper.Step onClick={() => setHorizontalStep(1)}>
          <Stepper.Indicator />
          <Stepper.Content title="Доставка" />
        </Stepper.Step>
        <Stepper.SeparatorIcon />
        <Stepper.Step onClick={() => setHorizontalStep(2)}>
          <Stepper.Indicator />
          <Stepper.Content title="Оплата" />
        </Stepper.Step>
      </Stepper.Root>

      <Stepper.Root currentStep={verticalStep}>
        <Stepper.Step onClick={() => setVerticalStep(0)}>
          <Stepper.Indicator />
          <Stepper.Content title="Черновик" />
          <Stepper.Arrow />
        </Stepper.Step>
        <Stepper.Step onClick={() => setVerticalStep(1)}>
          <Stepper.Indicator />
          <Stepper.Content title="Правки" description="Редактирование текста" />
          <Stepper.Arrow />
        </Stepper.Step>
        <Stepper.Step onClick={() => setVerticalStep(2)}>
          <Stepper.Indicator />
          <Stepper.Content title="Публикация" />
        </Stepper.Step>
      </Stepper.Root>
    </div>
  );
}
