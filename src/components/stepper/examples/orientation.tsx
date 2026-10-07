/** Horizontal steps (chevrons added by the root) and vertical rows with descriptions and `Stepper.Arrow`, both controlled by one `value`. Use horizontal above checkout content, vertical in a side column. */
import { Stepper, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function StepperOrientationExample() {
  const [step, setStep] = React.useState(1);

  return (
    <div className={styles.stack}>
      <div className={styles.group}>
        <Typography.Root variant="code" tone="muted">
          orientation="horizontal"
        </Typography.Root>
        <Stepper.Root orientation="horizontal" value={step} onValueChange={setStep}>
          <Stepper.Step>
            <Stepper.Indicator />
            <Stepper.Content>
              <Stepper.Title>Корзина</Stepper.Title>
            </Stepper.Content>
          </Stepper.Step>
          <Stepper.Step>
            <Stepper.Indicator />
            <Stepper.Content>
              <Stepper.Title>Доставка</Stepper.Title>
            </Stepper.Content>
          </Stepper.Step>
          <Stepper.Step>
            <Stepper.Indicator />
            <Stepper.Content>
              <Stepper.Title>Оплата</Stepper.Title>
            </Stepper.Content>
          </Stepper.Step>
        </Stepper.Root>
      </div>

      <div className={styles.group}>
        <Typography.Root variant="code" tone="muted">
          orientation="vertical"
        </Typography.Root>
        <div className={styles.vertical}>
          <Stepper.Root value={step} onValueChange={setStep}>
            <Stepper.Step>
              <Stepper.Indicator />
              <Stepper.Content>
                <Stepper.Title>Корзина</Stepper.Title>
                <Stepper.Description>3 товара</Stepper.Description>
              </Stepper.Content>
              <Stepper.Arrow />
            </Stepper.Step>
            <Stepper.Step>
              <Stepper.Indicator />
              <Stepper.Content>
                <Stepper.Title>Доставка</Stepper.Title>
                <Stepper.Description>Адрес и интервал</Stepper.Description>
              </Stepper.Content>
              <Stepper.Arrow />
            </Stepper.Step>
            <Stepper.Step>
              <Stepper.Indicator />
              <Stepper.Content>
                <Stepper.Title>Оплата</Stepper.Title>
                <Stepper.Description>Карта или СБП</Stepper.Description>
              </Stepper.Content>
              <Stepper.Arrow />
            </Stepper.Step>
          </Stepper.Root>
        </div>
      </div>
    </div>
  );
}
