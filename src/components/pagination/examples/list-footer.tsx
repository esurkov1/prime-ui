/** List footer: record range on the left, a rows-per-page Select and an `s` pagination on the right; the right group wraps under the range on narrow widths. Use under lists and tables. */
import { Pagination, Select, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const TOTAL = 248;

export default function PaginationListFooterExample() {
  const [perPage, setPerPage] = React.useState("25");
  const [page, setPage] = React.useState(2);

  const size = Number(perPage);
  const totalPages = Math.ceil(TOTAL / size);
  const from = (page - 1) * size + 1;
  const to = Math.min(page * size, TOTAL);

  return (
    <div className={styles.footer}>
      <Typography.Root as="span" variant="body-s" tone="secondary" className={styles.summary}>
        {from}–{to} из {TOTAL}
      </Typography.Root>
      <div className={styles.controls}>
        <div className={styles.perPage}>
          <Typography.Root as="span" variant="body-s" tone="secondary">
            Строк на странице
          </Typography.Root>
          <Select.Root
            size="s"
            value={perPage}
            onValueChange={(value) => {
              setPerPage(value);
              setPage(1);
            }}
          >
            <Select.Trigger aria-label="Строк на странице">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="10">10</Select.Item>
              <Select.Item value="25">25</Select.Item>
              <Select.Item value="50">50</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
        <Pagination.Root size="s" value={page} totalPages={totalPages} onValueChange={setPage} />
      </div>
    </div>
  );
}
