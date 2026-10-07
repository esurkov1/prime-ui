/** Every size tier with icons, key hints and a destructive item; the menu takes the tier of its trigger — `size`. */
import { Button, Dropdown, Icon } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function DropdownSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <Dropdown.Root key={size}>
          <Dropdown.Trigger>
            <Button.Root variant="soft" tone="neutral" size={size}>
              {size}
            </Button.Root>
          </Dropdown.Trigger>
          <Dropdown.Content size={size}>
            <Dropdown.Item>
              <Dropdown.ItemIcon>
                <Icon name="action.copy" />
              </Dropdown.ItemIcon>
              Дублировать
              <Dropdown.ItemShortcut>⌘D</Dropdown.ItemShortcut>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon>
                <Icon name="action.download" />
              </Dropdown.ItemIcon>
              Скачать
              <Dropdown.ItemShortcut>⌘S</Dropdown.ItemShortcut>
            </Dropdown.Item>
            <Dropdown.Separator />
            <Dropdown.Item tone="danger">
              <Dropdown.ItemIcon>
                <Icon name="action.delete" />
              </Dropdown.ItemIcon>
              Удалить
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      ))}
    </>
  );
}
