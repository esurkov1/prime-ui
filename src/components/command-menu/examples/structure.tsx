/** Optional parts: a visible title and description, a description line and a key hint in items, and a footer with key hints — `CommandMenu.Title`, `CommandMenu.ItemText`, `CommandMenu.ItemShortcut`, `CommandMenu.Footer`. */
import { Button, CommandMenu, Icon } from "prime-ui-kit";
import * as React from "react";

export default function CommandMenuStructureExample() {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <Button.Root variant="soft" tone="neutral" onClick={() => setOpen(true)}>
        Быстрые действия
      </Button.Root>
      <CommandMenu.Root open={open} onOpenChange={setOpen}>
        <CommandMenu.Title>Быстрые действия</CommandMenu.Title>
        <CommandMenu.Description>Создавайте документы и меняйте настройки</CommandMenu.Description>
        <CommandMenu.Input />
        <CommandMenu.List>
          <CommandMenu.Empty />
          <CommandMenu.Group label="Документы">
            <CommandMenu.Item value="новый счёт" keywords="invoice" onSelect={close}>
              <CommandMenu.ItemIcon>
                <Icon name="object.document" />
              </CommandMenu.ItemIcon>
              <CommandMenu.ItemText description="Черновик в разделе «Счета»">
                Новый счёт
              </CommandMenu.ItemText>
              <CommandMenu.ItemShortcut>⌘N</CommandMenu.ItemShortcut>
            </CommandMenu.Item>
            <CommandMenu.Item value="профиль" keywords="account" onSelect={close}>
              <CommandMenu.ItemIcon>
                <Icon name="action.settings" />
              </CommandMenu.ItemIcon>
              <CommandMenu.ItemText description="Имя, почта, пароль">Профиль</CommandMenu.ItemText>
              <CommandMenu.ItemShortcut>⌘,</CommandMenu.ItemShortcut>
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
        <CommandMenu.Footer>
          <CommandMenu.FooterHint
            keys={[
              <Icon key="up" name="nav.chevronUp" />,
              <Icon key="down" name="nav.chevronDown" />,
            ]}
          >
            Навигация
          </CommandMenu.FooterHint>
          <CommandMenu.FooterHint keys={["Enter"]}>Выбрать</CommandMenu.FooterHint>
          <CommandMenu.FooterHint keys={["Esc"]}>Закрыть</CommandMenu.FooterHint>
        </CommandMenu.Footer>
      </CommandMenu.Root>
    </>
  );
}
