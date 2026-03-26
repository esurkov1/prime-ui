import { useState } from "react";
import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Typography } from "@/components/typography/Typography";

/** Внешнее состояние: `open` и `onOpenChange` на `Dropdown.Root` для синхронизации с мастером или аналитикой. */
export default function DropdownControlledSnippet() {
  const [open, setOpen] = useState(false);

  return (
    <div className="row rowAlignCenter rowGapMedium">
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
      <Typography.Root as="span" size="s" tone="muted">
        Меню {open ? "открыто" : "закрыто"}
      </Typography.Root>
    </div>
  );
}
