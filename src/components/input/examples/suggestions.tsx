/** Where a returned order is kept: free text with the places already used as suggestions — `suggestions`. */
import { Input } from "prime-ui-kit";
import * as React from "react";

const PLACES = [
  "Склад на Складочной, стеллаж А",
  "Склад на Складочной, зона возвратов",
  "Пункт выдачи на Лесной",
  "Сервисный центр на Нагатинской",
];

export default function InputSuggestionsExample() {
  const [place, setPlace] = React.useState("");

  return (
    <Input.Root
      label="Где хранится возврат"
      hint="Выберите из прошлых мест или впишите новое"
      suggestions={PLACES}
    >
      <Input.Wrapper>
        <Input.Field value={place} onValueChange={setPlace} placeholder="Склад на Складочной" />
      </Input.Wrapper>
    </Input.Root>
  );
}
