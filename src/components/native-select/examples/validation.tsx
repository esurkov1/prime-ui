/** Required and optional markers, a hint, and an error that replaces the hint in the same row — `required`, `optional`, `hint`, `error`. */
import { NativeSelect } from "prime-ui-kit";

export default function NativeSelectValidationExample() {
  return (
    <>
      <NativeSelect label="Страна" required hint="Определяет валюту счетов" defaultValue="ru">
        <option value="ru">Россия</option>
        <option value="kz">Казахстан</option>
      </NativeSelect>
      <NativeSelect
        label="Ответственный"
        required
        error="Назначьте ответственного"
        placeholder="Не выбран"
      >
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
