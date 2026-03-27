import { Textarea } from "prime-ui-kit";

/** Default with hint, `disabled`, `readOnly`, and native `required` on the textarea. */
export default function TextareaStatesExample() {
  return (
    <>
      <Textarea.Root placeholder="With hint">
        <Textarea.Hint>Default state</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root placeholder="Not editable" disabled>
        <Textarea.Hint>disabled</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root defaultValue="Read only copy" readOnly>
        <Textarea.Hint>readOnly</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root required placeholder="Required field" />
    </>
  );
}
