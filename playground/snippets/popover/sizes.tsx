import { Button } from "@/components/button/Button";
import { Popover } from "@/components/popover/Popover";

import preview from "./preview.module.css";

const sizes = ["s", "m", "l", "xl"] as const;

export default function PopoverSizesSnippet() {
  return (
    <div className={preview.sizesRow}>
      {sizes.map((size) => (
        <Popover.Root key={size}>
          <Popover.Trigger asChild>
            <Button.Root mode="stroke" variant="neutral">
              Размер {size}
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content align="start" side="bottom" size={size}>
            <p className={preview.panelTextMuted}>
              Панель с <code>size=&quot;{size}&quot;</code>: поля панели и кегль текста из яруса
              контрола (<code>ControlSizeProvider</code> для вложенных контролов).
            </p>
          </Popover.Content>
        </Popover.Root>
      ))}
    </div>
  );
}
