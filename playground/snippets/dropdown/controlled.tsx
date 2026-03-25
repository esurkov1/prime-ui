import { useState } from "react";
import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";

/** Внешнее состояние: `open` и `onOpenChange` на `Dropdown.Root` для синхронизации с мастером или аналитикой. */
export default function DropdownControlledSnippet() {
  const [open, setOpen] = useState(false);

  return (
    <div className="row" style={{ alignItems: "center", gap: "0.75rem" }}>
      <Dropdown.Root open={open} onOpenChange={setOpen}>
        <Dropdown.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            Шаг 2 из 4
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content align="start">
          <Dropdown.Item onSelect={() => setOpen(false)}>Шаг 1</Dropdown.Item>
          <Dropdown.Item onSelect={() => setOpen(false)}>Шаг 2</Dropdown.Item>
          <Dropdown.Item onSelect={() => setOpen(false)}>Шаг 3</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
      <span style={{ fontSize: "0.875rem", opacity: 0.8 }}>
        Меню {open ? "открыто" : "закрыто"}
      </span>
    </div>
  );
}
