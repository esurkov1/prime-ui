import { Pagination } from "@/components/pagination/Pagination";
import type { ControlSize } from "@/internal/states";

import styles from "./DataTable.module.css";

type FooterProps = {
  size: ControlSize;
  /** Range line («Показано 1–5 из 23»), or nothing. */
  range: string | null;
  pagination: { page: number; totalPages: number; onPageChange: (page: number) => void } | null;
  /** Infinite-scroll status, or nothing. */
  status: string | null;
};

/** Range line, Pagination and the infinite-scroll status under the table. */
export function Footer({ size, range, pagination, status }: FooterProps) {
  if (range === null && pagination === null && status === null) return null;
  return (
    <div className={styles.footer}>
      {range !== null ? <p className={styles.meta}>{range}</p> : null}
      {pagination ? (
        <Pagination
          className={styles.pagination}
          value={pagination.page}
          totalPages={pagination.totalPages}
          onValueChange={pagination.onPageChange}
          size={size}
          compact="auto"
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
