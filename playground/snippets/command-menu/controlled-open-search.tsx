import { Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { CommandMenu } from "@/components/command-menu/CommandMenu";

import cmdStyles from "@/components/command-menu/CommandMenu.module.css";
import { Typography } from "@/components/typography/Typography";

export default function CommandMenuControlledSnippet() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--prime-sys-spacing-x2)" }}>
        <Typography.Root size="s" tone="muted">
          Снаружи: «{query || "…"}»
        </Typography.Root>
        <Button.Root size="m" variant="primary" onClick={() => setOpen(true)}>
          Открыть с внешней строкой
        </Button.Root>
      </div>

      <CommandMenu.Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setQuery("");
        }}
        size="l"
      >
        <CommandMenu.InputRow
          leading={<Search className={cmdStyles.inputIcon} strokeWidth={2} aria-hidden />}
        >
          <CommandMenu.Input
            placeholder="Поиск синхронизирован…"
            aria-label="Поиск"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Group heading="Команды">
            <CommandMenu.Item
              value="сбросить фильтр"
              keywords="clear reset"
              onSelect={() => {
                setQuery("");
              }}
            >
              Сбросить фильтр
            </CommandMenu.Item>
            <CommandMenu.Item value="готово" onSelect={() => setOpen(false)}>
              Закрыть палитру
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Dialog>
    </>
  );
}
