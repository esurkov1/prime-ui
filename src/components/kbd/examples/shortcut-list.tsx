/** A hotkey reference: the action, then its keys, one of them with an icon inside — `aria-label`, `title`. */
import { DescriptionList, Icon, Kbd } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Accessible names for symbol keys. */
const KEY_NAMES: Partial<Record<string, string>> = { "⌘": "Command" };

const SHORTCUTS = [
  { action: "Открыть палитру команд", keys: ["⌘", "K"] },
  { action: "Сохранить черновик", keys: ["⌘", "S"] },
  { action: "Перейти к поиску", keys: ["/"] },
] as const;

export default function KbdShortcutListExample() {
  return (
    <DescriptionList.Root>
      {SHORTCUTS.map((item) => (
        <DescriptionList.Item key={item.action} label={item.action}>
          <span className={styles.chord}>
            {item.keys.map((key) => (
              <Kbd key={key} aria-label={KEY_NAMES[key]} title={KEY_NAMES[key]}>
                {key}
              </Kbd>
            ))}
          </span>
        </DescriptionList.Item>
      ))}
      <DescriptionList.Item label="Закрыть окно">
        <Kbd>
          <Icon name="action.close" />
          Esc
        </Kbd>
      </DescriptionList.Item>
    </DescriptionList.Root>
  );
}
