/** Popover.Content at every size tier xs → xl with a header and actions. Give the panel the same size as its trigger. */
import { Button, Popover } from "prime-ui-kit";
import preview from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function PopoverSizesExample() {
  return (
    <div className={preview.row}>
      {SIZES.map((size) => (
        <Popover.Root key={size}>
          <Popover.Trigger>
            <Button.Root variant="soft" tone="neutral" size={size}>
              Размер {size}
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content size={size}>
            <Popover.Header>
              <Popover.Title>Сохранить фильтр?</Popover.Title>
              <Popover.Description>Он появится в списке слева.</Popover.Description>
            </Popover.Header>
            <Popover.Actions>
              <Button.Root variant="ghost" tone="neutral" size={size}>
                Отмена
              </Button.Root>
              <Button.Root size={size}>Сохранить</Button.Root>
            </Popover.Actions>
          </Popover.Content>
        </Popover.Root>
      ))}
    </div>
  );
}
