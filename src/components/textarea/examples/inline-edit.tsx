/** A record card note that saves on blur and Mod+Enter, reverts on Escape and shows the server's refusal — `onCommit`, `error`. */
import { Textarea } from "prime-ui-kit";
import * as React from "react";

const SAVE_DELAY_MS = 900;
const MAX_NOTE_LENGTH = 500;

/** Stands in for the API call: a note over the limit is refused like a server validation error. */
function saveNote(value: string) {
  return new Promise<void>((resolve, reject) => {
    window.setTimeout(() => {
      if (value.length > MAX_NOTE_LENGTH) reject(new Error("Заметка длиннее 500 символов"));
      else resolve();
    }, SAVE_DELAY_MS);
  });
}

export default function TextareaInlineEditExample() {
  const [note, setNote] = React.useState(
    "Перезвонить после согласования бюджета. Интересует годовой тариф на 40 мест.",
  );
  const [error, setError] = React.useState<string>();

  return (
    <Textarea.Root
      label="Заметка по сделке"
      hint="Сохраняется при выходе из поля и по Ctrl+Enter, Escape отменяет правку"
      error={error}
      value={note}
      onValueChange={setNote}
      onCommit={async (value) => {
        setError(undefined);
        try {
          await saveNote(value);
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : "Не удалось сохранить");
          throw reason;
        }
      }}
    />
  );
}
