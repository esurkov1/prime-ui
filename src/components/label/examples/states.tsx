import { Label } from "prime-ui-kit";

/** Mirrors `playground/snippets/label/states.tsx`: default, `disabled`, and `Label.Asterisk`. */
export function LabelStatesExample() {
  return (
    <>
      <Label.Root htmlFor="example-label-st-1">Profile display name</Label.Root>
      <Label.Root htmlFor="example-label-st-2" disabled>
        Read-only field
      </Label.Root>
      <Label.Root htmlFor="example-label-st-3">
        Phone
        <Label.Asterisk />
      </Label.Root>
    </>
  );
}
