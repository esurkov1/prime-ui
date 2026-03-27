import { ArrowDown, ArrowUp, CornerDownLeft, Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { CommandMenu } from "@/components/command-menu/CommandMenu";

const inputIconStyle: React.CSSProperties = {
  width: "var(--prime-sys-size-control-m-icon)",
  height: "var(--prime-sys-size-control-m-icon)",
  color: "var(--prime-sys-color-content-muted)",
  flexShrink: 0,
};

const footerRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "var(--prime-sys-spacing-x3)",
};

const footerHintStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--prime-sys-spacing-x2)",
};

const footerTextStyle: React.CSSProperties = {
  fontSize: "var(--prime-sys-size-control-s-supportText)",
  lineHeight: "var(--prime-sys-typography-body-lineHeight)",
  color: "var(--prime-sys-color-content-secondary)",
};

/**
 * App-wide command palette: routes and settings, keyboard legend in the footer.
 */
export default function CommandMenuExampleAppPalette() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Button.Root variant="primary" onClick={() => setOpen(true)}>
        Open palette (⌘K / Ctrl+K)
      </Button.Root>

      <CommandMenu.Dialog open={open} onOpenChange={setOpen} aria-labelledby="palette-title">
        <CommandMenu.DialogTitle id="palette-title">Go to</CommandMenu.DialogTitle>
        <CommandMenu.DialogDescription>
          Type to filter pages and settings.
        </CommandMenu.DialogDescription>

        <CommandMenu.InputRow
          leading={<Search style={inputIconStyle} strokeWidth={2} aria-hidden />}
        >
          <CommandMenu.Input placeholder="Where to…" aria-label="Search commands" />
        </CommandMenu.InputRow>

        <CommandMenu.List>
          <CommandMenu.Group heading="Pages">
            <CommandMenu.Item
              value="dashboard"
              keywords="home overview"
              onSelect={() => setOpen(false)}
            >
              Dashboard
            </CommandMenu.Item>
            <CommandMenu.Item
              value="reports"
              keywords="analytics charts metrics"
              onSelect={() => setOpen(false)}
            >
              Reports
            </CommandMenu.Item>
            <CommandMenu.Item
              value="team"
              keywords="people members"
              onSelect={() => setOpen(false)}
            >
              Team
            </CommandMenu.Item>
          </CommandMenu.Group>
          <CommandMenu.Group heading="Settings">
            <CommandMenu.Item
              value="account"
              keywords="profile billing plan"
              onSelect={() => setOpen(false)}
            >
              Account
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>

        <CommandMenu.Footer>
          <div style={footerRowStyle}>
            <div style={footerHintStyle}>
              <CommandMenu.FooterKeyBox>
                <ArrowUp size={14} strokeWidth={2} aria-hidden />
              </CommandMenu.FooterKeyBox>
              <CommandMenu.FooterKeyBox>
                <ArrowDown size={14} strokeWidth={2} aria-hidden />
              </CommandMenu.FooterKeyBox>
              <span style={footerTextStyle}>Navigate</span>
            </div>
            <div style={footerHintStyle}>
              <CommandMenu.FooterKeyBox>
                <CornerDownLeft size={14} strokeWidth={2} aria-hidden />
              </CommandMenu.FooterKeyBox>
              <span style={footerTextStyle}>Select</span>
            </div>
            <div style={footerHintStyle}>
              <CommandMenu.FooterKeyBox tone="muted">Esc</CommandMenu.FooterKeyBox>
              <span style={footerTextStyle}>Close</span>
            </div>
          </div>
        </CommandMenu.Footer>
      </CommandMenu.Dialog>
    </>
  );
}
