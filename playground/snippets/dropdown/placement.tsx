import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";

const longLabel = "Экспорт в PDF и печатная версия";

/** `align`: привязка панели к краю триггера; `side`: открытие сверху или снизу (с переносом у края вьюпорта). */
export default function DropdownPlacementSnippet() {
  return (
    <>
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root size="s" variant="neutral" mode="stroke">
            align start
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content align="start">
          <Dropdown.Item>{longLabel}</Dropdown.Item>
          <Dropdown.Item>Дублировать в проект</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>

      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root size="s" variant="neutral" mode="stroke">
            align center
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content align="center">
          <Dropdown.Item>{longLabel}</Dropdown.Item>
          <Dropdown.Item>Дублировать в проект</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>

      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root size="s" variant="neutral" mode="stroke">
            align end
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content align="end">
          <Dropdown.Item>{longLabel}</Dropdown.Item>
          <Dropdown.Item>Дублировать в проект</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>

      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root size="s" variant="neutral" mode="stroke">
            side top
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content side="top">
          <Dropdown.Item>Пункт выше триггера</Dropdown.Item>
          <Dropdown.Item>Второй пункт</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </>
  );
}
