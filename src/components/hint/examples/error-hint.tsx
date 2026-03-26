import { Hint, Input, Label } from "prime-ui-kit";

/** Validation message: `variant="error"`, invalid field, optional `role="alert"`. */
export default function ErrorHintExample() {
  const hintId = "hint-example-error-desc";

  return (
    <>
      <Label.Root htmlFor="hint-example-error" size="m">
        Tax ID
      </Label.Root>
      <Input.Root size="m" id="hint-example-error" hasError>
        <Input.Wrapper>
          <Input.Field type="text" defaultValue="12" aria-describedby={hintId} />
        </Input.Wrapper>
      </Input.Root>
      <Hint.Root id={hintId} size="m" variant="error" role="alert">
        Enter 10 or 12 digits.
      </Hint.Root>
    </>
  );
}
