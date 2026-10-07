/** All five size tiers of a horizontal stepper (indicator 20 · 24 · 28 · 32 · 36, title in the control text). Use to match the stepper to the surrounding form size. */
import { type ControlSize, Stepper, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes: ControlSize[] = ["xs", "s", "m", "l", "xl"];

export default function StepperSizesExample() {
  return (
    <div className={styles.stack}>
      {sizes.map((size) => (
        <div key={size} className={styles.group}>
          <Typography.Root variant="code" tone="muted">
            size="{size}"
          </Typography.Root>
          <Stepper.Root orientation="horizontal" size={size} defaultValue={1}>
            <Stepper.Step>
              <Stepper.Indicator />
              <Stepper.Content>
                <Stepper.Title>Аккаунт</Stepper.Title>
              </Stepper.Content>
            </Stepper.Step>
            <Stepper.Step>
              <Stepper.Indicator />
              <Stepper.Content>
                <Stepper.Title>Команда</Stepper.Title>
              </Stepper.Content>
            </Stepper.Step>
            <Stepper.Step>
              <Stepper.Indicator />
              <Stepper.Content>
                <Stepper.Title>Готово</Stepper.Title>
              </Stepper.Content>
            </Stepper.Step>
          </Stepper.Root>
        </div>
      ))}
    </div>
  );
}
