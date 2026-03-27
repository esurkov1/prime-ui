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
        <Button.Root variant="primary" mode="filled">
          <Button.Icon>
            <Icon surface="none" name="field.email" size="s" />
          </Button.Icon>
          Button primary icon left
        </Button.Root>
        <Button.Root variant="primary" mode="filled">
          Button primary icon right
          <Button.Icon>
            <Icon surface="none" name="action.close" size="s" />
          </Button.Icon>
        </Button.Root>
        <Button.Root variant="primary" mode="filled" aria-label="Button primary icon only">
          <Button.Icon>
            <Icon surface="none" name="action.close" size="s" />
          </Button.Icon>
        </Button.Root>
      </div>
      <div style={rowStyle}>
        <Button.Root variant="neutral" mode="stroke">
          <Button.Icon>
            <Icon surface="none" name="field.email" size="s" tone="subtle" />
          </Button.Icon>
          Button icon left
        </Button.Root>
        <Button.Root variant="neutral" mode="stroke">
          Button icon right
          <Button.Icon>
            <Icon surface="none" name="action.close" size="s" tone="subtle" />
          </Button.Icon>
        </Button.Root>
        <Button.Root variant="neutral" mode="stroke" aria-label="Button icon only">
          <Button.Icon>
            <Icon surface="none" name="action.close" size="s" tone="subtle" />
          </Button.Icon>
        </Button.Root>
      </div>
    </div>
  );
}
