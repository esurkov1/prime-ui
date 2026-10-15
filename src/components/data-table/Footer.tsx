import { Pagination } from "@/components/pagination/Pagination";

import styles from "./DataTable.module.css";

type FooterProps = {
  /** Range line («Показано 1–5 из 23»), or nothing. */
  range: string | null;
  pagination: { page: number; totalPages: number; onPageChange: (page: number) => void } | null;
  /** Infinite-scroll status, or nothing. */
  status: string | null;
};

/** Range line, Pagination (the table's tier from context) and the infinite-scroll status under the table. */
export function Footer({ range, pagination, status }: FooterProps) {
  if (range === null && pagination === null && status === null) return null;
  return (
    <div className={styles.footer}>
      {range !== null ? <p className={styles.meta}>{range}</p> : null}
      {pagination ? (
        <Pagination
          className={styles.pagination}
          align="end"
          value={pagination.page}
          totalPages={pagination.totalPages}
          onValueChange={pagination.onPageChange}
        />
      ) : null}
      {status !== null ? (
        <p className={styles.meta} aria-live="polite">
          {status}
        </p>
      ) : null}
    </div>
  );
}
