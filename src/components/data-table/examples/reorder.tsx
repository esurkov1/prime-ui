/** Pipeline stages put in order by the handle or Alt + ↑ / ↓; each move is saved with a spinner in its handle, and sorting by a column turns the handles off — `onReorder`, `getRowLabel`. */
import { Badge, DataTable, type DataTableColumn, moveBefore } from "prime-ui-kit";
import * as React from "react";

type Stage = { id: string; name: string; owner: string; deals: number; probability: number };

const STAGES: Stage[] = [
  { id: "lead", name: "Новый лид", owner: "Отдел продаж", deals: 48, probability: 10 },
  { id: "call", name: "Первый звонок", owner: "Отдел продаж", deals: 31, probability: 20 },
  { id: "demo", name: "Демонстрация", owner: "Пресейл", deals: 17, probability: 40 },
  {
    id: "offer",
    name: "Коммерческое предложение",
    owner: "Отдел продаж",
    deals: 12,
    probability: 60,
  },
  { id: "contract", name: "Договор", owner: "Юристы", deals: 6, probability: 80 },
  { id: "payment", name: "Оплата", owner: "Бухгалтерия", deals: 4, probability: 95 },
];

const COLUMNS: DataTableColumn<Stage>[] = [
  { id: "name", header: "Этап", accessor: "name", hideable: false },
  { id: "owner", header: "Ответственный", accessor: "owner" },
  { id: "deals", header: "Сделки", accessor: "deals", numeric: true, sortable: true },
  {
    id: "probability",
    header: "Вероятность",
    accessor: "probability",
    sortable: true,
    align: "end",
    cell: (row) => <Badge.Root>{row.probability}%</Badge.Root>,
  },
];

/** Stands in for the request that saves the new order. */
const saveOrder = () => new Promise<void>((resolve) => setTimeout(resolve, 700));

export default function DataTableReorderExample() {
  const [stages, setStages] = React.useState(STAGES);
  return (
    <DataTable
      columns={COLUMNS}
      rows={stages}
      paging="none"
      getRowKey={(row) => row.id}
      getRowLabel={(row) => row.name}
      onReorder={async (id, beforeId) => {
        await saveOrder();
        setStages((current) =>
          moveBefore(
            current,
            String(id),
            beforeId === null ? null : String(beforeId),
            (row) => row.id,
          ),
        );
      }}
    />
  );
}
