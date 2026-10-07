/** A row of steps with chevrons between them above the content, and a column for a side panel — `orientation`. */
import { Stepper } from "prime-ui-kit";

import styles from "./examples.module.css";

const STEPS = ["Корзина", "Доставка", "Оплата"];

export default function StepperOrientationExample() {
  return (
    <>
      <Stepper.Root orientation="horizontal" defaultValue={1}>
        {STEPS.map((title) => (
          <Stepper.Item key={title}>
            <Stepper.Indicator />
            <Stepper.Content>
              <Stepper.Title>{title}</Stepper.Title>
            </Stepper.Content>
          </Stepper.Item>
        ))}
      </Stepper.Root>
      <div className={styles.column}>
        <Stepper.Root orientation="vertical" defaultValue={1}>
          {STEPS.map((title) => (
            <Stepper.Item key={title}>
              <Stepper.Indicator />
              <Stepper.Content>
                <Stepper.Title>{title}</Stepper.Title>
              </Stepper.Content>
            </Stepper.Item>
          ))}
        </Stepper.Root>
      </div>
    </>
  );
}
