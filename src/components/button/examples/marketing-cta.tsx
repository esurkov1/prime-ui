import { Button, Icon } from "prime-ui-kit";

/**
 * Marketing CTA stack: strong primary (`fancy` + `xl`), secondary outline with trailing icon.
 */
export default function MarketingCtaExample() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-m)",
      }}
    >
      <Button.Root variant="primary" mode="fancy" size="xl" fullWidth>
        Start free trial
      </Button.Root>
      <Button.Root variant="neutral" mode="stroke" size="l" fullWidth>
        Compare plans
        <Button.Icon>
          <Icon surface="none" name="nav.chevronRight" size="s" tone="subtle" />
        </Button.Icon>
      </Button.Root>
    </div>
  );
}
