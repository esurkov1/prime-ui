import { Textarea } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Full width within a parent: Textarea.Root already stretches to 100% of its container.
 */
export default function TextareaExampleFullWidth() {
  return (
    <div className={styles.fullWidthCard}>
      <Textarea.Root
        size="m"
        name="cardNote"
        placeholder="This field spans the full width of the card column."
      >
        <Textarea.Hint>
          Widen or narrow the parent; the control follows the track (min-width: 0 avoids grid
          blowout).
        </Textarea.Hint>
      </Textarea.Root>
    </div>
  );
}
