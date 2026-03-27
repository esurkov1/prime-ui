import { Hint, Input, Label } from "prime-ui-kit";

/** Label + field + hint for default, invalid, and disabled rows (aligned with playground `field-states`). */
export default function HintFieldStatesExample() {
  return (
    <>
      <Label.Root htmlFor="hint-ex-st-ok" size="m">
        Project name
      </Label.Root>
      <Input.Root size="m" id="hint-ex-st-ok">
        <Input.Wrapper>
          <Input.Field type="text" defaultValue="Alpha" />
        </Input.Wrapper>
      </Input.Root>
      <Hint.Root size="m" variant="default">
        Visible to everyone in this workspace.
      </Hint.Root>

      <Label.Root htmlFor="hint-ex-st-err" size="m">
        Tax ID
      </Label.Root>
      <Input.Root size="m" id="hint-ex-st-err" hasError>
        <Input.Wrapper>
          <Input.Field type="text" defaultValue="12" />
        </Input.Wrapper>
      </Input.Root>
      <Hint.Root size="m" variant="error">
        Enter 10 or 12 digits.
      </Hint.Root>

      <Label.Root htmlFor="hint-ex-st-dis" size="m" disabled>
        Request limit
      </Label.Root>
      <Input.Root size="m" id="hint-ex-st-dis">
        <Input.Wrapper>
          <Input.Field type="text" disabled defaultValue="read only" />
        </Input.Wrapper>
      </Input.Root>
      <Hint.Root size="m" variant="disabled">
        Value comes from the plan and cannot be edited.
      </Hint.Root>
    </>
  );
}
