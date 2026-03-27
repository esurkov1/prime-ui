import { Icon, Label } from "prime-ui-kit";

/**
 * Accessibility checklist: `htmlFor`/`id` link; decorative icon `aria-hidden`;
 * `required` on the input; short sub-line stays inside the label (long copy → Hint below field).
 */
export function AccessibilityPatternExample() {
  return (
    <>
      <Label.Root htmlFor="example-label-a11y-email" id="example-label-a11y-email-label">
        <Label.Icon>
          <Icon surface="none" aria-hidden name="field.email" />
        </Label.Icon>
        Billing contact email
        <Label.Asterisk />
        <Label.Sub>invoices and receipts</Label.Sub>
      </Label.Root>
      <input
        id="example-label-a11y-email"
        type="email"
        name="billingEmail"
        required
        aria-required="true"
        autoComplete="email"
      />
    </>
  );
}
