import * as React from "react";

import { Pagination, type PaginationSize } from "@/components/pagination/Pagination";
import ExampleSurface from "../../components/ExampleSurface";

import styles from "./sizes.module.css";

function PaginationSizeRow({ size }: { size: PaginationSize }) {
  const [page, setPage] = React.useState(8);

  return (
    <div className={styles.row}>
      <p className={styles.label}>{size}</p>
      <ExampleSurface>
        <Pagination.Root page={page} totalPages={20} onPageChange={setPage} size={size} />
      </ExampleSurface>
    </div>
  );
}

/** Четыре размера на длинном ряду: стрелки, номера и «…» в одном визуальном ярусе. */
export default function PaginationSizesSnippet() {
  return (
    <div className={styles.root}>
      <PaginationSizeRow size="s" />
      <PaginationSizeRow size="m" />
      <PaginationSizeRow size="l" />
      <PaginationSizeRow size="xl" />
    </div>
  );
}
