import { Button, Icon } from "prime-ui-kit";

/**
 * Canonical composition: icon + label, multiple variants/modes, and controlled loading with Button.Spinner.
 */
export default function CanonicalCompositionExample() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-l)",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--prime-sys-spacing-m)",
          alignItems: "center",
        }}
      >
        <Button.Root variant="primary" mode="filled">
          <Button.Icon>
            <Icon name="action.copy" size="s" />
          </Button.Icon>
          Copy link
        </Button.Root>
        <Button.Root variant="neutral" mode="stroke">
          <Button.Icon>
            <Icon name="field.email" size="s" tone="subtle" />
          </Button.Icon>
          Contact sales
        </Button.Root>
        <Button.Root variant="error" mode="lighter">
          Remove from list
        </Button.Root>
      </div>
      <Button.Root variant="primary" mode="filled" loading>
        <Button.Spinner />
        Saving…
      </Button.Root>
    </div>
  );
}
