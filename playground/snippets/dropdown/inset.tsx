import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";

/** `Dropdown.Inset`: внутренние поля и вертикальный зазор между прямыми дочерними блоками (`padding`, `gap`). */
export default function DropdownInsetSnippet() {
  return (
    <>
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            С отступами по умолчанию
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Inset>
            <div style={{ fontSize: "0.75rem", opacity: 0.85 }}>Короткая заметка над списком.</div>
            <Dropdown.Item>Первый пункт</Dropdown.Item>
            <Dropdown.Item>Второй пункт</Dropdown.Item>
          </Dropdown.Inset>
        </Dropdown.Content>
      </Dropdown.Root>

      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            Плотная вставка
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Inset padding="none" gap="x2">
            <div style={{ fontSize: "0.75rem", padding: "0 0.5rem", opacity: 0.85 }}>
              Без внешнего inset-padding, меньший gap.
            </div>
            <Dropdown.Item>Действие A</Dropdown.Item>
            <Dropdown.Item>Действие B</Dropdown.Item>
          </Dropdown.Inset>
        </Dropdown.Content>
      </Dropdown.Root>
    </>
  );
}
