/** A labelled field with a placeholder; picking an option closes the list and shows its label — `label`, `placeholder`. */
import { Select } from "prime-ui-kit";

export default function SelectOverviewExample() {
  return (
    <Select.Root label="Роль в проекте" placeholder="Выберите роль">
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="viewer">Наблюдатель</Select.Item>
        <Select.Item value="editor">Редактор</Select.Item>
        <Select.Item value="admin">Администратор</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
