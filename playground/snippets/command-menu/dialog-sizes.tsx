import { Search } from "lucide-react";
import type { CSSProperties } from "react";
import * as React from "react";

import { ButtonGroup } from "@/components/button-group/ButtonGroup";
import { CommandMenu, type CommandMenuDialogSize } from "@/components/command-menu/CommandMenu";

import cmdStyles from "@/components/command-menu/CommandMenu.module.css";

const srOnly: CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

const SIZES: CommandMenuDialogSize[] = ["s", "m", "l", "xl"];

export default function CommandMenuDialogSizesSnippet() {
  const [open, setOpen] = React.useState(false);
  const [size, setSize] = React.useState<CommandMenuDialogSize>("l");

  return (
    <>
      <ButtonGroup.Root size="m" aria-label="Размер панели команд">
        {SIZES.map((s) => (
          <ButtonGroup.Item
            key={s}
            pressed={open && size === s}
            onClick={() => {
              setSize(s);
              setOpen(true);
            }}
          >
            {s.toUpperCase()}
          </ButtonGroup.Item>
        ))}
      </ButtonGroup.Root>

      <CommandMenu.Dialog open={open} onOpenChange={setOpen} size={size}>
        <CommandMenu.DialogTitle style={srOnly}>Команды</CommandMenu.DialogTitle>
        <CommandMenu.InputRow
          leading={<Search className={cmdStyles.inputIcon} strokeWidth={2} aria-hidden />}
        >
          <CommandMenu.Input placeholder="Поиск…" aria-label="Поиск команд" />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Group heading="Демо">
            <CommandMenu.Item value="закрыть" onSelect={() => setOpen(false)}>
              Закрыть палитру
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Dialog>
    </>
  );
}
