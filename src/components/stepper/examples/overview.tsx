/** Steps of a process: done ones get a check, the current one is highlighted — `defaultValue`. */
import { Stepper } from "prime-ui-kit";

import styles from "./examples.module.css";

const STEPS = [
  { title: "Компания", description: "Название и ИНН" },
  { title: "Реквизиты", description: "Банк и расчётный счёт" },
  { title: "Договор", description: "Подпись и печать" },
];

export default function StepperOverviewExample() {
  return (
    <div className={styles.column}>
      <Stepper.Root defaultValue={1}>
        {STEPS.map((step) => (
          <Stepper.Item key={step.title}>
            <Stepper.Indicator />
            <Stepper.Content>
              <Stepper.Title>{step.title}</Stepper.Title>
              <Stepper.Description>{step.description}</Stepper.Description>
            </Stepper.Content>
          </Stepper.Item>
        ))}
      </Stepper.Root>
    </div>
  );
}
