import { Textarea } from "prime-ui-kit";

/** Default with hint, `disabled`, `readOnly`, and native `required` on the textarea. */
export default function TextareaStatesExample() {
  return (
    <>
      <Textarea.Root size="m" placeholder="With hint">
        <Textarea.Hint>Default state</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root size="m" placeholder="Not editable" disabled>
        <Textarea.Hint>disabled</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root size="m" defaultValue="Read only copy" readOnly>
        <Textarea.Hint>readOnly</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root size="m" required placeholder="Required field" />
    </>
  );
}
