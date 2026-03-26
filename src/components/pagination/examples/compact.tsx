import { Pagination } from "prime-ui-kit";
import * as React from "react";

/** Dense toolbar row: Pagination.Root with size="s". */
export default function CompactExample() {
  const [page, setPage] = React.useState(3);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "var(--prime-sys-spacing-x2)",
        padding: "var(--prime-sys-spacing-x2) var(--prime-sys-spacing-x3)",
        borderRadius: "var(--prime-sys-radius-m)",
        background: "var(--prime-sys-color-surface-default)",
        border: "1px solid var(--prime-sys-color-border-subtle)",
      }}
    >
      <span
        style={{
          fontSize: "var(--prime-sys-size-control-s-supportText)",
          color: "var(--prime-sys-color-content-secondary)",
        }}
      >
        Compact
      </span>
      <Pagination.Root page={page} totalPages={12} onPageChange={setPage} size="s" />
    </div>
  );
}
