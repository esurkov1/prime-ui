/** The parent owns the open state: a button opens the palette and a command closes it — `open`, `onOpenChange`. */
import { Button, CommandMenu } from "prime-ui-kit";
import * as React from "react";

export default function CommandMenuControlledOpenExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root variant="soft" tone="neutral" onClick={() => setOpen(true)}>
        Открыть команды
      </Button.Root>
      <CommandMenu.Root open={open} onOpenChange={setOpen} aria-label="Команды">
        <CommandMenu.Input placeholder="Начните вводить" />
        <CommandMenu.List>
          <CommandMenu.Empty />
          <CommandMenu.Group label="Команды">
            <CommandMenu.Item value="новый проект" onSelect={() => setOpen(false)}>
              Новый проект
            </CommandMenu.Item>
            <CommandMenu.Item value="закрыть палитру" onSelect={() => setOpen(false)}>
              Закрыть палитру
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Root>
    </>
  );
}
