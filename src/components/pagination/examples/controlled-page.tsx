import { Button, Pagination } from "prime-ui-kit";
import * as React from "react";

const TOTAL = 12;

/** Page index lives in parent state; Pagination.Root and buttons share the same setter. */
export default function ControlledPageExample() {
  const [page, setPage] = React.useState(4);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--prime-sys-spacing-x3)",
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
        Open page {page} of {TOTAL} — updates via <code>page</code> and <code>onPageChange</code>.
      </p>
      <Pagination.Root page={page} totalPages={TOTAL} onPageChange={setPage} />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--prime-sys-spacing-x2)",
        }}
      >
        <Button.Root
          size="s"
          variant="neutral"
          mode="stroke"
          onClick={() => setPage(1)}
          disabled={page <= 1}
        >
          First
        </Button.Root>
        <Button.Root
          size="s"
          variant="neutral"
          mode="stroke"
          onClick={() => setPage(TOTAL)}
          disabled={page >= TOTAL}
        >
          Last
        </Button.Root>
      </div>
    </div>
  );
}
