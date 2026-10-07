/** Without `size` a badge inside Button or Input takes the tier one step down (button m → badge s). Use for counters in buttons and affixes in fields. */
import { Badge, Button, Input } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function BadgeInControlsExample() {
  return (
    <div className={styles.stack}>
      <div className={styles.controls}>
        <Button.Root variant="outline" tone="neutral" size="s">
          Входящие
          <Badge.Root color="blue">12</Badge.Root>
        </Button.Root>
        <Button.Root variant="outline" tone="neutral">
          Входящие
          <Badge.Root color="blue">12</Badge.Root>
        </Button.Root>
        <Button.Root variant="outline" tone="neutral" size="l">
          Входящие
          <Badge.Root color="blue">12</Badge.Root>
        </Button.Root>
      </div>
      <div className={styles.field}>
        <Input.Root label="Промокод">
          <Input.Wrapper>
            <Input.Field defaultValue="SPRING25" />
            <Input.InlineAffix side="end">
              <Badge.Root color="green">−25%</Badge.Root>
            </Input.InlineAffix>
          </Input.Wrapper>
        </Input.Root>
      </div>
    </div>
  );
}
