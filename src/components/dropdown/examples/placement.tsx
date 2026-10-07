/** Every side and alignment relative to the trigger; near the viewport edge the menu flips and shifts — `side`, `align`. */
import { Button, Dropdown } from "prime-ui-kit";

const PLACEMENTS = [
  { side: "bottom", align: "start" },
  { side: "bottom", align: "center" },
  { side: "bottom", align: "end" },
  { side: "top", align: "start" },
  { side: "top", align: "center" },
  { side: "top", align: "end" },
  { side: "left", align: "start" },
  { side: "right", align: "start" },
] as const;

export default function DropdownPlacementExample() {
  return (
    <>
      {PLACEMENTS.map(({ side, align }) => (
        <Dropdown.Root key={`${side}-${align}`}>
          <Dropdown.Trigger>
            <Button.Root variant="soft" tone="neutral">
              {side} · {align}
            </Button.Root>
          </Dropdown.Trigger>
          <Dropdown.Content side={side} align={align}>
            <Dropdown.Item>Экспорт в PDF и печатная версия</Dropdown.Item>
            <Dropdown.Item>Дублировать в проект</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      ))}
    </>
  );
}
