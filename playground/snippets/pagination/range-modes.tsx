import * as React from "react";

import { Pagination } from "@/components/pagination/Pagination";
import ExampleSurface from "../../components/ExampleSurface";

import styles from "./rows.module.css";

/** До 7 страниц показываются все номера; при большем числе — сокращённый ряд с «…». */
export default function PaginationRangeModesSnippet() {
  const [shortPage, setShortPage] = React.useState(3);
  const [longPage, setLongPage] = React.useState(8);

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <p className={styles.label}>5 страниц — все номера</p>
        <ExampleSurface>
          <Pagination.Root page={shortPage} totalPages={5} onPageChange={setShortPage} />
        </ExampleSurface>
      </div>
      <div className={styles.row}>
        <p className={styles.label}>20 страниц — многоточие</p>
        <ExampleSurface>
          <Pagination.Root page={longPage} totalPages={20} onPageChange={setLongPage} />
        </ExampleSurface>
      </div>
    </div>
  );
}
