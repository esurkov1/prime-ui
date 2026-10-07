/** A single reply composer where the caret and the lighter fill show focus — `focusRing`. */
import { Textarea } from "prime-ui-kit";

export default function TextareaWithoutFocusRingExample() {
  return (
    <Textarea.Root
      focusRing={false}
      aria-label="Ответ клиенту"
      placeholder="Напишите ответ клиенту"
    />
  );
}
