import { Dropdown } from "@/components/dropdown/Dropdown";

/**
 * Триггер сливается с единственным дочерним элементом: на ссылку навешиваются aria-expanded,
 * aria-controls и открытие по клику (обработчик объединяется с вашим onClick).
 */
export default function DropdownAsChildSnippet() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <a
          href="/playground"
          style={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          Открыть как ссылка-триггер
        </a>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>Пункт 1</Dropdown.Item>
        <Dropdown.Item>Пункт 2</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
