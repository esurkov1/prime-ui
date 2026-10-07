/** Vertical rows that open a page or panel end with a chevron — `Stepper.Arrow`. */
import { Stepper } from "prime-ui-kit";

import styles from "./examples.module.css";

const STEPS = [
  { title: "Корзина", description: "3 товара" },
  { title: "Доставка", description: "Адрес и интервал" },
  { title: "Оплата", description: "Карта или СБП" },
];

export default function StepperWithIconExample() {
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
            <Stepper.Arrow />
          </Stepper.Item>
        ))}
      </Stepper.Root>
    </div>
  );
}
