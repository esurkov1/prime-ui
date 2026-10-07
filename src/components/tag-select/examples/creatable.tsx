/** A typed text that is not in the list becomes a new tag from the Create row or Enter — `creatable`, `onCreate`, `defaultColor`. */
import { TagSelect, type TagSelectOption, Typography } from "prime-ui-kit";
import * as React from "react";

const OPTIONS: TagSelectOption[] = [
  { value: "bug", label: "Ошибка", color: "red" },
  { value: "feature", label: "Новая функция", color: "blue" },
];

export default function TagSelectCreatableExample() {
  const [created, setCreated] = React.useState<string[]>([]);

  return (
    <>
      <TagSelect
        label="Метки"
        options={OPTIONS}
        creatable
        defaultColor="purple"
        onCreate={(value) => setCreated((prev) => [...prev, value])}
        placeholder="Найдите или создайте метку"
      />
      <Typography.Root as="p" variant="body-s" tone="secondary">
        {created.length ? `Созданы: ${created.join(", ")}` : "Наберите новую метку и нажмите Enter"}
      </Typography.Root>
    </>
  );
}
