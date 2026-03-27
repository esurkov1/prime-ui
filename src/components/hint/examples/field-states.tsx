import { Hint, Input, Label } from "prime-ui-kit";

/** Label + field + hint for default, invalid, and disabled rows (aligned with playground `field-states`). */
export default function HintFieldStatesExample() {
  return (
    <>
      <Label.Root htmlFor="hint-ex-st-ok">Project name</Label.Root>
      <Input.Root id="hint-ex-st-ok">
        <Input.Wrapper>
          <Input.Field type="text" defaultValue="Alpha" />
        </Input.Wrapper>
      </Input.Root>
      <Hint.Root variant="default">Visible to everyone in this workspace.</Hint.Root>

      <Label.Root htmlFor="hint-ex-st-err">Tax ID</Label.Root>
      <Input.Root id="hint-ex-st-err" hasError>
        <Input.Wrapper>
          <Input.Field type="text" defaultValue="12" />
        </Input.Wrapper>
      </Input.Root>
      <Hint.Root variant="error">Enter 10 or 12 digits.</Hint.Root>

      <Label.Root htmlFor="hint-ex-st-dis" disabled>
        Request limit
      </Label.Root>
      <Input.Root id="hint-ex-st-dis">
        <Input.Wrapper>
          <Input.Field type="text" disabled defaultValue="read only" />
        </Input.Wrapper>
      </Input.Root>
      <Hint.Root variant="disabled">Value comes from the plan and cannot be edited.</Hint.Root>
    </>
  );
}
