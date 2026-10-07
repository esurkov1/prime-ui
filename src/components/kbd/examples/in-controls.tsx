/** Inside a button or a field the key takes the tier one step down; an explicit `size` overrides it. */
import { Button, Input, Kbd } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function KbdInControlsExample() {
  return (
    <div className={styles.controls}>
      <Button.Root variant="outline" tone="neutral">
        Найти
        <span className={styles.chord}>
          <Kbd aria-label="Command" title="Command">
            ⌘
          </Kbd>
          <Kbd>K</Kbd>
        </span>
      </Button.Root>
      <Button.Root tone="neutral">
        Отправить
        <Kbd size="xs" aria-label="Enter" title="Enter">
          ↵
        </Kbd>
      </Button.Root>
      <Input.Root>
        <Input.Wrapper>
          <Input.Field type="search" placeholder="Поиск по документам" aria-label="Поиск" />
          <Input.InlineAffix side="end">
            <Kbd>/</Kbd>
          </Input.InlineAffix>
        </Input.Wrapper>
      </Input.Root>
    </div>
  );
}
