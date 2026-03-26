import { Label, Select, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/**
 * Shipping address: visible label + combobox; `Select.Trigger` has no public `id` — pair with
 * `aria-labelledby` on the trigger.
 */
export default function SelectExampleCountry() {
  const countryLabelId = React.useId();

  return (
    <div className={styles.stack}>
      <Typography.Root as="p" variant="body-small" tone="muted" className={styles.caption}>
        Select a country for tax and delivery estimates.
      </Typography.Root>
      <div className={styles.field}>
        <Label.Root id={countryLabelId} size="m">
          Country or region
        </Label.Root>
        <Select.Root size="m" defaultValue="us" placeholder="Choose a country">
          <Select.Trigger aria-labelledby={countryLabelId}>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="us">United States</Select.Item>
            <Select.Item value="ca">Canada</Select.Item>
            <Select.Item value="gb">United Kingdom</Select.Item>
            <Select.Item value="de">Germany</Select.Item>
            <Select.Item value="jp">Japan</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
    </div>
  );
}
