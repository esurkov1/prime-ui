import { Textarea } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const MAX = 2000;

/**
 * Support ticket: long description with counter, hint, and a hard cap via maxLength.
 */
export default function TextareaExampleSupportTicket() {
  const [text, setText] = React.useState("");

  return (
    <div className={styles.stack}>
      <Textarea.Root
        id="support-description"
        name="description"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={MAX}
        placeholder="Describe what happened, steps to reproduce, and what you expected instead."
        rows={4}
        required
        aria-label="Support ticket description"
      >
        <Textarea.CharCounter current={text.length} max={MAX} />
        <Textarea.Hint>
          We typically reply within one business day. Avoid sharing passwords or full card numbers.
        </Textarea.Hint>
      </Textarea.Root>
    </div>
  );
}
