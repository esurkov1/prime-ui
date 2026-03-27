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

const triggerRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--prime-sys-spacing-x3)",
  alignItems: "center",
};

type DensityDemo = "compact" | "comfortable";

/**
 * `InputRow` `density` and list row scale via `Item` `size` (playground `variants-density-items.tsx`).
 */
export default function CommandMenuExampleVariantsDensityItems() {
  const [open, setOpen] = React.useState(false);
  const [density, setDensity] = React.useState<DensityDemo>("compact");

  return (
    <>
      <div style={triggerRowStyle}>
        <Button.Root
          variant="neutral"
          mode="stroke"
          onClick={() => {
            setDensity("compact");
            setOpen(true);
          }}
        >
          Compact density
        </Button.Root>
        <Button.Root
          variant="neutral"
          mode="stroke"
          onClick={() => {
            setDensity("comfortable");
            setOpen(true);
          }}
        >
          Comfortable density
        </Button.Root>
      </div>

      <CommandMenu.Dialog open={open} onOpenChange={setOpen}>
        <CommandMenu.InputRow
          density={density}
          leading={<Search style={inputIconStyle} strokeWidth={2} aria-hidden />}
        >
          <CommandMenu.Input placeholder="Search…" aria-label="Search" />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Group heading='Items size="s"'>
            <CommandMenu.Item value="short list" size="s" onSelect={() => setOpen(false)}>
              Compact row
            </CommandMenu.Item>
            <CommandMenu.Item value="another s" size="s" onSelect={() => setOpen(false)}>
              Second compact row
            </CommandMenu.Item>
          </CommandMenu.Group>
          <CommandMenu.Group heading='Items size="m"'>
            <CommandMenu.Item value="tall row" onSelect={() => setOpen(false)}>
              Taller list row
            </CommandMenu.Item>
            <CommandMenu.Item value="another m" onSelect={() => setOpen(false)}>
              Another size m item
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Dialog>
    </>
  );
}
