/** The show delay of one tooltip: at once, the default 400 ms and one second — `delayDuration`. */
import { Button, Tooltip } from "prime-ui-kit";

const DELAYS = [
  { label: "Сразу", delay: 0 },
  { label: "400 мс", delay: 400 },
  { label: "1 секунда", delay: 1000 },
];

export default function TooltipDelayExample() {
  return (
    <>
      {DELAYS.map(({ label, delay }) => (
        <Tooltip.Root key={label} delayDuration={delay}>
          <Tooltip.Trigger>
            <Button.Root variant="soft" tone="neutral">
              {label}
            </Button.Root>
          </Tooltip.Trigger>
          <Tooltip.Content>Черновик сохранится на сервере</Tooltip.Content>
        </Tooltip.Root>
      ))}
    </>
  );
}
