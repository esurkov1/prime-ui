import { Hint, Input, Label } from "prime-ui-kit";

/**
 * There is no `success` variant on `Hint`. Use `variant="default"` for short,
 * neutral confirmation copy under the field (secondary text color).
 */
export default function SuccessConfirmationExample() {
  const hintId = "hint-example-success-desc";

  return (
    <>
      <Label.Root htmlFor="hint-example-success">API token</Label.Root>
      <Input.Root id="hint-example-success">
        <Input.Wrapper>
          <Input.Field
            type="text"
            readOnly
            defaultValue="pk_live_••••••••"
            aria-describedby={hintId}
          />
        </Input.Wrapper>
      </Input.Root>
      <Hint.Root id={hintId} variant="default">
        Token saved. Rotate it from settings anytime.
      </Hint.Root>
    </>
  );
}
