/** Pipeline stages put in order by a grip at the end of the row, at its start or by the whole row, or with Alt + ↑ / ↓; each move is saved with a spinner in its grip, and sorting by a column turns reordering off — `onReorder`, `reorderHandle`, `getRowLabel`. */
import { Badge, DataTable, type DataTableColumn, moveBefore, SegmentedControl } from "prime-ui-kit";
import * as React from "react";

type Stage = { id: string; name: string; owner: string; deals: number; probability: number };
type Handle = "end" | "start" | "row";

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

const HANDLES: { value: Handle; label: string }[] = [
  { value: "end", label: "Ручка в конце" },
  { value: "start", label: "Ручка в начале" },
  { value: "row", label: "Вся строка" },
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
  const [handle, setHandle] = React.useState<Handle>("end");
  return (
    <DataTable
      columns={COLUMNS}
      rows={stages}
      paging="none"
      getRowKey={(row) => row.id}
      getRowLabel={(row) => row.name}
      reorderHandle={handle}
      toolbar={
        <SegmentedControl.Root
          value={handle}
          onValueChange={(next) => setHandle(next as Handle)}
          aria-label="За что брать строку"
        >
          {HANDLES.map((item) => (
            <SegmentedControl.Item key={item.value} value={item.value}>
              {item.label}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      }
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
