/** A hotkey reference: action on the left, its keys on the right, an icon inside a key. */
import { Icon, Kbd, Typography } from "prime-ui-kit";

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
    <dl className={styles.list}>
      {SHORTCUTS.map((item) => (
        <div key={item.action} className={styles.listRow}>
          <dt>
            <Typography as="span" variant="body-m">
              {item.action}
            </Typography>
          </dt>
          <dd className={styles.chord}>
            {item.keys.map((key) => (
              <Kbd key={key} aria-label={KEY_NAMES[key]} title={KEY_NAMES[key]}>
                {key}
              </Kbd>
            ))}
          </dd>
        </div>
      ))}
      <div className={styles.listRow}>
        <dt>
          <Typography as="span" variant="body-m">
            Закрыть окно
          </Typography>
        </dt>
        <dd className={styles.chord}>
          <Kbd>
            <Icon name="action.close" />
            Esc
          </Kbd>
        </dd>
      </div>
    </dl>
  );
}
