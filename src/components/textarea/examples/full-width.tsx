import { Textarea } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Narrow parent column; `Textarea.Root` stretches to 100% of the track (`min-width: 0` on the field). */
export default function TextareaFullWidthExample() {
  return (
    <div className={styles.fullWidthCard}>
      <Textarea.Root size="m" placeholder="Field spans the card column width">
        <Textarea.Hint>Parent sets width; the control root uses width: 100%.</Textarea.Hint>
      </Textarea.Root>
    </div>
  );
}
