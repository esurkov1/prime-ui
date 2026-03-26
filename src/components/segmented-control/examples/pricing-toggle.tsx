import { SegmentedControl, Typography } from "prime-ui-kit";
import * as React from "react";

type BillingCycle = "monthly" | "annual";

function isBillingCycle(value: string): value is BillingCycle {
  return value === "monthly" || value === "annual";
}

/**
 * SaaS-style billing cycle toggle: two clear options, often paired with price copy elsewhere.
 */
export default function PricingToggleExample() {
  const [cycle, setCycle] = React.useState<BillingCycle>("monthly");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-m)",
        alignItems: "flex-start",
      }}
    >
      <SegmentedControl.Root
        value={cycle}
        onValueChange={(v) => {
          if (isBillingCycle(v)) setCycle(v);
        }}
        size="m"
      >
        <SegmentedControl.Item value="monthly">Monthly</SegmentedControl.Item>
        <SegmentedControl.Item value="annual">Annual</SegmentedControl.Item>
      </SegmentedControl.Root>
      <Typography.Root as="p" variant="body-compact" tone="muted">
        Showing prices for <strong>{cycle === "monthly" ? "monthly" : "annual"}</strong> billing.
      </Typography.Root>
    </div>
  );
}
