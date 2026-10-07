/** A list footer owns the page: changing rows per page returns it to page 1 — `value`, `onValueChange`. */
import { Card, Pagination, Select, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const TOTAL_INVOICES = 248;

export default function PaginationControlledExample() {
  const [perPage, setPerPage] = React.useState("25");
  const [page, setPage] = React.useState(2);

  const pageSize = Number(perPage);
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, TOTAL_INVOICES);

  return (
    <Card.Root>
      <div className={styles.footer}>
        <Typography.Root as="span" variant="body-s" tone="secondary">
          Счета {from}–{to} из {TOTAL_INVOICES}
        </Typography.Root>
        <div className={styles.controls}>
          <Select.Root
            size="s"
            value={perPage}
            onValueChange={(next) => {
              setPerPage(next);
              setPage(1);
            }}
          >
            <Select.Trigger aria-label="Строк на странице">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="10">10 строк</Select.Item>
              <Select.Item value="25">25 строк</Select.Item>
              <Select.Item value="50">50 строк</Select.Item>
            </Select.Content>
          </Select.Root>
          <Pagination
            size="s"
            value={page}
            onValueChange={setPage}
            totalPages={Math.ceil(TOTAL_INVOICES / pageSize)}
          />
        </div>
      </div>
    </Card.Root>
  );
}
