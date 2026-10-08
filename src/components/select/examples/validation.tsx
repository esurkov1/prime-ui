/** Live validation: unassigning the owner shakes the field and drops the error in, picking someone clears it; required and optional markers and a hint — `required`, `optional`, `hint`, `error`. */
import { Select } from "prime-ui-kit";
import * as React from "react";

export default function SelectValidationExample() {
  const [owner, setOwner] = React.useState("anna");

  return (
    <>
      <Select.Root label="Страна" required hint="Определяет валюту счетов" defaultValue="ru">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="ru">Россия</Select.Item>
          <Select.Item value="kz">Казахстан</Select.Item>
        </Select.Content>
      </Select.Root>
      <Select.Root
        label="Ответственный"
        required
        error={owner === "none" ? "Назначьте ответственного" : undefined}
        value={owner}
        onValueChange={setOwner}
      >
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="none">Не назначен</Select.Item>
          <Select.Item value="anna">Анна Петрова</Select.Item>
          <Select.Item value="ivan">Иван Смирнов</Select.Item>
        </Select.Content>
      </Select.Root>
      <Select.Root label="Отдел" optional placeholder="Не указан">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="sales">Продажи</Select.Item>
          <Select.Item value="support">Поддержка</Select.Item>
        </Select.Content>
      </Select.Root>
    </>
  );
}
