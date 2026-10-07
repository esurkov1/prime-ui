/** Dropdown.Content at every size tier xs → xl with icons, shortcuts and a danger item. Give the menu the same size as its trigger. */
import { Copy, Pencil, Trash2 } from "lucide-react";
import { Button, Dropdown } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function DropdownSizesExample() {
  return (
    <div className={styles.row}>
      {SIZES.map((size) => (
        <Dropdown.Root key={size}>
          <Dropdown.Trigger>
            <Button.Root variant="soft" tone="neutral" size={size}>
              Размер {size}
            </Button.Root>
          </Dropdown.Trigger>
          <Dropdown.Content size={size}>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={Pencil} />
              Переименовать
              <Dropdown.ItemShortcut>F2</Dropdown.ItemShortcut>
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={Copy} />
              Дублировать
              <Dropdown.ItemShortcut>⌘D</Dropdown.ItemShortcut>
            </Dropdown.Item>
            <Dropdown.Separator />
            <Dropdown.Item tone="danger">
              <Dropdown.ItemIcon as={Trash2} />
              Удалить
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      ))}
    </div>
  );
}
