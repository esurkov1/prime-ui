import { Label } from "prime-ui-kit";

/**
 * Grouped fields: `fieldset` + `legend` names the group; each control keeps its own
 * `Label.Root` + unique `id` / `htmlFor` pair.
 */
export function GroupedLabelsExample() {
  return (
    <fieldset>
      <legend>Billing address</legend>
      <div>
        <Label.Root htmlFor="example-label-group-line1">Address line 1</Label.Root>
        <input id="example-label-group-line1" type="text" name="line1" required />
      </div>
      <div>
        <Label.Root htmlFor="example-label-group-line2">
          Address line 2<Label.Sub>optional</Label.Sub>
        </Label.Root>
        <input id="example-label-group-line2" type="text" name="line2" />
      </div>
      <div>
        <Label.Root htmlFor="example-label-group-postal">
          Postal code
          <Label.Asterisk />
        </Label.Root>
        <input id="example-label-group-postal" type="text" name="postal" required />
      </div>
    </fieldset>
  );
}
