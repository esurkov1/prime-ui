/** Several values: checkboxes in the list, the list stays open on a pick, labels joined in the trigger — `multiple`. */
import { Select } from "prime-ui-kit";

export default function SelectMultipleExample() {
  return (
    <Select.Root
      label="Отделы"
      multiple
      defaultValue={["eng", "design"]}
      placeholder="Выберите отделы"
    >
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="eng">Разработка</Select.Item>
        <Select.Item value="design">Дизайн</Select.Item>
        <Select.Item value="sales">Продажи</Select.Item>
        <Select.Item value="support">Поддержка</Select.Item>
        <Select.Item value="hr" disabled>
          HR — нет доступа
        </Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
