/** Vertical rows that open a page or panel end with a chevron — `arrows`. */
import { Stepper, Typography } from "prime-ui-kit";

const STEPS = [
  { title: "Корзина", description: "3 товара" },
  { title: "Доставка", description: "Адрес и интервал" },
  { title: "Оплата", description: "Карта или СБП" },
];

export default function StepperWithIconExample() {
  return (
    <div>
      <div>
        <Stepper.Root defaultValue={1} arrows>
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
        <Typography as="span" variant="caption" tone="muted">
          arrows
        </Typography>
      </div>
    </div>
  );
}
