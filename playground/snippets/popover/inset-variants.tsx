import { Button } from "@/components/button/Button";
import { Popover } from "@/components/popover/Popover";

import preview from "./preview.module.css";

export default function PopoverInsetVariantsSnippet() {
  return (
    <div className={preview.sizesRow}>
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" size="m" variant="neutral">
            padding: none
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content size="m">
          <Popover.Inset padding="none" gap="none">
            <p className={preview.flushText}>Контент вплотную к скруглению панели.</p>
          </Popover.Inset>
        </Popover.Content>
      </Popover.Root>

      <Popover.Root>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" size="m" variant="neutral">
            padding: x2
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content size="m">
          <Popover.Inset padding="x2" gap="x2">
            <p className={preview.panelTextMuted}>Значения по умолчанию для Inset.</p>
          </Popover.Inset>
        </Popover.Content>
      </Popover.Root>

      <Popover.Root>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" size="m" variant="neutral">
            padding: x3
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content size="m">
          <Popover.Inset padding="x3" gap="x4">
            <p className={preview.panelTextMuted}>Больше воздуха между блоками (gap x4).</p>
            <p className={preview.panelTextMuted}>Второй абзац показывает вертикальный зазор.</p>
          </Popover.Inset>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
