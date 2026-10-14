/** A typed text that is not in the list becomes a new tag from the Create row or Enter and is saved on the server: the chip waits busy, and a tag the server refuses leaves again — `creatable`, `onCreate`, `fallbackColor`. */
import { TagSelect, type TagSelectOption, Typography } from "prime-ui-kit";
import * as React from "react";

const OPTIONS: TagSelectOption[] = [
  { value: "bug", label: "Ошибка", color: "red" },
  { value: "feature", label: "Новая функция", color: "blue" },
];

/** The server's answer a beat later: a label needs at least three letters. */
function saveLabel(value: string) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (value.length < 3) reject(new Error(`Метка «${value}» короче трёх букв`));
      else resolve();
    }, 900);
  });
}

export default function TagSelectCreatableExample() {
  const [created, setCreated] = React.useState<string[]>([]);
  const [failure, setFailure] = React.useState<string>();

  return (
    <>
      <TagSelect
        label="Метки"
        options={OPTIONS}
        creatable
        fallbackColor="purple"
        error={failure}
        onCreate={async (value) => {
          setFailure(undefined);
          try {
            await saveLabel(value);
          } catch (error) {
            setFailure(error instanceof Error ? error.message : String(error));
            throw error;
          }
          setCreated((prev) => [...prev, value]);
        }}
        placeholder="Найдите или создайте метку"
      />
      <Typography as="p" variant="body-s" tone="secondary">
        {created.length ? `Созданы: ${created.join(", ")}` : "Наберите новую метку и нажмите Enter"}
      </Typography>
    </>
  );
}
