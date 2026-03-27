import { Pagination } from "prime-ui-kit";
import * as React from "react";

/**
 * Up to seven pages: all indices shown; more pages: shortened row with ellipses (`totalPages` drives logic).
 * Parity with `playground/snippets/pagination/range-modes.tsx`.
 */
export default function PaginationRangeModesExample() {
  const [shortPage, setShortPage] = React.useState(3);
  const [longPage, setLongPage] = React.useState(8);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-x4)",
      }}
    >
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
          Five pages — all numbers
        </p>
        <Pagination.Root page={shortPage} totalPages={5} onPageChange={setShortPage} />
      </div>
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
          Twenty pages — ellipsis
        </p>
        <Pagination.Root page={longPage} totalPages={20} onPageChange={setLongPage} />
      </div>
    </div>
  );
}
