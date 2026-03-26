import { Hint, Input, Label } from "prime-ui-kit";

/** Neutral helper under a field: same `size` as the input, linked with `aria-describedby`. */
export default function FieldHelpExample() {
  const hintId = "hint-example-field-help-desc";

  return (
    <>
      <Label.Root htmlFor="hint-example-field-help" size="m">
        Project name
      </Label.Root>
      <Input.Root size="m" id="hint-example-field-help">
        <Input.Wrapper>
          <Input.Field
            type="text"
            defaultValue="Alpha"
            autoComplete="organization"
            aria-describedby={hintId}
          />
        </Input.Wrapper>
      </Input.Root>
      <Hint.Root id={hintId} size="m" variant="default">
        Visible to everyone in this workspace.
      </Hint.Root>
    </>
  );
}
