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

const toolbarStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--prime-sys-spacing-x3)",
  alignItems: "center",
};

/**
 * Controlled `Dialog` and controlled `Input` value synced with parent state (playground `controlled-open-search.tsx`).
 */
export default function CommandMenuExampleControlledOpenSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  return (
    <>
      <div style={toolbarStyle}>
        <Typography.Root variant="body-small" tone="muted">
          External query: «{query || "…"}»
        </Typography.Root>
        <Button.Root size="m" variant="primary" onClick={() => setOpen(true)}>
          Open with external search string
        </Button.Root>
      </div>

      <CommandMenu.Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setQuery("");
        }}
      >
        <CommandMenu.InputRow
          leading={<Search style={inputIconStyle} strokeWidth={2} aria-hidden />}
        >
          <CommandMenu.Input
            placeholder="Search synced with parent…"
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Group heading="Commands">
            <CommandMenu.Item
              value="clear filter"
              keywords="clear reset"
              onSelect={() => {
                setQuery("");
              }}
            >
              Clear filter
            </CommandMenu.Item>
            <CommandMenu.Item value="done" onSelect={() => setOpen(false)}>
              Close palette
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Dialog>
    </>
  );
}
