import * as React from "react";

import { Pagination } from "@/components/pagination/Pagination";
import ExampleSurface from "../../components/ExampleSurface";

import styles from "./rows.module.css";

/** siblingCount меняет ширину «окна» номеров вокруг текущей; при totalPages &lt; 1 ничего не рисуется. */
export default function PaginationFeaturesSnippet() {
  const [pageNarrow, setPageNarrow] = React.useState(8);
  const [pageWide, setPageWide] = React.useState(8);

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <p className={styles.label}>
          <code>siblingCount=0</code>
        </p>
        <ExampleSurface>
          <Pagination.Root
            page={pageNarrow}
            totalPages={20}
            onPageChange={setPageNarrow}
            siblingCount={0}
          />
        </ExampleSurface>
      </div>
      <div className={styles.row}>
        <p className={styles.label}>
          <code>siblingCount=2</code>
        </p>
        <ExampleSurface>
          <Pagination.Root
            page={pageWide}
            totalPages={20}
            onPageChange={setPageWide}
            siblingCount={2}
          />
        </ExampleSurface>
      </div>
      <div className={styles.row}>
        <p className={styles.label}>
          <code>totalPages=0</code>
        </p>
        <ExampleSurface>
          <div className={styles.emptySlot}>
            <Pagination.Root page={1} totalPages={0} onPageChange={() => {}} />
            <span className={styles.emptyHint}>пустой вывод</span>
          </div>
        </ExampleSurface>
      </div>
    </div>
  );
}
