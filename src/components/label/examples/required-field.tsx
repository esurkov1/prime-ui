import { Label } from "prime-ui-kit";

/** Required field: visual marker via `Label.Asterisk`; semantics via `required` on the control. */
export function RequiredFieldExample() {
  return (
    <>
      <Label.Root htmlFor="example-label-required-email">
        Work email
        <Label.Asterisk />
      </Label.Root>
      <input
        id="example-label-required-email"
        type="email"
        name="email"
        required
        autoComplete="email"
      />
    </>
  );
}
