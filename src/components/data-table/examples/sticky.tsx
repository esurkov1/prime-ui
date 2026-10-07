/** Monthly sales by region in a 280 px window: the head and the region column stay while scrolling both ways — `stickyHeader`, `stickyFirstColumn`, `scrollHeight`. */
import { DataTable, type DataTableColumn } from "prime-ui-kit";

type Region = { region: string; sales: number[] };

const MONTHS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
const REGIONS = [
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
];

const SALES: Region[] = REGIONS.map((region, r) => ({
  region,
  sales: MONTHS.map((_, m) => 120 + ((r * 37 + m * 53) % 480)),
}));

const INT = new Intl.NumberFormat("ru-RU");

const COLUMNS: DataTableColumn<Region>[] = [
  { id: "region", header: "Регион", accessor: "region", minWidth: "10rem" },
  ...MONTHS.map(
    (label, m): DataTableColumn<Region> => ({
      id: label,
      header: label,
      numeric: true,
      minWidth: "5rem",
      cell: (row) => INT.format(row.sales[m]),
    }),
  ),
];

export default function DataTableStickyExample() {
  return (
    <DataTable
      columns={COLUMNS}
      rows={SALES}
      getRowKey={(row) => row.region}
      paging="none"
      stickyHeader
      stickyFirstColumn
      scrollHeight={280}
    />
  );
}
