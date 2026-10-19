/** Every size tier with a header and actions; the tier is the panel's own, set on `Popover.Content`, not taken from its trigger — `size`. */
import { Button, Popover, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function PopoverSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <Popover.Root>
            <Popover.Trigger>
              <Button.Root variant="soft" tone="neutral" size={size}>
                Сохранить фильтр
              </Button.Root>
            </Popover.Trigger>
            <Popover.Content size={size}>
              <Popover.Header>
                <Popover.Title>Сохранить фильтр?</Popover.Title>
                <Popover.Description>Он появится в списке слева.</Popover.Description>
              </Popover.Header>
              <Popover.Actions>
                <Popover.Close>
                  <Button.Root variant="soft" tone="neutral" size={size}>
                    Отмена
                  </Button.Root>
                </Popover.Close>
                <Popover.Close>
                  <Button.Root size={size}>Сохранить</Button.Root>
                </Popover.Close>
              </Popover.Actions>
            </Popover.Content>
          </Popover.Root>
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
        </div>
      ))}
    </div>
  );
}
