/** The parent owns the list: a button opens it from code, Escape or an outside press closes it — `open`, `onOpenChange`. */
import { Button, TagSelect, type TagSelectOption } from "prime-ui-kit";
import * as React from "react";

const OPTIONS: TagSelectOption[] = [
  { value: "anna", label: "Анна Смирнова", color: "blue" },
  { value: "igor", label: "Игорь Петров", color: "green" },
  { value: "olga", label: "Ольга Ким", color: "purple" },
  { value: "pavel", label: "Павел Орлов", color: "orange" },
];

export default function TagSelectControlledOpenExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TagSelect
        label="Исполнители задачи"
        options={OPTIONS}
        placeholder="Никто не назначен"
        open={open}
        onOpenChange={setOpen}
      />
      <Button.Root variant="soft" tone="neutral" onClick={() => setOpen(true)}>
        Назначить исполнителей
      </Button.Root>
    </>
  );
}
