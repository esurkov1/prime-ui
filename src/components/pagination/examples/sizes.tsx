import { Pagination, type PaginationSize } from "prime-ui-kit";
import * as React from "react";

function PaginationSizeRow({ size }: { size: PaginationSize }) {
  const [page, setPage] = React.useState(8);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-x2)",
        alignItems: "flex-start",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "var(--prime-sys-size-control-s-supportText)",
          color: "var(--prime-sys-color-content-secondary)",
        }}
      >
        {size}
      </p>
      <Pagination.Root page={page} totalPages={20} onPageChange={setPage} size={size} />
    </div>
  );
}

/**
 * Four control tiers on a long page row (arrows, numbers, ellipsis share one scale per `size`).
 * Parity with `playground/snippets/pagination/sizes.tsx`.
 */
export default function PaginationSizesExample() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-x4)",
        alignItems: "center",
      }}
    >
      <PaginationSizeRow size="s" />
      <PaginationSizeRow size="m" />
      <PaginationSizeRow size="l" />
      <PaginationSizeRow size="xl" />
    </div>
  );
}
