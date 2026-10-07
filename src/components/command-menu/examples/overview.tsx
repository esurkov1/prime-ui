/** A button or ⌘K opens the palette: the query filters the groups by value and keywords, Enter runs the active command — `CommandMenu.Item`, `keywords`. */
import { Button, CommandMenu, Icon } from "prime-ui-kit";
import * as React from "react";

export default function CommandMenuOverviewExample() {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Button.Root variant="soft" tone="neutral" onClick={() => setOpen(true)}>
        Поиск по приложению · ⌘K
      </Button.Root>
      <CommandMenu.Root open={open} onOpenChange={setOpen} aria-label="Поиск по приложению">
        <CommandMenu.Input placeholder="Попробуйте «отчёт» или «billing»" />
        <CommandMenu.List>
          <CommandMenu.Empty />
          <CommandMenu.Group label="Страницы">
            <CommandMenu.Item value="дашборд" keywords="home главная" onSelect={close}>
              <CommandMenu.ItemIcon>
                <Icon name="nav.dashboard" />
              </CommandMenu.ItemIcon>
              Дашборд
            </CommandMenu.Item>
            <CommandMenu.Item value="отчёты" keywords="analytics аналитика" onSelect={close}>
              <CommandMenu.ItemIcon>
                <Icon name="object.document" />
              </CommandMenu.ItemIcon>
              Отчёты
            </CommandMenu.Item>
            <CommandMenu.Item value="команда" keywords="people users" onSelect={close}>
              <CommandMenu.ItemIcon>
                <Icon name="object.users" />
              </CommandMenu.ItemIcon>
              Команда
            </CommandMenu.Item>
          </CommandMenu.Group>
          <CommandMenu.Group label="Настройки">
            <CommandMenu.Item value="счета и оплата" keywords="billing invoices" onSelect={close}>
              <CommandMenu.ItemIcon>
                <Icon name="object.receipt" />
              </CommandMenu.ItemIcon>
              Счета и оплата
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Root>
    </>
  );
}
