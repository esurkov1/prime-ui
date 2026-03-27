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

const footerMutedStyle: React.CSSProperties = {
  background: "var(--prime-sys-color-surface-default)",
};

export default function CommandMenuStatesSnippet() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root variant="neutral" mode="stroke" onClick={() => setOpen(true)}>
        Состояния пунктов
      </Button.Root>

      <CommandMenu.Dialog open={open} onOpenChange={setOpen}>
        <CommandMenu.InputRow
          leading={<Search style={inputIconStyle} strokeWidth={2} aria-hidden />}
        >
          <CommandMenu.Input placeholder="Введите «архив»…" aria-label="Фильтр команд" />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Group heading="Доступно">
            <CommandMenu.Item
              value="активный проект"
              keywords="workspace"
              onSelect={() => setOpen(false)}
            >
              Открыть активный проект
            </CommandMenu.Item>
            <CommandMenu.Item value="" keywords="" onSelect={() => setOpen(false)}>
              Подсказка: пустой value — пункт не фильтруется по строке поиска
            </CommandMenu.Item>
          </CommandMenu.Group>
          <CommandMenu.Group heading="Недоступно">
            <CommandMenu.Item
              value="архив только для чтения"
              keywords="archive"
              disabled
              onSelect={() => setOpen(false)}
            >
              Архив (только просмотр)
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
        <CommandMenu.Footer style={footerMutedStyle}>
          <Typography.Root variant="body-compact" tone="muted">
            Если ни один пункт не проходит фильтр, группы скрываются; пустое состояние можно
            дорисовать под списком вручную.
          </Typography.Root>
        </CommandMenu.Footer>
      </CommandMenu.Dialog>
    </>
  );
}
