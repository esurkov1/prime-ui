import { Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { CommandMenu } from "@/components/command-menu/CommandMenu";

const inputIconStyle: React.CSSProperties = {
  width: "var(--prime-sys-size-control-m-icon)",
  height: "var(--prime-sys-size-control-m-icon)",
  color: "var(--prime-sys-color-content-muted)",
  flexShrink: 0,
};

type DensityDemo = "compact" | "comfortable";

export default function CommandMenuVariantsDensityItemsSnippet() {
  const [open, setOpen] = React.useState(false);
  const [density, setDensity] = React.useState<DensityDemo>("compact");

  return (
    <>
      <div className="previewRowWrap">
        <Button.Root
          variant="neutral"
          mode="stroke"
          onClick={() => {
            setDensity("compact");
            setOpen(true);
          }}
        >
          Плотность compact
        </Button.Root>
        <Button.Root
          variant="neutral"
          mode="stroke"
          onClick={() => {
            setDensity("comfortable");
            setOpen(true);
          }}
        >
          Плотность comfortable
        </Button.Root>
      </div>

      <CommandMenu.Dialog open={open} onOpenChange={setOpen}>
        <CommandMenu.InputRow
          density={density}
          leading={<Search style={inputIconStyle} strokeWidth={2} aria-hidden />}
        >
          <CommandMenu.Input placeholder="Поиск…" aria-label="Поиск" />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Group heading={`Пункты size="s"`}>
            <CommandMenu.Item value="короткий список" size="s" onSelect={() => setOpen(false)}>
              Компактная строка
            </CommandMenu.Item>
            <CommandMenu.Item value="ещё один s" size="s" onSelect={() => setOpen(false)}>
              Вторая компактная
            </CommandMenu.Item>
          </CommandMenu.Group>
          <CommandMenu.Group heading={`Пункты size="m"`}>
            <CommandMenu.Item value="высокая строка" onSelect={() => setOpen(false)}>
              Повышенная строка списка
            </CommandMenu.Item>
            <CommandMenu.Item value="ещё один m" onSelect={() => setOpen(false)}>
              Ещё один пункт размера m
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Dialog>
    </>
  );
}
