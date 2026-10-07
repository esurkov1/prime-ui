/** Required and optional markers, a hint, and an error that replaces the hint in the same row — `required`, `optional`, `hint`, `error`. */
import { Select } from "prime-ui-kit";

export default function SelectValidationExample() {
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
        error="Назначьте ответственного"
        placeholder="Не выбран"
      >
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
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
