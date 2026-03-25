import * as React from "react";

import { Pagination } from "@/components/pagination/Pagination";
import ExampleSurface from "../../components/ExampleSurface";

import styles from "./rows.module.css";

/** «Назад» отключена на первой странице, «Вперёд» — на последней; при одной странице обе стрелки неактивны. */
export default function PaginationStatesSnippet() {
  const [first, setFirst] = React.useState(1);
  const [last, setLast] = React.useState(10);
  const [single, setSingle] = React.useState(1);

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <p className={styles.label}>Первая из десяти</p>
        <ExampleSurface>
          <Pagination.Root page={first} totalPages={10} onPageChange={setFirst} />
        </ExampleSurface>
      </div>
      <div className={styles.row}>
        <p className={styles.label}>Последняя из десяти</p>
        <ExampleSurface>
          <Pagination.Root page={last} totalPages={10} onPageChange={setLast} />
        </ExampleSurface>
      </div>
      <div className={styles.row}>
        <p className={styles.label}>Одна страница</p>
        <ExampleSurface>
          <Pagination.Root page={single} totalPages={1} onPageChange={setSingle} />
        </ExampleSurface>
      </div>
    </div>
  );
}
