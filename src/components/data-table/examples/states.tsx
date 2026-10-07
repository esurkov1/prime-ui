/** Loading skeleton (`loading` + `loadingRows`), `empty` and `error` with a retry button: the header stays, only the body changes. Use for every table backed by a request. */

import { Button, DataTable, type DataTableColumn, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

type Payment = { id: string; payer: string; amount: number };

const columns: DataTableColumn<Payment>[] = [
  { id: "id", header: "Платёж", accessor: "id" },
  { id: "payer", header: "Плательщик", accessor: "payer" },
  { id: "amount", header: "Сумма, ₽", accessor: "amount", numeric: true },
];

const none: Payment[] = [];

export default function DataTableStatesExample() {
  return (
    <div className={styles.statesGrid}>
      <div className={styles.group}>
        <Typography.Root variant="code" tone="muted">
          loading + loadingRows
        </Typography.Root>
        <DataTable.Root columns={columns} rows={none} loading loadingRows={3} />
      </div>
      <div className={styles.group}>
        <Typography.Root variant="code" tone="muted">
          empty
        </Typography.Root>
        <DataTable.Root columns={columns} rows={none} empty="Платежей за выбранный период нет" />
      </div>
      <div className={styles.group}>
        <Typography.Root variant="code" tone="muted">
          error
        </Typography.Root>
        <DataTable.Root
          columns={columns}
          rows={none}
          error={
            <div className={styles.errorBody}>
              Не удалось загрузить платежи
              <Button.Root variant="outline" tone="neutral" size="s">
                Повторить
              </Button.Root>
            </div>
          }
        />
      </div>
    </div>
  );
}
