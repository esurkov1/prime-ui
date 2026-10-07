/** Inside a button or a field the badge takes the tier one step down without `size`. */
import { Badge, Button, Input } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function BadgeInControlsExample() {
  return (
    <div className={styles.controls}>
      <Button.Root variant="outline" tone="neutral">
        Входящие
        <Badge.Root color="blue">12</Badge.Root>
      </Button.Root>
      <Input.Root label="Промокод">
        <Input.Wrapper>
          <Input.Field defaultValue="SPRING25" />
          <Input.InlineAffix side="end">
            <Badge.Root color="green">−25%</Badge.Root>
          </Input.InlineAffix>
        </Input.Wrapper>
      </Input.Root>
    </div>
  );
}
