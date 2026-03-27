import { Icon, LinkButton } from "prime-ui-kit";

/** Icons inside root pick up control size context — mirrors [`playground/snippets/link-button/composition.tsx`](../../../../playground/snippets/link-button/composition.tsx). */
export default function LinkButtonCompositionExample() {
  const rowStyle = {
    display: "flex" as const,
    flexWrap: "wrap" as const,
    gap: "var(--prime-sys-spacing-m)",
    alignItems: "center" as const,
  };

  return (
    <div style={rowStyle}>
      <LinkButton.Root href="#">
        <Icon surface="none" name="field.email" size="s" />
        Link with icon on the left
      </LinkButton.Root>
      <LinkButton.Root href="#">
        Icon on the right
        <Icon surface="none" name="action.close" size="s" />
      </LinkButton.Root>
      <LinkButton.Root href="#" aria-label="Open profile">
        <Icon surface="none" name="field.email" size="s" />
      </LinkButton.Root>
    </div>
  );
}
