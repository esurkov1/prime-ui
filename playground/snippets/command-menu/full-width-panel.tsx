import { Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { CommandMenu } from "@/components/command-menu/CommandMenu";

const inputIconStyle: React.CSSProperties = {
  width: "var(--prime-sys-size-control-m-icon)",
  height: "var(--prime-sys-size-control-m-icon)",
  color: "var(--prime-sys-color-content-muted)",
  flexShrink: 0,
};

export default function CommandMenuFullWidthSnippet() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root variant="neutral" mode="stroke" onClick={() => setOpen(true)}>
        Широкая панель
      </Button.Root>

      <CommandMenu.Dialog open={open} onOpenChange={setOpen} className="demoCommandMenuDialogWide">
        <CommandMenu.InputRow
          leading={<Search style={inputIconStyle} strokeWidth={2} aria-hidden />}
        >
          <CommandMenu.Input placeholder="Шире обычного max-width…" aria-label="Поиск" />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Group heading="Ширина">
            <CommandMenu.Item
              value="класс dialogContentWide"
              keywords="layout"
              onSelect={() => setOpen(false)}
            >
              Класс панели задан через className у Dialog
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Dialog>
      <style>
        {`.demoCommandMenuDialogWide{width:min(100%,var(--prime-sys-unit-43p75rem));max-width:100%;}`}
      </style>
    </>
  );
}
