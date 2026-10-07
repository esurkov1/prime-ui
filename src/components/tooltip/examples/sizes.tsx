/** Tooltip.Content at every size tier xs → xl next to buttons of the same size. Pick the tier of the control the tooltip describes. */
import { Button, Tooltip } from "prime-ui-kit";
import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function TooltipSizesExample() {
  return (
    <Tooltip.Provider delayDuration={200}>
      <div className={styles.row}>
        {SIZES.map((size) => (
          <Tooltip.Root key={size}>
            <Tooltip.Trigger>
              <Button.Root variant="soft" tone="neutral" size={size}>
                Размер {size}
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content size={size}>Подсказка размера {size}</Tooltip.Content>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  );
}
