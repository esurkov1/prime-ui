/** `compact` (arrows + «current / total») and `compact="auto"` that fills its parent and switches below 22rem of container width. Use in narrow cards, mobile footers and table footers. */
import { Pagination, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function PaginationCompactExample() {
  const [page, setPage] = React.useState(3);

  return (
    <div className={styles.stack}>
      <div className={styles.group}>
        <Typography.Root as="span" variant="caption" tone="muted">
          compact
        </Typography.Root>
        <Pagination.Root compact value={page} totalPages={12} onValueChange={setPage} />
      </div>
      <div className={styles.group}>
        <Typography.Root as="span" variant="caption" tone="muted">
          compact="auto" · 36rem
        </Typography.Root>
        <div className={styles.wide}>
          <Pagination.Root compact="auto" value={page} totalPages={12} onValueChange={setPage} />
        </div>
      </div>
      <div className={styles.group}>
        <Typography.Root as="span" variant="caption" tone="muted">
          compact="auto" · 20rem
        </Typography.Root>
        <div className={styles.narrow}>
          <Pagination.Root compact="auto" value={page} totalPages={12} onValueChange={setPage} />
        </div>
      </div>
    </div>
  );
}
