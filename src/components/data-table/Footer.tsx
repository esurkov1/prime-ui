import { Pagination } from "@/components/pagination/Pagination";
import { Spinner } from "@/components/spinner/Spinner";
import { cx } from "@/internal/cx";
import { usePartPresence } from "@/internal/partPresence";

import styles from "./DataTable.module.css";

type FooterProps = {
  /** Range line («Показано 1–5 из 23», `showRange`), or nothing. */
  range: string | null;
  pagination: { page: number; totalPages: number; onPageChange: (page: number) => void } | null;
  /** The status while more rows load (infinite scroll), or nothing. */
  status: string | null;
};

/**
 * Range line, Pagination (the table's tier from context) and the loading status of infinite scroll
 * under the table. With nothing to show there is no footer; one that comes and goes (the status of
 * a request) rises in and closes up in place.
 */
export function Footer({ range, pagination, status }: FooterProps) {
  const present = range !== null || pagination !== null || status !== null;
  const presence = usePartPresence<HTMLDivElement>({ present, axis: "block" });
  if (!present) return null;
  return (
    <div ref={presence.ref} className={cx(styles.footer, presence.className)}>
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
      {/* The table announces the status itself (a live region that stays mounted). */}
      {status !== null ? (
        <p className={cx(styles.meta, styles.status)} aria-hidden="true">
          <Spinner aria-hidden="true" />
          {status}
        </p>
      ) : null}
    </div>
  );
}
