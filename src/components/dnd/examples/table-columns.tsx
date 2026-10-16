/** A sales report whose columns change places: the head row is a sortable list, a header is carried alone while the rows stay still and the gap opens among the headers where it lands, and the month column holds its place — `as`, `axis`, `locked`. */
import { Dnd, moveBefore, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Month = { id: string; month: string; deals: number; revenue: string; average: string };
type Column = { id: keyof Month; title: string; numeric: boolean; locked: boolean };

const COLUMNS: Column[] = [
  { id: "month", title: "Месяц", numeric: false, locked: true },
  { id: "deals", title: "Сделки", numeric: true, locked: false },
  { id: "revenue", title: "Выручка", numeric: true, locked: false },
  { id: "average", title: "Средний чек", numeric: true, locked: false },
];

const MONTHS: Month[] = [
  { id: "jul", month: "Июль", deals: 42, revenue: "3 150 000 ₽", average: "75 000 ₽" },
  { id: "aug", month: "Август", deals: 37, revenue: "2 960 000 ₽", average: "80 000 ₽" },
  { id: "sep", month: "Сентябрь", deals: 51, revenue: "4 080 000 ₽", average: "80 000 ₽" },
];

export default function DndTableColumnsExample() {
  const [columns, setColumns] = React.useState(COLUMNS);

  return (
    <Dnd.Root>
      <table className={styles.table}>
        <caption className={styles.caption}>
          <Typography as="span" variant="title-s">
            Продажи по месяцам
          </Typography>
        </caption>
        <thead>
          <Dnd.Sortable
            as="tr"
            axis="x"
            aria-label="Колонки отчёта"
            items={columns}
            getId={(column) => column.id}
            getLabel={(column) => column.title}
            onReorder={(id, beforeId) =>
              setColumns((current) => moveBefore(current, id, beforeId, (column) => column.id))
            }
            renderItem={(column) => (
              <Dnd.SortableItem
                id={column.id}
                locked={column.locked}
                scope="col"
                className={column.numeric ? styles.numeric : styles.cell}
              >
                <Typography as="span" variant="caption" tone="muted">
                  {column.title}
                </Typography>
              </Dnd.SortableItem>
            )}
          />
        </thead>
        <tbody>
          {MONTHS.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.id} className={column.numeric ? styles.numeric : styles.cell}>
                  <Typography as="span" variant="body-m">
                    {row[column.id]}
                  </Typography>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Dnd.Root>
  );
}
