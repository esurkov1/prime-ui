/** A formatting toolbar in one group: after the first tooltip the neighbours open at once, each with its name and shortcut — `Tooltip.Provider`. */
import { Button, Icon, Kbd, Tooltip } from "prime-ui-kit";

import styles from "./examples.module.css";

const TOOLS = [
  { icon: "format.bold", label: "Жирный", keys: "⌘B" },
  { icon: "format.italic", label: "Курсив", keys: "⌘I" },
  { icon: "format.underline", label: "Подчёркнутый", keys: "⌘U" },
  { icon: "format.list", label: "Список", keys: "⌘⇧8" },
  { icon: "format.link", label: "Ссылка", keys: "⌘K" },
] as const;

export default function TooltipToolbarExample() {
  return (
    <Tooltip.Provider>
      <div className={styles.toolbar} role="toolbar" aria-label="Форматирование">
        {TOOLS.map(({ icon, label, keys }) => (
          <Tooltip.Root key={label}>
            <Tooltip.Trigger>
              <Button.Root variant="ghost" tone="neutral" size="s" aria-label={label}>
                <Button.Icon>
                  <Icon name={icon} />
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
