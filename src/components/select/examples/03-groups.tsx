import { Label, Select } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/**
 * Long lists: `Select.Group`, `Select.GroupLabel`, and `Select.Separator` inside `Select.Content`.
 */
export default function SelectExampleGroups() {
  const timezoneLabelId = React.useId();

  return (
    <div className={styles.field}>
      <Label.Root id={timezoneLabelId}>Time zone</Label.Root>
      <Select.Root defaultValue="utc" placeholder="Select time zone">
        <Select.Trigger aria-labelledby={timezoneLabelId}>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.GroupLabel>Americas</Select.GroupLabel>
            <Select.Item value="et">Eastern Time</Select.Item>
            <Select.Item value="ct">Central Time</Select.Item>
            <Select.Item value="pt">Pacific Time</Select.Item>
          </Select.Group>
          <Select.Separator />
          <Select.Group>
            <Select.GroupLabel>Europe</Select.GroupLabel>
            <Select.Item value="utc">UTC</Select.Item>
            <Select.Item value="cet">Central European Time</Select.Item>
            <Select.Item value="gmt">GMT (London)</Select.Item>
          </Select.Group>
          <Select.Separator />
          <Select.Group>
            <Select.GroupLabel>Asia Pacific</Select.GroupLabel>
            <Select.Item value="jst">Japan (JST)</Select.Item>
            <Select.Item value="aest">Sydney (AEST)</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
