/** The four `side` values. `side` is a preference: without room the tooltip flips to the opposite side and shifts away from the viewport edge. */
import { Button, Tooltip } from "prime-ui-kit";
import styles from "./examples.module.css";

const SIDES = [
  { side: "top", label: "Сверху" },
  { side: "bottom", label: "Снизу" },
  { side: "left", label: "Слева" },
  { side: "right", label: "Справа" },
] as const;

export default function TooltipSideExample() {
  return (
    <Tooltip.Provider delayDuration={200}>
      <div className={styles.row}>
        {SIDES.map(({ side, label }) => (
          <Tooltip.Root key={side}>
            <Tooltip.Trigger>
              <Button.Root variant="soft" tone="neutral">
                {label}
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content side={side}>side=&quot;{side}&quot;</Tooltip.Content>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  );
}
