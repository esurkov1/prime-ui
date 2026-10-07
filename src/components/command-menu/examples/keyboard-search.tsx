/** App palette opened with ⌘K / Ctrl+K: groups, filtering by `value` and `keywords`, a description line, shortcuts, the empty state and a keyboard legend. Use as the global search of an app. */
import {
  ArrowDown,
  ArrowUp,
  CornerDownLeft,
  FileText,
  LayoutDashboard,
  Receipt,
  Settings,
  Users,
} from "lucide-react";
import { Button, CommandMenu } from "prime-ui-kit";
import * as React from "react";

export default function CommandMenuKeyboardSearchExample() {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
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

      <CommandMenu.Dialog
        open={open}
        onOpenChange={setOpen}
        aria-label="Поиск по приложению"
        labels={{ emptyHint: "Проверьте раскладку или поищите по разделу" }}
      >
        <CommandMenu.InputRow>
          <CommandMenu.Input
            placeholder="Попробуйте «отчёт», «billing» или «xyz»"
            aria-label="Поиск команд"
          />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Empty />
          <CommandMenu.Group heading="Страницы">
            <CommandMenu.Item value="дашборд" keywords="home main главная" onSelect={close}>
              <CommandMenu.ItemIcon as={LayoutDashboard} />
              Дашборд
              <CommandMenu.ItemShortcut>G D</CommandMenu.ItemShortcut>
            </CommandMenu.Item>
            <CommandMenu.Item value="отчёты" keywords="analytics charts" onSelect={close}>
              <CommandMenu.ItemIcon as={FileText} />
              Аналитика и отчёты
              <CommandMenu.ItemShortcut>G R</CommandMenu.ItemShortcut>
            </CommandMenu.Item>
            <CommandMenu.Item value="команда" keywords="people users" onSelect={close}>
              <CommandMenu.ItemIcon as={Users} />
              Команда
            </CommandMenu.Item>
          </CommandMenu.Group>
          <CommandMenu.Group heading="Настройки">
            <CommandMenu.Item value="счета" keywords="billing invoices" onSelect={close}>
              <CommandMenu.ItemIcon as={Receipt} />
              <CommandMenu.ItemText description="Настройки → Оплата">
                Счета и оплата
              </CommandMenu.ItemText>
            </CommandMenu.Item>
            <CommandMenu.Item value="профиль" keywords="account profile" onSelect={close}>
              <CommandMenu.ItemIcon as={Settings} />
              <CommandMenu.ItemText description="Имя, почта, пароль">Профиль</CommandMenu.ItemText>
              <CommandMenu.ItemShortcut>⌘,</CommandMenu.ItemShortcut>
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
        <CommandMenu.Footer>
          <CommandMenu.FooterHint
            keys={[<ArrowUp key="up" aria-hidden />, <ArrowDown key="down" aria-hidden />]}
          >
            Навигация
          </CommandMenu.FooterHint>
          <CommandMenu.FooterHint keys={[<CornerDownLeft key="enter" aria-hidden />]}>
            Выбрать
          </CommandMenu.FooterHint>
          <CommandMenu.FooterHint keys={["Esc"]}>Закрыть</CommandMenu.FooterHint>
        </CommandMenu.Footer>
      </CommandMenu.Dialog>
    </>
  );
}
