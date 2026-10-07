/** Every size tier with a header and actions; the panel takes the tier of its trigger — `size`. */
import { Button, Popover } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function PopoverSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <Popover.Root key={size}>
          <Popover.Trigger>
            <Button.Root variant="soft" tone="neutral" size={size}>
              {size}
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content size={size}>
            <Popover.Header>
              <Popover.Title>Сохранить фильтр?</Popover.Title>
              <Popover.Description>Он появится в списке слева.</Popover.Description>
            </Popover.Header>
            <Popover.Actions>
              <Popover.Close>
                <Button.Root variant="ghost" tone="neutral" size={size}>
                  Отмена
                </Button.Root>
              </Popover.Close>
              <Popover.Close>
                <Button.Root size={size}>Сохранить</Button.Root>
              </Popover.Close>
            </Popover.Actions>
          </Popover.Content>
        </Popover.Root>
      ))}
    </>
  );
}
