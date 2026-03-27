import { Button } from "@/components/button/Button";
import { Popover } from "@/components/popover/Popover";

import preview from "./preview.module.css";

export default function PopoverStatesSnippet() {
  return (
    <div className={preview.sizesRow}>
      <Popover.Root defaultOpen>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" variant="neutral">
            Старт открыт
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content align="start" side="bottom">
          <p className={preview.panelTextMuted}>
            <code>defaultOpen</code> на корне — начальное открытие без внешнего состояния.
          </p>
        </Popover.Content>
      </Popover.Root>

      <Popover.Root>
        <Popover.Trigger asChild>
          <Button.Root disabled mode="stroke" variant="neutral">
            Триггер недоступен
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content align="start" side="bottom">
          <p className={preview.panelTextMuted}>Панель не откроется: кнопка с disabled.</p>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
