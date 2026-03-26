import { Button } from "@/components/button/Button";
import { Popover } from "@/components/popover/Popover";

import preview from "./preview.module.css";

export default function PopoverFullWidthSnippet() {
  return (
    <div className={preview.narrowColumn}>
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button.Root
            className={preview.fullWidthTrigger}
            mode="stroke"
            size="m"
            variant="neutral"
          >
            Ширина как у кнопки
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content
          align="start"
          insetGap="x3"
          insetPadding="x2"
          sameMinWidthAsTrigger
          side="bottom"
          size="m"
        >
          <p className={preview.panelTextMuted}>
            <code>sameMinWidthAsTrigger</code> задаёт ширину панели по триггеру (с переносом текста)
            — удобно в узких колонках и карточках.
          </p>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
