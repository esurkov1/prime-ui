import { Pagination } from "prime-ui-kit";
import * as React from "react";

const PAGE_SIZE = 10;
const TOTAL_ROWS = 247;

function rangeLabel(page: number, pageSize: number, total: number) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return `Showing ${start}–${end} of ${total}`;
}

/** Table-style footer: row summary plus Pagination.Root aligned on one row. */
export default function TableFooterExample() {
  const [page, setPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(TOTAL_ROWS / PAGE_SIZE));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "var(--prime-sys-radius-m)",
        border: "1px solid var(--prime-sys-color-border-subtle)",
        background: "var(--prime-sys-color-surface-raised)",
        overflow: "hidden",
        maxWidth: "42rem",
      }}
    >
      <div
        style={{
          padding: "var(--prime-sys-spacing-x3) var(--prime-sys-spacing-x4)",
          borderBottom: "1px solid var(--prime-sys-color-border-subtle)",
          fontSize: "var(--prime-sys-size-control-s-supportText)",
          color: "var(--prime-sys-color-content-secondary)",
        }}
      >
        Sample rows (page {page} of {totalPages})
      </div>
      <div
        style={{
          padding: "var(--prime-sys-spacing-x4)",
          minHeight: "6rem",
          color: "var(--prime-sys-color-content-muted)",
          fontSize: "var(--prime-sys-size-control-s-supportText)",
        }}
      >
        …
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--prime-sys-spacing-x3)",
          padding: "var(--prime-sys-spacing-x3) var(--prime-sys-spacing-x4)",
          borderTop: "1px solid var(--prime-sys-color-border-subtle)",
        }}
      >
        <span
          style={{
            fontSize: "var(--prime-sys-size-control-s-supportText)",
            color: "var(--prime-sys-color-content-secondary)",
            lineHeight: "var(--prime-sys-typography-body-lineHeight)",
          }}
        >
          {rangeLabel(page, PAGE_SIZE, TOTAL_ROWS)}
        </span>
        <Pagination.Root page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
