import * as React from "react";

import { Textarea } from "@/components/textarea/Textarea";

export default function TextareaControlledSnippet() {
  const [notes, setNotes] = React.useState("Черновик сохраняется в состоянии родителя.");

  return (
    <Textarea.Root
      size="m"
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      placeholder="Введите текст…"
    >
      <Textarea.Hint>Символов: {notes.length}</Textarea.Hint>
    </Textarea.Root>
  );
}
