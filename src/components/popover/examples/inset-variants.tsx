/** Panel density via `insetPadding` and `insetGap`: default, extra air and no gap. Use none/extra values only for custom layouts inside the panel. */
import { Button, Popover, Typography } from "prime-ui-kit";

import preview from "./examples.module.css";

export default function PopoverInsetVariantsExample() {
  return (
    <div className={preview.row}>
      <Popover.Root>
        <Popover.Trigger>
          <Button.Root variant="soft" tone="neutral">
            По умолчанию
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content>
          <Typography.Root variant="body-s" tone="secondary" className={preview.text}>
            Отступ панели по ярусу m — 16 px.
          </Typography.Root>
          <Typography.Root variant="body-s" tone="secondary" className={preview.text}>
            Зазор между блоками — 12 px.
          </Typography.Root>
        </Popover.Content>
      </Popover.Root>

      <Popover.Root>
        <Popover.Trigger>
          <Button.Root variant="soft" tone="neutral">
            insetPadding=&quot;x3&quot;
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content insetPadding="x3" insetGap="x4">
          <Typography.Root variant="body-s" tone="secondary" className={preview.text}>
            Больше воздуха вокруг содержимого.
          </Typography.Root>
          <Typography.Root variant="body-s" tone="secondary" className={preview.text}>
            И между абзацами (insetGap x4).
          </Typography.Root>
        </Popover.Content>
      </Popover.Root>

      <Popover.Root>
        <Popover.Trigger>
          <Button.Root variant="soft" tone="neutral">
            insetGap=&quot;none&quot;
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content insetGap="none">
          <Typography.Root variant="body-s" tone="secondary" className={preview.text}>
            Строки идут вплотную —
          </Typography.Root>
          <Typography.Root variant="body-s" tone="secondary" className={preview.text}>
            удобно для собственной разметки.
          </Typography.Root>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
