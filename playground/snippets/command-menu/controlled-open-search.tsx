import { Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { CommandMenu } from "@/components/command-menu/CommandMenu";

import { Typography } from "@/components/typography/Typography";

const inputIconStyle: React.CSSProperties = {
  width: "var(--prime-sys-size-control-m-icon)",
  height: "var(--prime-sys-size-control-m-icon)",
  color: "var(--prime-sys-color-content-muted)",
  flexShrink: 0,
};

export default function CommandMenuControlledSnippet() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  return (
    <>
      <div className="typographyScaleRow">
        <Typography.Root variant="body-small" tone="muted">
          Снаружи: «{query || "…"}»
        </Typography.Root>
        <Button.Root variant="primary" onClick={() => setOpen(true)}>
          Открыть с внешней строкой
        </Button.Root>
      </div>

      <CommandMenu.Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setQuery("");
        }}
      >
        <CommandMenu.InputRow
          leading={<Search style={inputIconStyle} strokeWidth={2} aria-hidden />}
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
