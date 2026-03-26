import { Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { CommandMenu } from "@/components/command-menu/CommandMenu";

import cmdStyles from "@/components/command-menu/CommandMenu.module.css";

export default function CommandMenuFullWidthSnippet() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root size="m" variant="neutral" mode="stroke" onClick={() => setOpen(true)}>
        Широкая панель
      </Button.Root>

      <CommandMenu.Dialog
        open={open}
        onOpenChange={setOpen}
        className={cmdStyles.dialogContentWide}
      >
        <CommandMenu.InputRow
          leading={<Search className={cmdStyles.inputIcon} strokeWidth={2} aria-hidden />}
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
    </>
  );
}
