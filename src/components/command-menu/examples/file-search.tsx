import { File, FileCode, Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { CommandMenu } from "@/components/command-menu/CommandMenu";

const inputIconStyle: React.CSSProperties = {
  width: "var(--prime-sys-size-control-m-icon)",
  height: "var(--prime-sys-size-control-m-icon)",
  color: "var(--prime-sys-color-content-muted)",
  flexShrink: 0,
};

type FileRow = { id: string; label: string; value: string; keywords: string };

const FILES: FileRow[] = [
  {
    id: "1",
    label: "README.md",
    value: "readme",
    keywords: "markdown docs root getting started",
  },
  {
    id: "2",
    label: "src/components/Button.tsx",
    value: "button tsx",
    keywords: "src components button react",
  },
  {
    id: "3",
    label: "playground/vite.config.ts",
    value: "vite config",
    keywords: "playground vite build",
  },
  {
    id: "4",
    label: "tokens/semantic.ts",
    value: "semantic tokens",
    keywords: "tokens theme design system",
  },
];

/**
 * File picker-style palette: match on file name, path segments, and extra keywords.
 */
export default function CommandMenuExampleFileSearch() {
  const [open, setOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  return (
    <>
      <Button.Root variant="neutral" mode="stroke" onClick={() => setOpen(true)}>
        Search files
      </Button.Root>

      <CommandMenu.Dialog open={open} onOpenChange={setOpen} aria-labelledby="files-title">
        <CommandMenu.DialogTitle id="files-title">Open file</CommandMenu.DialogTitle>
        <CommandMenu.InputRow
          leading={<Search style={inputIconStyle} strokeWidth={2} aria-hidden />}
        >
          <CommandMenu.Input placeholder="Filter by name or path…" aria-label="Filter files" />
        </CommandMenu.InputRow>
        <CommandMenu.List>
          <CommandMenu.Group heading="Repository">
            {FILES.map((f) => {
              const Icon = f.label.endsWith(".tsx") || f.label.endsWith(".ts") ? FileCode : File;
              return (
                <CommandMenu.Item
                  key={f.id}
                  value={f.value}
                  keywords={f.keywords}
                  onSelect={() => {
                    setActiveId(f.id);
                    setOpen(false);
                  }}
                >
                  <CommandMenu.ItemIcon as={Icon} strokeWidth={2} />
                  {f.label}
                </CommandMenu.Item>
              );
            })}
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu.Dialog>

      {activeId ? (
        <p
          style={{
            marginTop: "var(--prime-sys-spacing-x3)",
            color: "var(--prime-sys-color-content-muted)",
          }}
        >
          Last opened id: {activeId}
        </p>
      ) : null}
    </>
  );
}
