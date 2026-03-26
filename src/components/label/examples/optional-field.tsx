import { Label } from "prime-ui-kit";

/** Optional field: clarify in `Label.Sub` without a required marker on the control. */
export function OptionalFieldExample() {
  return (
    <>
      <Label.Root htmlFor="example-label-optional-note">
        Internal comment
        <Label.Sub>optional</Label.Sub>
      </Label.Root>
      <input id="example-label-optional-note" type="text" name="note" />
    </>
  );
}
