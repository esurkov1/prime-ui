/** Pagination at every size tier next to a Button of the same size; heights match (28–48). Use to align the pager with neighbouring controls. */
import { Button, type ControlSize, Pagination, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const sizes: ControlSize[] = ["xs", "s", "m", "l", "xl"];

export default function PaginationSizesExample() {
  const [page, setPage] = React.useState(4);

  return (
    <div className={styles.sizeGrid}>
      {sizes.map((size) => (
        <React.Fragment key={size}>
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
          <Pagination.Root size={size} value={page} totalPages={12} onValueChange={setPage} />
          <Button.Root variant="outline" tone="neutral" size={size}>
            Кнопка {size}
          </Button.Root>
        </React.Fragment>
      ))}
    </div>
  );
}
