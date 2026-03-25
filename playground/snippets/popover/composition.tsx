import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/button/Button";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { Popover } from "@/components/popover/Popover";
import { Typography } from "@/components/typography/Typography";

import preview from "./preview.module.css";

export default function PopoverCompositionSnippet() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" size="m" variant="neutral">
          <Button.Icon>
            <SlidersHorizontal aria-hidden strokeWidth={1.75} />
          </Button.Icon>
          Фильтры отчёта
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" side="bottom" size="m">
        <Popover.Inset>
          <div className={preview.compositionHeader}>
            <Filter aria-hidden className={preview.headerIcon} strokeWidth={1.75} />
            <Typography.Root as="span" size="s" weight="semibold">
              Быстрый отбор
            </Typography.Root>
          </div>
          <Typography.Root as="p" className={preview.panelTextMuted} size="s">
            Иконка на триггере, заголовок и текст внутри <code>Popover.Inset</code> с колонкой и
            зазорами.
          </Typography.Root>
          <div className={preview.checkboxStack}>
            <Checkbox.Root size="m" defaultChecked>
              <Checkbox.Label>Только активные</Checkbox.Label>
            </Checkbox.Root>
            <Checkbox.Root size="m">
              <Checkbox.Label>Скрыть нулевые</Checkbox.Label>
            </Checkbox.Root>
          </div>
        </Popover.Inset>
      </Popover.Content>
    </Popover.Root>
  );
}
