/** A horizontal stepper in a 320px container: below 30rem of its own width the steps stack one per row and separators hide. Use to check checkout steps on phones. */
import { Stepper } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function StepperNarrowExample() {
  return (
    <div className={styles.narrow}>
      <Stepper.Root orientation="horizontal" defaultValue={1}>
        <Stepper.Step>
          <Stepper.Indicator />
          <Stepper.Content>
            <Stepper.Title>Компания</Stepper.Title>
          </Stepper.Content>
        </Stepper.Step>
        <Stepper.Step>
          <Stepper.Indicator />
          <Stepper.Content>
            <Stepper.Title>Реквизиты</Stepper.Title>
          </Stepper.Content>
        </Stepper.Step>
        <Stepper.Step>
          <Stepper.Indicator />
          <Stepper.Content>
            <Stepper.Title>Договор</Stepper.Title>
          </Stepper.Content>
        </Stepper.Step>
      </Stepper.Root>
    </div>
  );
}
