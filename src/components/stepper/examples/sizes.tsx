/** Every size tier: indicator 20 to 36 px, title in the control text of the tier — `size`. */
import { Stepper, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;
const STEPS = ["Аккаунт", "Команда", "Готово"];

export default function StepperSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <div key={size} className={styles.wide}>
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
          <Stepper.Root orientation="horizontal" size={size} defaultValue={1}>
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
      ))}
    </>
  );
}
