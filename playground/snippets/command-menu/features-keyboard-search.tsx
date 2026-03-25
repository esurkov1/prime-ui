import { ArrowDown, ArrowUp, CornerDownLeft, Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { CommandMenu } from "@/components/command-menu/CommandMenu";

import cmdStyles from "@/components/command-menu/CommandMenu.module.css";

export default function CommandMenuFeaturesKeyboardSearchSnippet() {
  const [open, setOpen] = React.useState(false);

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
      <Button.Root size="m" variant="primary" onClick={() => setOpen(true)}>
        Открыть (или ⌘K / Ctrl+K)
      </Button.Root>

      <CommandMenu.Dialog open={open} onOpenChange={setOpen} size="l">
        <CommandMenu.InputRow
          leading={<Search className={cmdStyles.inputIcon} strokeWidth={2} aria-hidden />}
        >
          <CommandMenu.Input
            placeholder="Попробуйте «аналитика» или «billing»…"
            aria-label="Поиск команд"
          />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Group heading="Страницы">
            <CommandMenu.Item value="дашборд" keywords="home main" onSelect={() => setOpen(false)}>
              Главный дашборд
            </CommandMenu.Item>
            <CommandMenu.Item
              value="отчёты"
              keywords="analytics charts graphs"
              onSelect={() => setOpen(false)}
            >
              Аналитика и отчёты
            </CommandMenu.Item>
          </CommandMenu.Group>
          <CommandMenu.Group heading="Биллинг">
            <CommandMenu.Item
              value="счета"
              keywords="billing invoices money"
              onSelect={() => setOpen(false)}
            >
              Счета и оплата
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
        <CommandMenu.Footer>
          <div
            style={{ display: "flex", gap: "var(--prime-sys-spacing-x3)", alignItems: "center" }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "var(--prime-sys-spacing-x2)" }}
            >
              <CommandMenu.FooterKeyBox>
                <ArrowUp size={14} strokeWidth={2} aria-hidden />
              </CommandMenu.FooterKeyBox>
              <CommandMenu.FooterKeyBox>
                <ArrowDown size={14} strokeWidth={2} aria-hidden />
              </CommandMenu.FooterKeyBox>
              <span className={cmdStyles.footerHint}>Навигация</span>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "var(--prime-sys-spacing-x2)" }}
            >
              <CommandMenu.FooterKeyBox>
                <CornerDownLeft size={14} strokeWidth={2} aria-hidden />
              </CommandMenu.FooterKeyBox>
              <span className={cmdStyles.footerHint}>Выбрать</span>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "var(--prime-sys-spacing-x2)" }}
            >
              <CommandMenu.FooterKeyBox tone="muted">Esc</CommandMenu.FooterKeyBox>
              <span className={cmdStyles.footerHint}>Закрыть</span>
            </div>
          </div>
        </CommandMenu.Footer>
      </CommandMenu.Dialog>
    </>
  );
}
