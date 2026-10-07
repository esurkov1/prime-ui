/** Shortcut reference: one `Kbd.Root` per key in a chord, a key with an icon and text. Use for help panels and settings pages listing hotkeys. */
import { Icon, Kbd, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Accessible names for symbol keys. */
const keyNames: Partial<Record<string, string>> = { "⌘": "Command" };

const shortcuts = [
  { action: "Открыть палитру команд", keys: ["⌘", "K"] },
  { action: "Сохранить черновик", keys: ["⌘", "S"] },
  { action: "Перейти к поиску", keys: ["/"] },
] as const;

export default function KbdShortcutListExample() {
  return (
    <dl className={styles.list}>
      {shortcuts.map((item) => (
        <div key={item.action} className={styles.listRow}>
          <dt>
            <Typography.Root as="span" variant="body-m">
              {item.action}
            </Typography.Root>
          </dt>
          <dd className={styles.chord}>
            {item.keys.map((key) => (
              <Kbd.Root key={key} aria-label={keyNames[key]} title={keyNames[key]}>
                {key}
              </Kbd.Root>
            ))}
          </dd>
        </div>
      ))}
      <div className={styles.listRow}>
        <dt>
          <Typography.Root as="span" variant="body-m">
            Закрыть окно
          </Typography.Root>
        </dt>
        <dd className={styles.chord}>
          <Kbd.Root>
            <Icon name="action.close" />
            Esc
          </Kbd.Root>
        </dd>
      </div>
    </dl>
  );
}
