/** `delayDuration` per Tooltip.Root: instant, default 400 ms and one second. Set it on Tooltip.Provider for a whole area or on one Root. */
import { Button, Tooltip } from "prime-ui-kit";
import styles from "./examples.module.css";

export default function TooltipDelayExample() {
  return (
    <div className={styles.row}>
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger>
          <Button.Root variant="soft" tone="neutral">
            Сразу
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content>delayDuration=0</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Button.Root variant="soft" tone="neutral">
            По умолчанию
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content>400 мс</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root delayDuration={1000}>
        <Tooltip.Trigger>
          <Button.Root variant="soft" tone="neutral">
            Через секунду
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content>delayDuration=1000</Tooltip.Content>
      </Tooltip.Root>
    </div>
  );
}
