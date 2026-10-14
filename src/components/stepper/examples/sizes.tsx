/** Every size tier: indicator 20 to 36 px, title in the control text of the tier — `size`. */
import { Stepper, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;
const STEPS = ["Аккаунт", "Команда", "Готово"];

export default function StepperSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
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
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
        </div>
      ))}
    </div>
  );
}
