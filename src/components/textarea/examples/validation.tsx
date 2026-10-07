/** Required and optional markers, a hint, an error and a support row that does not shift — `required`, `optional`, `hint`, `error`, `reserveSupportRow`. */
import { Button, Textarea } from "prime-ui-kit";
import * as React from "react";

export default function TextareaValidationExample() {
  const [checked, setChecked] = React.useState(false);

  return (
    <>
      <Textarea.Root
        label="Описание задачи"
        required
        defaultValue="Подготовить акт сверки с поставщиком за третий квартал."
        hint="Исполнитель увидит его в карточке задачи"
      />
      <Textarea.Root
        label="Причина отказа"
        required
        defaultValue="Нет"
        error="Опишите причину хотя бы в 20 символах"
      />
      <Textarea.Root
        label="Комментарий для бухгалтерии"
        optional
        reserveSupportRow
        defaultValue="Оплата частями"
        error={checked ? "Укажите номер договора" : undefined}
      />
      <Button.Root variant="soft" tone="neutral" onClick={() => setChecked((value) => !value)}>
        {checked ? "Сбросить проверку" : "Проверить комментарий"}
      </Button.Root>
    </>
  );
}
