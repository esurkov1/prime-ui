/** A horizontal stepper in a phone-width container stacks one step per row and hides the chevrons. */
import { Stepper } from "prime-ui-kit";

import styles from "./examples.module.css";

const STEPS = ["Компания", "Реквизиты", "Договор"];

export default function StepperNarrowExample() {
  return (
    <div className={styles.narrow}>
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
    </div>
  );
}
