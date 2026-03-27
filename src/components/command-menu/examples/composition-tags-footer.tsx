import { FileText, Search, Settings, Sparkles, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { CommandMenu } from "@/components/command-menu/CommandMenu";
import { Kbd } from "@/components/kbd/Kbd";
import { Tag } from "@/components/tag/Tag";
import { Typography } from "@/components/typography/Typography";

const inputIconStyle: React.CSSProperties = {
  width: "var(--prime-sys-size-control-m-icon)",
  height: "var(--prime-sys-size-control-m-icon)",
  color: "var(--prime-sys-color-content-muted)",
  flexShrink: 0,
};

const dialogHeaderPadStyle: React.CSSProperties = {
  padding: "var(--prime-sys-spacing-x4) var(--prime-sys-spacing-x4) 0",
};

const dialogHeaderLeadStyle: React.CSSProperties = {
  marginTop: "var(--prime-sys-spacing-x1)",
};

const footerMutedStyle: React.CSSProperties = {
  background: "var(--prime-sys-color-surface-default)",
};

/**
 * Custom header, `InputRow` slots, `TagSection`, `ItemIcon`, muted `Footer` (playground `composition-tags-footer.tsx`).
 */
export default function CommandMenuExampleCompositionTagsFooter() {
  const [open, setOpen] = React.useState(false);
  const [scopes, setScopes] = React.useState(["Docs", "Commands"]);

  return (
    <>
      <Button.Root variant="neutral" mode="stroke" onClick={() => setOpen(true)}>
        Full composition
      </Button.Root>

      <CommandMenu.Dialog
        open={open}
        onOpenChange={setOpen}
        aria-labelledby="cmd-composition-title"
      >
        <div style={dialogHeaderPadStyle}>
          <Typography.Root
            as="div"
            id="cmd-composition-title"
            role="heading"
            aria-level={2}
            variant="body-large"
            weight="semibold"
          >
            Palette
          </Typography.Root>
          <Typography.Root variant="body-small" tone="muted" style={dialogHeaderLeadStyle}>
            Search sections and run quick actions
          </Typography.Root>
        </div>

        <CommandMenu.InputRow
          leading={<Search style={inputIconStyle} strokeWidth={2} aria-hidden />}
          trailing={
            <>
              <Kbd.Root aria-label="Open shortcut">⌘K</Kbd.Root>
              <Button.Root
                variant="neutral"
                mode="ghost"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                <Button.Icon>
                  <X size={18} strokeWidth={2} aria-hidden />
                </Button.Icon>
              </Button.Root>
            </>
          }
        >
          <CommandMenu.Input placeholder="Where to…" aria-label="Search" />
        </CommandMenu.InputRow>

        <CommandMenu.TagSection>
          <CommandMenu.TagSectionLabel>
            <Typography.Root variant="body-compact" tone="muted">
              Scope
            </Typography.Root>
          </CommandMenu.TagSectionLabel>
          <CommandMenu.TagRow>
            {scopes.map((s) => (
              <Tag.Root key={s} onRemove={() => setScopes((p) => p.filter((x) => x !== s))}>
                {s}
              </Tag.Root>
            ))}
          </CommandMenu.TagRow>
        </CommandMenu.TagSection>

        <CommandMenu.List>
          <CommandMenu.Group heading="File">
            <CommandMenu.Item value="new document" onSelect={() => setOpen(false)}>
              <CommandMenu.ItemIcon as={FileText} strokeWidth={2} />
              New document
            </CommandMenu.Item>
          </CommandMenu.Group>
          <CommandMenu.Group heading="System">
            <CommandMenu.Item
              value="settings"
              keywords="preferences profile"
              onSelect={() => setOpen(false)}
            >
              <CommandMenu.ItemIcon as={Settings} strokeWidth={2} />
              Settings
            </CommandMenu.Item>
            <CommandMenu.Item value="tips" keywords="help tips" onSelect={() => setOpen(false)}>
              <CommandMenu.ItemIcon as={Sparkles} strokeWidth={2} />
              Tips
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>

        <CommandMenu.Footer style={footerMutedStyle}>
          <Typography.Root variant="body-compact" tone="muted">
            Arrows and Enter work from the search field; groups hide when they have no visible
            items.
          </Typography.Root>
        </CommandMenu.Footer>
      </CommandMenu.Dialog>
    </>
  );
}
