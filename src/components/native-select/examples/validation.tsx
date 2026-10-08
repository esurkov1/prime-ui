/** Live validation: unassigning the owner shakes the field and drops the error in, picking someone clears it; required and optional markers and a hint — `required`, `optional`, `hint`, `error`. */
import { NativeSelect } from "prime-ui-kit";
import * as React from "react";

export default function NativeSelectValidationExample() {
  const [owner, setOwner] = React.useState("anna");

  return (
    <>
      <NativeSelect label="Страна" required hint="Определяет валюту счетов" defaultValue="ru">
        <option value="ru">Россия</option>
        <option value="kz">Казахстан</option>
      </NativeSelect>
      <NativeSelect
        label="Ответственный"
        required
        error={owner === "none" ? "Назначьте ответственного" : undefined}
        value={owner}
        onValueChange={setOwner}
      >
        <option value="none">Не назначен</option>
        <option value="anna">Анна Петрова</option>
        <option value="ivan">Иван Смирнов</option>
      </NativeSelect>
      <NativeSelect label="Отдел" optional placeholder="Не указан">
        <option value="sales">Продажи</option>
        <option value="support">Поддержка</option>
      </NativeSelect>
    </>
  );
}
