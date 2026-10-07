/** The parent owns the open state and opens the menu from another button; the picked step updates the trigger — `open`, `onOpenChange`. */
import { Button, Dropdown } from "prime-ui-kit";
import * as React from "react";

const STEPS = ["Шаг 1 · Реквизиты", "Шаг 2 · Товары", "Шаг 3 · Оплата"];

export default function DropdownControlledOpenExample() {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(STEPS[1]);

  return (
    <>
      <Button.Root variant="ghost" tone="neutral" onClick={() => setOpen(true)}>
        Перейти к шагу
      </Button.Root>
      <Dropdown.Root open={open} onOpenChange={setOpen}>
        <Dropdown.Trigger>
          <Button.Root variant="soft" tone="neutral">
            {step}
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content>
          {STEPS.map((item) => (
            <Dropdown.Item key={item} onSelect={() => setStep(item)}>
              {item}
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown.Root>
    </>
  );
}
