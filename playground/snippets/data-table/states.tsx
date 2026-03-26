import { DataTable, type DataTableColumn } from "@/components/data-table/DataTable";

import styles from "./data-table-demos.module.css";

type Row = { id: string; label: string };

const columns: DataTableColumn<Row>[] = [
  { id: "id", header: "Код", accessor: "id", minWidth: "6rem" },
  { id: "label", header: "Название", accessor: "label", minWidth: "12rem" },
];

export default function DataTableStatesSnippet() {
  return (
    <div className={`examplePreviewBleed ${styles.statesStack}`}>
      <div>
        <p className={styles.leadTight}>
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
        <p className={styles.leadTight}>
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
