/** The parent owns the list: a button opens it from code, a pick or Escape closes it — `open`, `onOpenChange`. */
import { Button, Select } from "prime-ui-kit";
import * as React from "react";

export default function SelectControlledOpenExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Select.Root
        label="Склад отгрузки"
        placeholder="Склад не выбран"
        open={open}
        onOpenChange={setOpen}
      >
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="msk">Москва, Южные ворота</Select.Item>
          <Select.Item value="spb">Санкт-Петербург, Шушары</Select.Item>
          <Select.Item value="ekb">Екатеринбург, Кольцово</Select.Item>
        </Select.Content>
      </Select.Root>
      <Button.Root variant="soft" tone="neutral" onClick={() => setOpen(true)}>
        Выбрать склад
      </Button.Root>
    </>
  );
}
