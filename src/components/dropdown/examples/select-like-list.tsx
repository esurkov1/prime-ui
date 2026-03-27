import { useState } from "react";
import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";

const WORKSPACES = ["Команда дизайна", "Продукт Альфа", "Внутренние"] as const;

/**
 * Быстрый переключатель контекста: триггер показывает текущий выбор.
 * Семантика остаётся `role="menu"` / `menuitem`, не комбобокс — для поля формы с одним значением
 * и связью label/value используйте Select.
 */
export default function DropdownSelectLikeListExample() {
  const [workspace, setWorkspace] = useState<(typeof WORKSPACES)[number]>(WORKSPACES[0]);

  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root type="button" variant="neutral" mode="stroke">
          Пространство: {workspace}
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content sameMinWidthAsTrigger>
        {WORKSPACES.map((name) => (
          <Dropdown.Item key={name} onSelect={() => setWorkspace(name)}>
            {name}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
