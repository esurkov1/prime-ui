/** Controlled palette and query: `open` / `onOpenChange` on the Dialog and `value` / `onChange` on the Input, with items that clear the query or close the palette. Use when the parent must read or reset the search text. */
import { Button, CommandMenu, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function CommandMenuControlledExample() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  return (
    <>
      <div className={styles.row}>
        <Button.Root variant="soft" tone="neutral" onClick={() => setOpen(true)}>
          Открыть
        </Button.Root>
        <Typography.Root as="span" variant="body-s" tone="secondary">
          Запрос у родителя: «{query || "…"}»
        </Typography.Root>
      </div>

      <CommandMenu.Dialog open={open} onOpenChange={setOpen} aria-label="Команды">
        <CommandMenu.InputRow>
          <CommandMenu.Input
            placeholder="Начните вводить"
            aria-label="Поиск команд"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Empty />
          <CommandMenu.Group heading="Команды">
            <CommandMenu.Item
              value="очистить запрос"
              keywords="clear"
              onSelect={() => setQuery("")}
            >
              Очистить запрос
            </CommandMenu.Item>
            <CommandMenu.Item value="закрыть" onSelect={() => setOpen(false)}>
              Закрыть палитру
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Dialog>
    </>
  );
}
