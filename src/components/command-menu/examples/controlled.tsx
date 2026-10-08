/** The parent owns the query: it shows the text outside and a command resets it; the palette clears it on close — `value`, `onValueChange`. */
import { Button, CommandMenu, Typography } from "prime-ui-kit";
import * as React from "react";

export default function CommandMenuControlledExample() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  return (
    <>
      <Button.Root variant="soft" tone="neutral" onClick={() => setOpen(true)}>
        Найти отчёт
      </Button.Root>
      <Typography as="span" variant="body-s" tone="secondary">
        Запрос: «{query || "…"}»
      </Typography>
      <CommandMenu.Root
        open={open}
        onOpenChange={setOpen}
        value={query}
        onValueChange={setQuery}
        aria-label="Поиск по отчётам"
      >
        <CommandMenu.Input placeholder="Название отчёта" />
        <CommandMenu.List>
          <CommandMenu.Empty />
          <CommandMenu.Group label="Отчёты">
            <CommandMenu.Item value="выручка по месяцам">Выручка по месяцам</CommandMenu.Item>
            <CommandMenu.Item value="воронка продаж">Воронка продаж</CommandMenu.Item>
            <CommandMenu.Item
              value="очистить запрос"
              keywords="clear"
              onSelect={() => setQuery("")}
            >
              Очистить запрос
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Root>
    </>
  );
}
