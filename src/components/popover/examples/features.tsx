import { Button, Input, Popover, Select, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./popover-examples.module.css";

/**
 * `trapFocus` with `Input` and nested `Select`: portaled listbox clicks are not treated as outside close.
 */
export default function PopoverFeaturesExample() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button.Root className={styles.triggerWide} mode="stroke" size="m" variant="neutral">
          Access request
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content
        align="start"
        className={styles.formPanel}
        insetGap="x3"
        insetPadding="x2"
        sameMinWidthAsTrigger
        trapFocus
      >
        <Typography.Root as="p" variant="body-small" weight="medium">
          Short form
        </Typography.Root>
        <Typography.Root as="p" className={styles.panelTextMuted} variant="body-small">
          <code>trapFocus</code> keeps Tab inside the panel; opening the Select listbox does not
          count as an outside click, so the popover stays open.
        </Typography.Root>
        <Input.Root label="Comment" size="m">
          <Input.Wrapper>
            <Input.Field
              placeholder="Why access is needed"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Input.Wrapper>
        </Input.Root>
        <Select.Root placeholder="Role" size="m">
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="viewer">Viewer</Select.Item>
            <Select.Item value="editor">Editor</Select.Item>
            <Select.Item value="admin">Admin</Select.Item>
          </Select.Content>
        </Select.Root>
        <div className={styles.actionsRow}>
          <Button.Root mode="ghost" size="m" variant="neutral" onClick={() => setOpen(false)}>
            Cancel
          </Button.Root>
          <Button.Root mode="filled" size="m" variant="primary" onClick={() => setOpen(false)}>
            Submit
          </Button.Root>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
