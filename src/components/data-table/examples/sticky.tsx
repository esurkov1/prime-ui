/** `stickyHeader` and `stickyFirstColumn` while scrolling both ways inside a `scrollHeight` window. Use for wide reports (months × regions). */

import { DataTable, type DataTableColumn } from "prime-ui-kit";

type Region = { region: string } & Record<`m${number}`, number>;

const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
const regions = [
  "Москва",
  "Санкт-Петербург",
  "Новосибирск",
  "Екатеринбург",
  "Казань",
  "Нижний Новгород",
  "Челябинск",
  "Самара",
  "Омск",
  "Ростов-на-Дону",
  "Уфа",
  "Красноярск",
  "Воронеж",
  "Пермь",
];

const rows: Region[] = regions.map((region, r) => {
  const row = { region } as Region;
  months.forEach((_, m) => {
    row[`m${m}`] = 120 + ((r * 37 + m * 53) % 480);
  });
  return row;
});

const int = new Intl.NumberFormat("ru-RU");

const columns: DataTableColumn<Region>[] = [
  { id: "region", header: "Регион", accessor: "region", minWidth: "10rem" },
  ...months.map(
    (label, m): DataTableColumn<Region> => ({
      id: `m${m}`,
      header: label,
      numeric: true,
      minWidth: "5rem",
      cell: (row) => int.format(row[`m${m}`]),
    }),
  ),
];

export default function DataTableStickyExample() {
  return (
    <DataTable.Root
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.region}
      stickyHeader
      stickyFirstColumn
      infiniteScroll
      initialVisibleRows={rows.length}
      scrollHeight={280}
    />
  );
}
