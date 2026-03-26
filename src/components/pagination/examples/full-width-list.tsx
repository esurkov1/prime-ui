import { Pagination } from "prime-ui-kit";
import * as React from "react";

/** Full-width bar: meta on the left, Pagination.Root on the right (parent layout). */
export default function FullWidthListExample() {
  const [page, setPage] = React.useState(2);
  const totalPages = 21;

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        maxWidth: "36rem",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--prime-sys-spacing-x3)",
        flexWrap: "wrap",
        padding: "var(--prime-sys-spacing-x3) var(--prime-sys-spacing-x4)",
        borderRadius: "var(--prime-sys-radius-m)",
        background: "var(--prime-sys-color-surface-raised)",
        border: "1px solid var(--prime-sys-color-border-subtle)",
      }}
    >
      <span
        style={{
          fontSize: "var(--prime-sys-size-control-s-supportText)",
          color: "var(--prime-sys-color-content-secondary)",
          lineHeight: "var(--prime-sys-typography-body-lineHeight)",
        }}
      >
        Showing 21–40 of 412
      </span>
      <Pagination.Root page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
