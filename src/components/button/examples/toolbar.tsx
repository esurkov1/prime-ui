import { Button, Icon } from "prime-ui-kit";

/**
 * Dense toolbar: ghost neutrals for secondary actions, primary action with icon + label.
 */
export default function ToolbarExample() {
  return (
    <div
      role="toolbar"
      aria-label="Document actions"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--prime-sys-spacing-s)",
        alignItems: "center",
      }}
    >
      <Button.Root variant="neutral" mode="ghost">
        Bold
      </Button.Root>
      <Button.Root variant="neutral" mode="ghost">
        Italic
      </Button.Root>
      <Button.Root variant="neutral" mode="ghost" aria-label="Insert link">
        <Button.Icon>
          <Icon name="field.email" size="s" tone="subtle" />
        </Button.Icon>
      </Button.Root>
      <span style={{ flex: 1, minWidth: "var(--prime-sys-spacing-m)" }} aria-hidden />
      <Button.Root variant="primary" mode="filled">
        <Button.Icon>
          <Icon name="action.upload" size="s" />
        </Button.Icon>
        Publish
      </Button.Root>
    </div>
  );
}
