import { Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { CommandMenu } from "@/components/command-menu/CommandMenu";
import commandMenuStyles from "@/components/command-menu/CommandMenu.module.css";

const inputIconStyle: React.CSSProperties = {
  width: "var(--prime-sys-size-control-m-icon)",
  height: "var(--prime-sys-size-control-m-icon)",
  color: "var(--prime-sys-color-content-muted)",
  flexShrink: 0,
};

/**
 * Wider panel via `dialogContentWide` from the CommandMenu CSS module on `Dialog` `className`
 * (playground `full-width-panel.tsx` uses a local demo class with the same width token).
 */
export default function CommandMenuExampleFullWidthPanel() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root size="m" variant="neutral" mode="stroke" onClick={() => setOpen(true)}>
        Wide panel
      </Button.Root>

      <CommandMenu.Dialog
        open={open}
        onOpenChange={setOpen}
        className={commandMenuStyles.dialogContentWide}
      >
        <CommandMenu.InputRow
          leading={<Search style={inputIconStyle} strokeWidth={2} aria-hidden />}
        >
          <CommandMenu.Input placeholder="Wider than default max-width…" aria-label="Search" />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Group heading="Layout">
            <CommandMenu.Item
              value="dialog content wide class"
              keywords="layout"
              onSelect={() => setOpen(false)}
            >
              Panel className from CommandMenu.module.css
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Dialog>
    </>
  );
}
