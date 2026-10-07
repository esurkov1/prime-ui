/** A visible DialogTitle and DialogDescription, a trailing slot with Kbd and a close button, removable scope tags and footer hints. Use when the palette needs a heading or a search scope. */
import { FileText, Settings, Sparkles, X } from "lucide-react";
import { Button, CommandMenu, Kbd, Tag } from "prime-ui-kit";
import * as React from "react";

export default function CommandMenuCompositionExample() {
  const titleId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [scopes, setScopes] = React.useState(["Документы", "Команды"]);
  const close = () => setOpen(false);

  return (
    <>
      <Button.Root variant="soft" tone="neutral" onClick={() => setOpen(true)}>
        Палитра с областью поиска
      </Button.Root>

      <CommandMenu.Dialog open={open} onOpenChange={setOpen} aria-labelledby={titleId}>
        <CommandMenu.DialogTitle id={titleId}>Палитра</CommandMenu.DialogTitle>
        <CommandMenu.DialogDescription>
          Поиск по разделам и быстрые действия
        </CommandMenu.DialogDescription>

        <CommandMenu.InputRow
          trailing={
            <>
              <Kbd.Root>⌘K</Kbd.Root>
              <Button.Root
                variant="ghost"
                tone="neutral"
                size="s"
                aria-label="Закрыть"
                onClick={close}
              >
                <Button.Icon>
                  <X />
                </Button.Icon>
              </Button.Root>
            </>
          }
        >
          <CommandMenu.Input placeholder="Куда перейти" aria-label="Поиск" />
        </CommandMenu.InputRow>

        <CommandMenu.TagSection>
          <CommandMenu.TagSectionLabel>Область поиска</CommandMenu.TagSectionLabel>
          <CommandMenu.TagRow>
            {scopes.map((scope) => (
              <Tag.Root
                labels={{ remove: `Убрать «${scope}»` }}
                key={scope}
                onRemove={() => setScopes((prev) => prev.filter((x) => x !== scope))}
              >
                {scope}
              </Tag.Root>
            ))}
          </CommandMenu.TagRow>
        </CommandMenu.TagSection>

        <CommandMenu.List>
          <CommandMenu.Empty />
          <CommandMenu.Group heading="Файл">
            <CommandMenu.Item value="новый документ" onSelect={close}>
              <CommandMenu.ItemIcon as={FileText} />
              Новый документ
              <CommandMenu.ItemShortcut>⌘N</CommandMenu.ItemShortcut>
            </CommandMenu.Item>
          </CommandMenu.Group>
          <CommandMenu.Group heading="Система">
            <CommandMenu.Item value="настройки" keywords="preferences profile" onSelect={close}>
              <CommandMenu.ItemIcon as={Settings} />
              Настройки
            </CommandMenu.Item>
            <CommandMenu.Item value="подсказки" keywords="help tips" onSelect={close}>
              <CommandMenu.ItemIcon as={Sparkles} />
              Подсказки
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>

        <CommandMenu.Footer>
          <CommandMenu.FooterHint keys={["↵"]}>Открыть</CommandMenu.FooterHint>
          <CommandMenu.FooterHint keys={["Esc"]}>Закрыть</CommandMenu.FooterHint>
          <span>
            <CommandMenu.FooterKeyBox variant="ghost">⌘K</CommandMenu.FooterKeyBox> — открыть снова
          </span>
        </CommandMenu.Footer>
      </CommandMenu.Dialog>
    </>
  );
}
