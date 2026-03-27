import { useState } from "react";
import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Typography } from "@/components/typography/Typography";

import styles from "./dropdown-examples.module.css";

/** Контролируемое `open` / `onOpenChange` — как в `playground/snippets/dropdown/controlled.tsx`. */
export default function DropdownControlledExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.controlledRow}>
      <Dropdown.Root open={open} onOpenChange={setOpen}>
        <Dropdown.Trigger>
          <Button.Root type="button" variant="neutral" mode="stroke">
            Шаг 2 из 4
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content align="start">
          <Dropdown.Item onSelect={() => setOpen(false)}>Шаг 1</Dropdown.Item>
          <Dropdown.Item onSelect={() => setOpen(false)}>Шаг 2</Dropdown.Item>
          <Dropdown.Item onSelect={() => setOpen(false)}>Шаг 3</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
      <Typography.Root as="span" variant="body-small" tone="muted">
        Меню {open ? "открыто" : "закрыто"}
      </Typography.Root>
    </div>
  );
}
