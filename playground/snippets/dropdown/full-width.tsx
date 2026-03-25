import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";

/** `sameMinWidthAsTrigger`: минимальная ширина панели не меньше ширины триггера — длинные подписи не сжимают меню. */
export default function DropdownFullWidthSnippet() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root
          size="m"
          variant="neutral"
          mode="stroke"
          aria-label="Действия со строкой"
          style={{ minWidth: "5.5rem" }}
        >
          ⋮
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content sameMinWidthAsTrigger>
        <Dropdown.Item>Очень длинная подпись пункта меню в одну строку</Dropdown.Item>
        <Dropdown.Item>Второй пункт</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
