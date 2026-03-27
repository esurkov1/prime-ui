import { Copy, Link2, Mail, Search, UserPlus } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { CommandMenu } from "@/components/command-menu/CommandMenu";

const inputIconStyle: React.CSSProperties = {
  width: "var(--prime-sys-size-control-m-icon)",
  height: "var(--prime-sys-size-control-m-icon)",
  color: "var(--prime-sys-color-content-muted)",
  flexShrink: 0,
};

/**
 * Quick actions on the current context: copy, share, invite — grouped under one palette.
 */
export default function CommandMenuExampleQuickActions() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root variant="neutral" mode="stroke" onClick={() => setOpen(true)}>
        Quick actions
      </Button.Root>

      <CommandMenu.Dialog open={open} onOpenChange={setOpen} aria-labelledby="actions-title">
        <CommandMenu.DialogTitle id="actions-title">Actions</CommandMenu.DialogTitle>
        <CommandMenu.InputRow
          leading={<Search style={inputIconStyle} strokeWidth={2} aria-hidden />}
        >
          <CommandMenu.Input placeholder="Run an action…" aria-label="Filter actions" />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Group heading="Clipboard">
            <CommandMenu.Item
              value="copy link"
              keywords="url clipboard"
              onSelect={() => setOpen(false)}
            >
              <CommandMenu.ItemIcon as={Link2} strokeWidth={2} />
              Copy link
            </CommandMenu.Item>
            <CommandMenu.Item
              value="copy page as markdown"
              keywords="clipboard md export"
              onSelect={() => setOpen(false)}
            >
              <CommandMenu.ItemIcon as={Copy} strokeWidth={2} />
              Copy page as Markdown
            </CommandMenu.Item>
          </CommandMenu.Group>
          <CommandMenu.Group heading="People">
            <CommandMenu.Item
              value="invite teammate"
              keywords="email share member"
              onSelect={() => setOpen(false)}
            >
              <CommandMenu.ItemIcon as={UserPlus} strokeWidth={2} />
              Invite teammate
            </CommandMenu.Item>
            <CommandMenu.Item
              value="message owner"
              keywords="dm mail contact"
              onSelect={() => setOpen(false)}
            >
              <CommandMenu.ItemIcon as={Mail} strokeWidth={2} />
              Message owner
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Dialog>
    </>
  );
}
