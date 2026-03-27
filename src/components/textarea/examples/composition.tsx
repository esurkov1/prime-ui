import { Textarea, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Section title via `Typography`, counter + hint, and a second field with `Textarea.Error`. */
export default function TextareaCompositionExample() {
  return (
    <div className={styles.compositionStack}>
      <Typography.Root variant="body-small" weight="medium" as="div">
        Order comment
      </Typography.Root>
      <Textarea.Root size="m" placeholder="Delivery notes or time window">
        <Textarea.CharCounter current={0} max={240} />
        <Textarea.Hint>Logistics sees this until the order ships.</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root size="m" variant="error" placeholder="Describe the return reason">
        <Textarea.Error>A description is required to submit</Textarea.Error>
      </Textarea.Root>
    </div>
  );
}
