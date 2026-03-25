import { DataTable, type DataTableColumn } from "@/components/data-table/DataTable";

export type PlaygroundApiPropRow = {
  prop: string;
  type: string;
  defaultValue: string;
  required: string;
  description: string;
};

type PropRow = PlaygroundApiPropRow;

const apiColumns: DataTableColumn<PropRow>[] = [
  { id: "prop", header: "Проп", accessor: "prop", width: "160px" },
  { id: "type", header: "Тип", accessor: "type", width: "200px" },
  { id: "default", header: "По умолчанию", accessor: "defaultValue", width: "120px" },
  { id: "required", header: "Обяз.", accessor: "required", width: "64px" },
  { id: "description", header: "Описание", accessor: "description" },
];

export function PlaygroundApiTable({ rows }: { rows: PropRow[] }) {
  return (
    <DataTable.Root
      columns={apiColumns}
      rows={rows}
      size="s"
      showPagination={false}
      pageSize={999}
      highlightRowOnHover={false}
    />
  );
}
