import { SegmentedControl, Typography } from "prime-ui-kit";
import * as React from "react";

type CatalogView = "list" | "grid" | "table";

function isCatalogView(value: string): value is CatalogView {
  return value === "list" || value === "grid" || value === "table";
}

/**
 * Catalog or dashboard view mode: mutually exclusive layout, state owned by the parent.
 */
export default function ViewModeExample() {
  const [view, setView] = React.useState<CatalogView>("list");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-m)",
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
        <Typography.Root as="span" variant="body-compact" tone="muted">
          View
        </Typography.Root>
        <SegmentedControl.Root
          value={view}
          onValueChange={(v) => {
            if (isCatalogView(v)) setView(v);
          }}
        >
          <SegmentedControl.Item value="list">List</SegmentedControl.Item>
          <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
          <SegmentedControl.Item value="table">Table</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <Typography.Root as="p" variant="body-default" tone="muted">
        Active layout: <strong>{view}</strong>
      </Typography.Root>
    </div>
  );
}
