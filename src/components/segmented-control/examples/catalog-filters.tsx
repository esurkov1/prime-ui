import { SegmentedControl, Typography } from "prime-ui-kit";
import * as React from "react";

type StockFilter = "all" | "in_stock" | "preorder";

function isStockFilter(value: string): value is StockFilter {
  return value === "all" || value === "in_stock" || value === "preorder";
}

/**
 * Compact filter strip: few exclusive scopes above a product grid (pair with Select when options grow).
 */
export default function CatalogFiltersExample() {
  const [stock, setStock] = React.useState<StockFilter>("all");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-s)",
        alignItems: "flex-start",
      }}
    >
      <Typography.Root as="span" variant="caption" tone="muted">
        Availability
      </Typography.Root>
      <SegmentedControl.Root
        value={stock}
        onValueChange={(v) => {
          if (isStockFilter(v)) setStock(v);
        }}
        size="s"
      >
        <SegmentedControl.Item value="all">All</SegmentedControl.Item>
        <SegmentedControl.Item value="in_stock">In stock</SegmentedControl.Item>
        <SegmentedControl.Item value="preorder">Pre-order</SegmentedControl.Item>
      </SegmentedControl.Root>
    </div>
  );
}
