/** A formatting toolbar in one group: after the first tooltip the neighbours open at once, each with its name and shortcut — `Tooltip.Provider`. */
import { Bold, Italic, Link2, List, Underline } from "lucide-react";
import { Button, Kbd, Tooltip } from "prime-ui-kit";

import styles from "./examples.module.css";

const TOOLS = [
  { icon: Bold, label: "Жирный", keys: "⌘B" },
  { icon: Italic, label: "Курсив", keys: "⌘I" },
  { icon: Underline, label: "Подчёркнутый", keys: "⌘U" },
  { icon: List, label: "Список", keys: "⌘⇧8" },
  { icon: Link2, label: "Ссылка", keys: "⌘K" },
] as const;

export default function TooltipToolbarExample() {
  return (
    <Tooltip.Provider>
      <div className={styles.toolbar} role="toolbar" aria-label="Форматирование">
        {TOOLS.map(({ icon: ToolIcon, label, keys }) => (
          <Tooltip.Root key={label}>
            <Tooltip.Trigger>
              <Button.Root variant="ghost" tone="neutral" size="s" aria-label={label}>
                <Button.Icon>
                  <ToolIcon />
                </Button.Icon>
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content size="s" side="bottom">
              {label} <Kbd>{keys}</Kbd>
            </Tooltip.Content>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  );
}
