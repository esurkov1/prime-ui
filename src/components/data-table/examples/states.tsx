/** Loading skeleton, an empty period and a load error with a retry: the head stays, only the body changes — `loading`, `loadingRows`, `empty`, `error`. */
import { Button, DataTable, type DataTableColumn, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

type Payment = { id: string; payer: string; amount: number };

const COLUMNS: DataTableColumn<Payment>[] = [
  { id: "id", header: "Платёж", accessor: "id" },
  { id: "payer", header: "Плательщик", accessor: "payer" },
  { id: "amount", header: "Сумма, ₽", accessor: "amount", numeric: true },
];

const NO_PAYMENTS: Payment[] = [];

export default function DataTableStatesExample() {
  return (
    <>
      <div className={styles.specimen}>
        <DataTable columns={COLUMNS} rows={NO_PAYMENTS} loading loadingRows={3} />
        <Typography as="span" variant="caption" tone="muted">
          loading · loadingRows=&#123;3&#125;
        </Typography>
      </div>
      <div className={styles.specimen}>
        <DataTable columns={COLUMNS} rows={NO_PAYMENTS} empty="Платежей за выбранный период нет" />
        <Typography as="span" variant="caption" tone="muted">
          empty
        </Typography>
      </div>
      <div className={styles.specimen}>
        <DataTable
          columns={COLUMNS}
          rows={NO_PAYMENTS}
          error={
            <>
              Не удалось загрузить платежи
              <Button.Root variant="outline" tone="neutral" size="s">
                Повторить
              </Button.Root>
            </>
          }
        />
        <Typography as="span" variant="caption" tone="muted">
          error
        </Typography>
      </div>
    </>
  );
}
