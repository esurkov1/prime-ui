import { Textarea } from "prime-ui-kit";

/** `variant="default"` vs `variant="error"` with paired `Textarea.Error` (aria wiring). */
export default function TextareaVariantsExample() {
  return (
    <>
      <Textarea.Root variant="default" placeholder="Default variant">
        <Textarea.Hint>Helper text below the field</Textarea.Hint>
      </Textarea.Root>
      <Textarea.Root variant="error" placeholder="Validation error">
        <Textarea.Error>Description is required</Textarea.Error>
      </Textarea.Root>
    </>
  );
}
