/** The parent owns the open state and the query: it reads the text and a command resets it or closes the palette — `open`, `onOpenChange`, `value`, `onValueChange`. */
import { Button, CommandMenu, Typography } from "prime-ui-kit";
import * as React from "react";

export default function CommandMenuControlledOpenExample() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  return (
    <>
      <Button.Root variant="soft" tone="neutral" onClick={() => setOpen(true)}>
        Открыть команды
      </Button.Root>
      <Typography.Root as="span" variant="body-s" tone="secondary">
        Запрос: «{query || "…"}»
      </Typography.Root>
      <CommandMenu.Root open={open} onOpenChange={setOpen} aria-label="Команды">
        <CommandMenu.Input placeholder="Начните вводить" value={query} onValueChange={setQuery} />
        <CommandMenu.List>
          <CommandMenu.Empty />
          <CommandMenu.Group label="Команды">
            <CommandMenu.Item
              value="очистить запрос"
              keywords="clear"
              onSelect={() => setQuery("")}
            >
              Очистить запрос
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
