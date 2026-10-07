/** An "or" line between two ways to sign in. */
import { Button, Divider, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function DividerOrSeparatorExample() {
  return (
    <div className={styles.column}>
      <Button.Root fullWidth>Войти</Button.Root>
      <Divider>или</Divider>
      <Button.Root variant="outline" tone="neutral" fullWidth>
        <Button.Icon>
          <Icon name="field.email" />
        </Button.Icon>
        Получить ссылку на почту
      </Button.Root>
    </div>
  );
}
