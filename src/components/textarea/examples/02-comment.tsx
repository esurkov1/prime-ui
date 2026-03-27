import { Label, Textarea } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const FIELD_ID = "order-comment";
const MAX = 240;

/**
 * Order comment: caption above the field chrome via Label + shared id on Textarea.Root.
 */
export default function TextareaExampleComment() {
  const [comment, setComment] = React.useState("");

  return (
    <div className={styles.labelBlock}>
      <Label.Root htmlFor={FIELD_ID}>
        Comment for the courier
        <Label.Sub>Optional — visible to logistics until the order ships.</Label.Sub>
      </Label.Root>
      <Textarea.Root
        id={FIELD_ID}
        name="courierComment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={MAX}
        placeholder="Gate code, safe drop spot, or delivery window"
      >
        <Textarea.CharCounter current={comment.length} max={MAX} />
        <Textarea.Hint>Keep it short; the driver sees this on the handheld.</Textarea.Hint>
      </Textarea.Root>
    </div>
  );
}
