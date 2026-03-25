import * as React from "react";

import { Button } from "@/components/button/Button";
import { Switch } from "@/components/switch/Switch";
import { Tooltip } from "@/components/tooltip/Tooltip";

export default function TooltipControlledSnippet() {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ display: "grid", gap: "var(--prime-sys-spacing-l)", maxWidth: 360 }}>
      <Switch.Root size="m" checked={open} onCheckedChange={setOpen}>
        <Switch.Label>Подсказка открыта программно</Switch.Label>
        <Switch.Hint>
          Состояние синхронизируется с <code>open</code> и <code>onOpenChange</code> на{" "}
          <code>Tooltip.Root</code>; наведение на кнопку тоже обновляет то же состояние.
        </Switch.Hint>
      </Switch.Root>
      <Tooltip.Provider delayDuration={0}>
        <Tooltip.Root open={open} onOpenChange={setOpen}>
          <Tooltip.Trigger>
            <Button.Root type="button" variant="neutral" mode="stroke" size="m">
              Триггер
            </Button.Root>
          </Tooltip.Trigger>
          <Tooltip.Content>Контролируемая подсказка</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
}
