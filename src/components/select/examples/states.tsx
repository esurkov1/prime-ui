/** A default field next to a disabled, a loading, an invalid one, a list with nothing in it and a field whose focus shows without the ring — `disabled`, `loading`, `invalid`, `labels`, `focusRing`. */
import { Select } from "prime-ui-kit";

const ROLES = [
  { value: "viewer", label: "Наблюдатель" },
  { value: "editor", label: "Редактор" },
  { value: "admin", label: "Администратор" },
];

export default function SelectStatesExample() {
  return (
    <>
      <Select.Root label="default" defaultValue="editor">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {ROLES.map((role) => (
            <Select.Item key={role.value} value={role.value}>
              {role.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <Select.Root label="disabled" defaultValue="viewer" disabled>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {ROLES.map((role) => (
            <Select.Item key={role.value} value={role.value}>
              {role.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <Select.Root label="loading" placeholder="Загружаем роли…" loading>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>{null}</Select.Content>
      </Select.Root>
      <Select.Root label="invalid" placeholder="Выберите роль" invalid>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {ROLES.map((role) => (
            <Select.Item key={role.value} value={role.value}>
              {role.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <Select.Root
        label="labels.empty"
        placeholder="Нет доступных команд"
        labels={{ empty: "Команд пока нет" }}
      >
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>{null}</Select.Content>
      </Select.Root>
      <Select.Root label="focusRing={false}" defaultValue="editor" focusRing={false}>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {ROLES.map((role) => (
            <Select.Item key={role.value} value={role.value}>
              {role.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </>
  );
}
