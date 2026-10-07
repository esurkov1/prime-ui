/** Editor toolbar of icon-only buttons: each has an `aria-label`, the tooltip repeats the name and shows the shortcut in Kbd. Use one Tooltip.Provider for a whole toolbar: after the first tooltip, neighbours open instantly. */

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

export default function TooltipCompositionExample() {
  return (
    <Tooltip.Provider delayDuration={300}>
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
              {label} <Kbd size="xs">{keys}</Kbd>
            </Tooltip.Content>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  );
}
