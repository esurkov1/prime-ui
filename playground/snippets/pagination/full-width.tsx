import * as React from "react";

import { Pagination } from "@/components/pagination/Pagination";

import styles from "./full-width.module.css";

/** Панель на всю ширину контейнера: слева подпись, справа пагинация — через обычную вёрстку, без отдельного пропа. */
export default function PaginationFullWidthSnippet() {
  const [page, setPage] = React.useState(2);

  return (
    <div className={styles.toolbar}>
      <span className={styles.meta}>Показано 21–40 из 412</span>
      <Pagination.Root page={page} totalPages={21} onPageChange={setPage} />
    </div>
  );
}
