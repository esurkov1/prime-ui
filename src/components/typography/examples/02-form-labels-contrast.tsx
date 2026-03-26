import { Input, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Form context: label text vs optional tag vs hint — Typography.Root for each string role
 * (Input still owns the field chrome; see Input COMPONENT.md).
 */
export default function TypographyExampleFormLabelsContrast() {
  return (
    <div className={styles.stack}>
      <Typography.Root as="h1" variant="heading-page">
        Workspace settings
      </Typography.Root>
      <Typography.Root as="p" variant="body-default" tone="muted">
        Stronger weight on the label, smaller muted lines for hints, so the eye lands on the field
        name first.
      </Typography.Root>
      <div className={styles.formFields}>
        <Input.Root
          id="typography-example-email"
          label={
            <Typography.Root as="span" variant="body-compact" weight="semibold">
              Work email
            </Typography.Root>
          }
          hint={
            <Typography.Root as="span" variant="caption" tone="muted">
              Invoices and security alerts only; never shared with vendors.
            </Typography.Root>
          }
        >
          <Input.Wrapper>
            <Input.Field type="email" autoComplete="email" placeholder="you@company.com" />
          </Input.Wrapper>
        </Input.Root>
        <Input.Root
          label={
            <Typography.Root as="span" variant="body-default" weight="medium">
              Display name
            </Typography.Root>
          }
          optionalLabel={
            <Typography.Root as="span" variant="caption" tone="muted">
              optional
            </Typography.Root>
          }
          hint={
            <Typography.Root as="span" variant="body-small" tone="muted">
              Shown to teammates; use your full name or a short handle.
            </Typography.Root>
          }
        >
          <Input.Wrapper>
            <Input.Field placeholder="Alex Chen" />
          </Input.Wrapper>
        </Input.Root>
      </div>
    </div>
  );
}
