/** `side` (bottom · top) and `align` (start · center · end). Near the viewport edge the panel flips and shifts automatically. */
import { Button, Popover, Typography } from "prime-ui-kit";

import preview from "./examples.module.css";

const PLACEMENTS = [
  { label: "Снизу · начало", side: "bottom", align: "start" },
  { label: "Снизу · центр", side: "bottom", align: "center" },
  { label: "Снизу · конец", side: "bottom", align: "end" },
  { label: "Сверху · начало", side: "top", align: "start" },
] as const;

export default function PopoverPlacementExample() {
  return (
    <div className={preview.row}>
      {PLACEMENTS.map(({ label, side, align }) => (
        <Popover.Root key={label}>
          <Popover.Trigger>
            <Button.Root variant="soft" tone="neutral">
              {label}
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content side={side} align={align}>
            <Typography.Root variant="body-s" tone="secondary" className={preview.text}>
              side=&quot;{side}&quot;, align=&quot;{align}&quot;
            </Typography.Root>
          </Popover.Content>
        </Popover.Root>
      ))}
    </div>
  );
}
