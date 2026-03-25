import { DataTable, type DataTableColumn } from "@/components/data-table/DataTable";

type Row = { id: string; label: string };

const columns: DataTableColumn<Row>[] = [
  { id: "id", header: "Код", accessor: "id", minWidth: "6rem" },
  { id: "label", header: "Название", accessor: "label", minWidth: "12rem" },
];

export default function DataTableStatesSnippet() {
  return (
    <div
      className="examplePreviewBleed"
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      <div>
        <p
          style={{
            margin: "0 0 0.5rem",
            fontSize: "var(--prime-sys-size-control-s-supportText)",
            color: "var(--prime-sys-color-content-secondary)",
          }}
        >
          <code>loading</code> при пустом наборе строк: одна строка с <code>loadingText</code>.
        </p>
        <DataTable.Root
          columns={columns}
          rows={[]}
          loading
          loadingText="Загружаем справочник…"
          showPagination={false}
          pageSize={10}
        />
      </div>
      <div>
        <p
          style={{
            margin: "0 0 0.5rem",
            fontSize: "var(--prime-sys-size-control-s-supportText)",
            color: "var(--prime-sys-color-content-secondary)",
          }}
        >
          Пустой список: <code>emptyText</code> вместо строк данных.
        </p>
        <DataTable.Root
          columns={columns}
          rows={[]}
          loading={false}
          emptyText="Пока нет ни одной записи — добавьте первую через кнопку «Создать»."
          showPagination={false}
          pageSize={10}
        />
      </div>
    </div>
  );
}
