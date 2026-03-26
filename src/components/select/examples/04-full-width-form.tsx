import { Label, Select, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/**
 * Trigger is `width: 100%` in kit styles — put the field in a full-width column; no `fullWidth` prop on
 * `Select.Root`.
 */
export default function SelectExampleFullWidthForm() {
  const nameLabelId = React.useId();
  const methodLabelId = React.useId();

  return (
    <div className={styles.form}>
      <Typography.Root as="h3" variant="heading-subsection">
        Delivery details
      </Typography.Root>
      <div className={styles.fieldFullBleed}>
        <Label.Root id={nameLabelId} size="m">
          Full name
        </Label.Root>
        <Select.Root size="m" placeholder="How should we address the package?">
          <Select.Trigger aria-labelledby={nameLabelId}>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="home">Alex Morgan (home)</Select.Item>
            <Select.Item value="work">Alex Morgan (office)</Select.Item>
            <Select.Item value="gift">Gift recipient — leave at desk</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
      <div className={styles.fieldFullBleed}>
        <Label.Root id={methodLabelId} size="m">
          Shipping method
        </Label.Root>
        <Select.Root size="m" defaultValue="standard" placeholder="Choose shipping">
          <Select.Trigger aria-labelledby={methodLabelId}>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="standard">Standard (5–7 days)</Select.Item>
            <Select.Item value="express">Express (2–3 days)</Select.Item>
            <Select.Item value="overnight">Overnight</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
    </div>
  );
}
