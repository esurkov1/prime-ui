/** Every side, and start / end alignment along the trigger; without room the chip flips and shifts, the arrow keeps pointing at the trigger — `side`, `align`. */
import { Button, Tooltip } from "prime-ui-kit";

const PLACEMENTS = [
  { side: "top", align: "center" },
  { side: "bottom", align: "center" },
  { side: "left", align: "center" },
  { side: "right", align: "center" },
  { side: "bottom", align: "start" },
  { side: "bottom", align: "end" },
] as const;

export default function TooltipPlacementExample() {
  return (
    <Tooltip.Provider>
      {PLACEMENTS.map(({ side, align }) => (
        <Tooltip.Root key={`${side}-${align}`}>
          <Tooltip.Trigger>
            <Button.Root variant="soft" tone="neutral">
              {side} · {align}
            </Button.Root>
          </Tooltip.Trigger>
          <Tooltip.Content side={side} align={align}>
            Выгрузка займёт около минуты
          </Tooltip.Content>
        </Tooltip.Root>
      ))}
    </Tooltip.Provider>
  );
}
