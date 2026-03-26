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
            <Button.Root mode="stroke" size="m" variant="neutral">
              Размер {size}
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content align="start" insetGap="x2" insetPadding="x2" side="bottom" size={size}>
            <p className={preview.panelTextMuted}>
              Панель с <code>size=&quot;{size}&quot;</code>: отступы, минимальная ширина и кегль
              текста из яруса контрола.
            </p>
          </Popover.Content>
        </Popover.Root>
      ))}
    </div>
  );
}
