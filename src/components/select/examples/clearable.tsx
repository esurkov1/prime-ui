/** An optional field that can be reset: a clear segment before the chevron, Delete or Backspace on the trigger — `clearable`. */
import { Select } from "prime-ui-kit";

export default function SelectClearableExample() {
  return (
    <Select.Root
      label="Менеджер клиента"
      optional
      clearable
      defaultValue="anna"
      placeholder="Не назначен"
    >
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="anna">Анна Петрова</Select.Item>
        <Select.Item value="ivan">Иван Смирнов</Select.Item>
        <Select.Item value="olga">Ольга Ким</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
