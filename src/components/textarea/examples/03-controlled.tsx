import { Textarea } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/**
 * Controlled textarea: value lives in parent state; hint reflects live length.
 */
export default function TextareaExampleControlled() {
  const [draft, setDraft] = React.useState(
    "Draft text is owned by React state and updates on every change event.",
  );

  return (
    <div className={styles.stack}>
      <Textarea.Root
        size="m"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Type here…"
        name="draft"
      >
        <Textarea.Hint>Characters in state: {draft.length}</Textarea.Hint>
      </Textarea.Root>
    </div>
  );
}
