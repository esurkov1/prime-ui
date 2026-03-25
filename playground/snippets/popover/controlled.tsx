import * as React from "react";

import { Button } from "@/components/button/Button";
import { Popover } from "@/components/popover/Popover";
import { Typography } from "@/components/typography/Typography";

import preview from "./preview.module.css";

export default function PopoverControlledSnippet() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={preview.controlledRow}>
      <Typography.Root as="p" className={preview.stateLine} size="s" weight="medium">
        Панель {open ? "открыта" : "закрыта"}
      </Typography.Root>
      <div className={preview.sizesRow}>
        <Button.Root mode="stroke" size="m" variant="neutral" onClick={() => setOpen(true)}>
          Открыть извне
        </Button.Root>
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Button.Root mode="filled" size="m" variant="primary">
              Переключить триггером
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content align="start" side="bottom" size="m">
            <Popover.Inset>
              <p className={preview.panelTextMuted}>
                Состояние задаётся <code>open</code> и <code>onOpenChange</code> на{" "}
                <code>Popover.Root</code>.
              </p>
              <Button.Root mode="ghost" size="m" variant="neutral" onClick={() => setOpen(false)}>
                Закрыть
              </Button.Root>
            </Popover.Inset>
          </Popover.Content>
        </Popover.Root>
      </div>
    </div>
  );
}
