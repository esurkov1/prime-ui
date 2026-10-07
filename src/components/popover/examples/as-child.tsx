/** A text-link button as the trigger: any single element can open the panel. Use for inline explanations of terms in text. */
import { Popover, Typography } from "prime-ui-kit";

import preview from "./examples.module.css";

export default function PopoverAsChildExample() {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <button type="button" className={preview.textLinkTrigger}>
          <Typography.Root
            as="span"
            variant="body-m"
            weight="medium"
            tone="accent"
            className={preview.underline}
          >
            Что такое НДС 0%?
          </Typography.Root>
        </button>
      </Popover.Trigger>
      <Popover.Content>
        <Typography.Root variant="body-s" tone="secondary" className={preview.text}>
          Ставка для экспорта товаров. Нужны подтверждающие документы в течение 180 дней.
        </Typography.Root>
      </Popover.Content>
    </Popover.Root>
  );
}
