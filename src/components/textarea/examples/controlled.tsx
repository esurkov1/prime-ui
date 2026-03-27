import { Textarea } from "prime-ui-kit";
import * as React from "react";

/** Parent-owned `value` / `onChange`; character count in `Textarea.Hint`. */
export default function TextareaControlledExample() {
  const [notes, setNotes] = React.useState("Draft text is stored in parent state.");

  return (
    <Textarea.Root
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      placeholder="Type here…"
    >
      <Textarea.Hint>Characters: {notes.length}</Textarea.Hint>
    </Textarea.Root>
  );
}
