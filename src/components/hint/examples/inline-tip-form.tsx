import { Hint, Input, Label } from "prime-ui-kit";

/** Multiple rows: label, control, hint — tip copy inline with the form stack. */
export default function InlineTipFormExample() {
  const emailHintId = "hint-example-form-email-desc";
  const budgetHintId = "hint-example-form-budget-desc";

  return (
    <>
      <Label.Root htmlFor="hint-example-form-email">Billing email</Label.Root>
      <Input.Root id="hint-example-form-email">
        <Input.Wrapper>
          <Input.Field
            type="email"
            placeholder="finance@company.com"
            aria-describedby={emailHintId}
          />
        </Input.Wrapper>
      </Input.Root>
      <Hint.Root id={emailHintId} variant="default">
        Invoices and receipts go here; not the same as your login email.
      </Hint.Root>

      <Label.Root htmlFor="hint-example-form-budget">Monthly budget</Label.Root>
      <Input.Root id="hint-example-form-budget">
        <Input.Wrapper>
          <Input.Field
            type="text"
            inputMode="decimal"
            placeholder="0"
            aria-describedby={budgetHintId}
          />
        </Input.Wrapper>
      </Input.Root>
      <Hint.Root id={budgetHintId} variant="disabled">
        Optional — leave empty to use the workspace default.
      </Hint.Root>
    </>
  );
}
