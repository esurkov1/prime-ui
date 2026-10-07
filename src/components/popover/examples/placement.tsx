/** Every side and alignment relative to the trigger; near the viewport edge the panel flips and shifts — `side`, `align`. */
import { Button, Popover, Typography } from "prime-ui-kit";

const PLACEMENTS = [
  { side: "bottom", align: "start" },
  { side: "bottom", align: "center" },
  { side: "bottom", align: "end" },
  { side: "top", align: "start" },
  { side: "top", align: "center" },
  { side: "top", align: "end" },
] as const;

export default function PopoverPlacementExample() {
  return (
    <>
      {PLACEMENTS.map(({ side, align }) => (
        <Popover.Root key={`${side}-${align}`}>
          <Popover.Trigger>
            <Button.Root variant="soft" tone="neutral">
              {side} · {align}
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content side={side} align={align}>
            <Typography.Root variant="body-s" tone="secondary">
              Срок оплаты счёта — 5 рабочих дней.
            </Typography.Root>
          </Popover.Content>
        </Popover.Root>
      ))}
    </>
  );
}
