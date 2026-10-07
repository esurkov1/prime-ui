/** `align` start · center · end: the chip lines up with the trigger's edge or centre, and the arrow keeps pointing at the trigger. Use `start` / `end` for wide triggers and triggers near a container edge. */
import { Button, Tooltip } from "prime-ui-kit";
import styles from "./examples.module.css";

const ALIGNS = [
  { align: "start", label: "По началу" },
  { align: "center", label: "По центру" },
  { align: "end", label: "По концу" },
] as const;

export default function TooltipAlignExample() {
  return (
    <Tooltip.Provider delayDuration={200}>
      <div className={styles.column}>
        {ALIGNS.map(({ align, label }) => (
          <Tooltip.Root key={align}>
            <Tooltip.Trigger>
              <Button.Root variant="soft" tone="neutral" className={styles.wideTrigger}>
                {label}
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content side="bottom" align={align}>
              align=&quot;{align}&quot;
            </Tooltip.Content>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  );
}
