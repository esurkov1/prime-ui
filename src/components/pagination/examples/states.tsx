/** Disabled arrows at the edges, no ellipsis up to 7 pages, and the window around the current page set by `siblingCount`. Use to choose the range behaviour. */
import { Pagination, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

function Example({
  label,
  total,
  start,
  siblings,
}: {
  label: string;
  total: number;
  start: number;
  siblings?: number;
}) {
  const [page, setPage] = React.useState(start);
  return (
    <div className={styles.group}>
      <Typography.Root as="span" variant="caption" tone="muted">
        {label}
      </Typography.Root>
      <Pagination.Root
        value={page}
        totalPages={total}
        siblingCount={siblings}
        onValueChange={setPage}
      />
    </div>
  );
}

export default function PaginationStatesExample() {
  return (
    <div className={styles.stack}>
      <Example label="первая страница — «назад» отключена" total={12} start={1} />
      <Example label="последняя — «вперёд» отключена" total={12} start={12} />
      <Example label="5 страниц — без многоточия" total={5} start={3} />
      <Example label="середина, siblingCount=1" total={40} start={20} />
      <Example label="середина, siblingCount=2" total={40} start={20} siblings={2} />
    </div>
  );
}
