/** Without `size` a key inside Button or Input takes the tier one step down (button m → Kbd s); an explicit `size` overrides it. Use for shortcut hints in buttons and search fields. */
import { Button, Input, Kbd } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function KbdInControlsExample() {
  return (
    <div className={styles.stack}>
      <div className={styles.row}>
        {(["s", "m", "l"] as const).map((size) => (
          <Button.Root variant="outline" tone="neutral" key={size} size={size}>
            Найти
            <span className={styles.keys}>
              <Kbd.Root aria-label="Command" title="Command">
                ⌘
              </Kbd.Root>
              <Kbd.Root>K</Kbd.Root>
            </span>
          </Button.Root>
        ))}
        <Button.Root tone="neutral">
          Отправить
          <Kbd.Root size="xs" aria-label="Enter" title="Enter">
            ↵
          </Kbd.Root>
        </Button.Root>
      </div>
      <div className={styles.field}>
        <Input.Root>
          <Input.Wrapper>
            <Input.Field type="search" placeholder="Поиск по документам" aria-label="Поиск" />
            <Input.InlineAffix side="end">
              <Kbd.Root>/</Kbd.Root>
            </Input.InlineAffix>
          </Input.Wrapper>
        </Input.Root>
      </div>
    </div>
  );
}
