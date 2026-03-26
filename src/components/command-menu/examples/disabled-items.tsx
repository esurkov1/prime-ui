import { Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { CommandMenu } from "@/components/command-menu/CommandMenu";
import { Typography } from "@/components/typography/Typography";

const inputIconStyle: React.CSSProperties = {
  width: "var(--prime-sys-size-control-m-icon)",
  height: "var(--prime-sys-size-control-m-icon)",
  color: "var(--prime-sys-color-content-muted)",
  flexShrink: 0,
};

const footerStyle: React.CSSProperties = {
  background: "var(--prime-sys-color-surface-default)",
};

/**
 * Items with `disabled` are omitted from the filtered list and keyboard order (not shown as gray rows).
 * Use conditional rendering instead if you need a visible “locked” row.
 */
export default function CommandMenuExampleDisabledItems() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root size="m" variant="neutral" mode="stroke" onClick={() => setOpen(true)}>
        Disabled items behavior
      </Button.Root>

      <CommandMenu.Dialog open={open} onOpenChange={setOpen} aria-labelledby="disabled-demo-title">
        <CommandMenu.DialogTitle id="disabled-demo-title">Commands</CommandMenu.DialogTitle>
        <CommandMenu.InputRow
          leading={<Search style={inputIconStyle} strokeWidth={2} aria-hidden />}
        >
          <CommandMenu.Input placeholder="Try “delete”…" aria-label="Filter commands" />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Group heading="Available">
            <CommandMenu.Item value="save draft" keywords="write" onSelect={() => setOpen(false)}>
              Save draft
            </CommandMenu.Item>
            <CommandMenu.Item
              value="publish"
              keywords="release ship"
              onSelect={() => setOpen(false)}
            >
              Publish
            </CommandMenu.Item>
          </CommandMenu.Group>
          {/* `disabled` items are excluded from visible options — this row never appears in the listbox */}
          <CommandMenu.Group heading="Hidden when disabled">
            <CommandMenu.Item
              value="delete production database"
              keywords="delete destroy danger"
              disabled
              onSelect={() => setOpen(false)}
            >
              Delete production (disabled in code)
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
        <CommandMenu.Footer style={footerStyle}>
          <Typography.Root variant="body-compact" tone="muted">
            Searching “delete” finds no option: the dangerous action is disabled and removed from
            the palette, not listed as inactive.
          </Typography.Root>
        </CommandMenu.Footer>
      </CommandMenu.Dialog>
    </>
  );
}
