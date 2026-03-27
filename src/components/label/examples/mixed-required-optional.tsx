import { Label } from "prime-ui-kit";

/** Mirrors `playground/snippets/label/mixed-required-optional.tsx`: asterisk vs optional `Label.Sub`. */
export function LabelMixedRequiredOptionalExample() {
  return (
    <>
      <Label.Root htmlFor="example-label-mx-1">
        Contract number
        <Label.Asterisk />
      </Label.Root>
      <Label.Root htmlFor="example-label-mx-2">
        Order note
        <Label.Sub>optional</Label.Sub>
      </Label.Root>
    </>
  );
}
