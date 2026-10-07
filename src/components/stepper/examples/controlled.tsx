/** The parent owns the current step: Back and Next move it, far steps stay locked until reached — `value`, `onValueChange`. */
import { Button, Stepper } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const STEPS = [
  { title: "Компания", description: "Название и ИНН" },
  { title: "Контакты", description: "Кто будет администратором" },
  { title: "Тариф", description: "Можно сменить позже" },
];

const LAST = STEPS.length - 1;

export default function StepperControlledExample() {
  const [step, setStep] = React.useState(0);

  return (
    <div className={styles.column}>
      <Stepper.Root value={step} onValueChange={setStep}>
        {STEPS.map((item, index) => (
          <Stepper.Item key={item.title} disabled={index > step + 1}>
            <Stepper.Indicator />
            <Stepper.Content>
              <Stepper.Title>{item.title}</Stepper.Title>
              <Stepper.Description>{item.description}</Stepper.Description>
            </Stepper.Content>
          </Stepper.Item>
        ))}
      </Stepper.Root>
      <div className={styles.actions}>
        <Button.Root
          variant="outline"
          tone="neutral"
          disabled={step === 0}
          onClick={() => setStep(step - 1)}
        >
          Назад
        </Button.Root>
        <Button.Root disabled={step === LAST} onClick={() => setStep(step + 1)}>
          Далее
        </Button.Root>
      </div>
    </div>
  );
}
