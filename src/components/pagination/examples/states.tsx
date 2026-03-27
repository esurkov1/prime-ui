import { Pagination } from "prime-ui-kit";
import * as React from "react";

/**
 * Previous disabled on first page, next on last; both disabled when `totalPages` is 1.
 * Parity with `playground/snippets/pagination/states.tsx`.
 */
export default function PaginationStatesExample() {
  const [first, setFirst] = React.useState(1);
  const [last, setLast] = React.useState(10);
  const [single, setSingle] = React.useState(1);

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
          First of ten
        </p>
        <Pagination.Root page={first} totalPages={10} onPageChange={setFirst} />
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
          Last of ten
        </p>
        <Pagination.Root page={last} totalPages={10} onPageChange={setLast} />
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
          Single page
        </p>
        <Pagination.Root page={single} totalPages={1} onPageChange={setSingle} />
      </div>
    </div>
  );
}
