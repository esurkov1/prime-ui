import { Button, Icon } from "prime-ui-kit";

/**
 * `Button.Icon` left, right, and icon-only with `aria-label` on root; primary filled and neutral stroke rows
 * (parity with `playground/snippets/button/composition.tsx`).
 */
export default function IconCompositionExample() {
  const rowStyle = {
    display: "flex" as const,
    flexWrap: "wrap" as const,
    gap: "var(--prime-sys-spacing-m)",
    alignItems: "center" as const,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-m)",
      }}
    >
      <div style={rowStyle}>
        <Button.Root variant="primary" mode="filled" size="m">
          <Button.Icon>
            <Icon name="field.email" size="s" />
          </Button.Icon>
          Button primary icon left
        </Button.Root>
        <Button.Root variant="primary" mode="filled" size="m">
          Button primary icon right
          <Button.Icon>
            <Icon name="action.close" size="s" />
          </Button.Icon>
        </Button.Root>
        <Button.Root variant="primary" mode="filled" size="m" aria-label="Button primary icon only">
          <Button.Icon>
            <Icon name="action.close" size="s" />
          </Button.Icon>
        </Button.Root>
      </div>
      <div style={rowStyle}>
        <Button.Root variant="neutral" mode="stroke" size="m">
          <Button.Icon>
            <Icon name="field.email" size="s" tone="subtle" />
          </Button.Icon>
          Button icon left
        </Button.Root>
        <Button.Root variant="neutral" mode="stroke" size="m">
          Button icon right
          <Button.Icon>
            <Icon name="action.close" size="s" tone="subtle" />
          </Button.Icon>
        </Button.Root>
        <Button.Root variant="neutral" mode="stroke" size="m" aria-label="Button icon only">
          <Button.Icon>
            <Icon name="action.close" size="s" tone="subtle" />
          </Button.Icon>
        </Button.Root>
      </div>
    </div>
  );
}
