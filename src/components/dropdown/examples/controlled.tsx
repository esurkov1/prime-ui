/** Controlled menu: `open` + `onOpenChange` mirrored in parent state, items update the trigger label. Use when other UI must know or drive the open state. */
import { Button, Dropdown, Typography } from "prime-ui-kit";
import { useState } from "react";

import styles from "./examples.module.css";

export default function DropdownControlledExample() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("Шаг 2");

  return (
    <div className={styles.row}>
      <Dropdown.Root open={open} onOpenChange={setOpen}>
        <Dropdown.Trigger>
          <Button.Root variant="soft" tone="neutral">
            {step} из 3
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content>
          {["Шаг 1", "Шаг 2", "Шаг 3"].map((item) => (
            <Dropdown.Item key={item} onSelect={() => setStep(item)}>
              {item}
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown.Root>
      <Typography.Root as="span" variant="body-s" tone="secondary">
        Меню {open ? "открыто" : "закрыто"}
      </Typography.Root>
    </div>
  );
}
