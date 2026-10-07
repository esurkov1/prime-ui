/** Setup wizard: a vertical stepper next to the step form with Back / Next; far steps stay disabled until the previous one is done. Use for multi-step onboarding and setup flows. */
import { Button, Input, Stepper, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const steps = [
  { title: "Компания", description: "Название и ИНН", field: "Название компании" },
  { title: "Контакты", description: "Кто будет администратором", field: "Электронная почта" },
  { title: "Тариф", description: "Можно сменить позже", field: "Промокод" },
];

export default function StepperWizardExample() {
  const [step, setStep] = React.useState(0);
  const last = steps.length - 1;
  const current = steps[step];

  return (
    <div className={styles.wizard}>
      <Stepper.Root value={step} onValueChange={setStep}>
        {steps.map((s, i) => (
          <Stepper.Step key={s.title} disabled={i > step + 1}>
            <Stepper.Indicator />
            <Stepper.Content>
              <Stepper.Title>{s.title}</Stepper.Title>
              <Stepper.Description>{s.description}</Stepper.Description>
            </Stepper.Content>
          </Stepper.Step>
        ))}
      </Stepper.Root>

      <div className={styles.form}>
        <Typography.Root as="h3" variant="title-m">
          Шаг {step + 1} из {steps.length}: {current.title}
        </Typography.Root>
        <Input.Root
          key={current.field}
          label={current.field}
          required={step < last}
          optional={step === last}
        >
          <Input.Wrapper>
            <Input.Field />
          </Input.Wrapper>
        </Input.Root>
        <div className={styles.actions}>
          <Button.Root
            variant="outline"
            tone="neutral"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
          >
            Назад
          </Button.Root>
          <Button.Root onClick={() => setStep((s) => Math.min(s + 1, last))}>
            {step === last ? "Подключить" : "Далее"}
          </Button.Root>
        </div>
      </div>
    </div>
  );
}
