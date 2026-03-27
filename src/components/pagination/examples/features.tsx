import { Pagination } from "prime-ui-kit";
import * as React from "react";

/**
 * `siblingCount` widens or narrows the numeric window; `totalPages < 1` renders nothing.
 * Parity with `playground/snippets/pagination/features.tsx`.
 */
export default function PaginationFeaturesExample() {
  const [pageNarrow, setPageNarrow] = React.useState(8);
  const [pageWide, setPageWide] = React.useState(8);

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
          <code>siblingCount=0</code>
        </p>
        <Pagination.Root
          page={pageNarrow}
          totalPages={20}
          onPageChange={setPageNarrow}
          siblingCount={0}
        />
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
          <code>siblingCount=2</code>
        </p>
        <Pagination.Root
          page={pageWide}
          totalPages={20}
          onPageChange={setPageWide}
          siblingCount={2}
        />
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
          <code>totalPages=0</code>
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "var(--prime-sys-spacing-x2)",
            minHeight: "var(--prime-sys-size-control-m-height)",
          }}
        >
          <Pagination.Root page={1} totalPages={0} onPageChange={() => {}} />
          <span
            style={{
              fontSize: "var(--prime-sys-size-control-s-supportText)",
              color: "var(--prime-sys-color-content-muted)",
            }}
          >
            empty output
          </span>
        </div>
      </div>
    </div>
  );
}
