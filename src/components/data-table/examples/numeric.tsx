/** An inventory report: number columns align to the end in tabular figures, a long name stays on one line with a title, formatted cells sort by their raw number and article numbers in natural order — `numeric`, `truncate`, `maxWidth`, `sortAccessor`, `sortComparator`. */
import { DataTable, type DataTableColumn } from "prime-ui-kit";

type Sku = {
  sku: string;
  name: string;
  stock: number;
  price: number;
  sold: number;
  margin: number;
};

const SKUS: Sku[] = [
  {
    sku: "KB-210",
    name: "Клавиатура беспроводная с подсветкой, русская раскладка",
    stock: 1240,
    price: 4990,
    sold: 318,
    margin: 0.284,
  },
  { sku: "MS-044", name: "Мышь оптическая", stock: 86, price: 1290, sold: 1204, margin: 0.312 },
  { sku: "MN-27Q", name: 'Монитор 27" QHD IPS', stock: 12, price: 32_900, sold: 41, margin: 0.118 },
  { sku: "HB-7P", name: "USB-хаб на 7 портов", stock: 530, price: 2190, sold: 97, margin: 0.402 },
  {
    sku: "HB-10P",
    name: "USB-хаб на 10 портов",
    stock: 210,
    price: 3490,
    sold: 64,
    margin: 0.356,
  },
];

const INT = new Intl.NumberFormat("ru-RU");
const PCT = new Intl.NumberFormat("ru-RU", { style: "percent", maximumFractionDigits: 1 });

/** Article numbers in natural order: HB-7P before HB-10P. */
const NATURAL = new Intl.Collator("ru-RU", { numeric: true });

const COLUMNS: DataTableColumn<Sku>[] = [
  {
    id: "sku",
    header: "Артикул",
    accessor: "sku",
    width: "6rem",
    sortable: true,
    sortComparator: (a, b) => NATURAL.compare(a.sku, b.sku),
  },
  { id: "name", header: "Товар", accessor: "name", truncate: true, maxWidth: "14rem" },
  {
    id: "stock",
    header: "Остаток, шт",
    numeric: true,
    sortable: true,
    sortAccessor: (row) => row.stock,
    cell: (row) => INT.format(row.stock),
  },
  { id: "price", header: "Цена, ₽", numeric: true, cell: (row) => INT.format(row.price) },
  { id: "sold", header: "Продано", numeric: true, cell: (row) => INT.format(row.sold) },
  {
    id: "margin",
    header: "Маржа",
    numeric: true,
    sortable: true,
    sortAccessor: (row) => row.margin,
    cell: (row) => PCT.format(row.margin),
  },
];

export default function DataTableNumericExample() {
  return <DataTable columns={COLUMNS} rows={SKUS} getRowKey={(row) => row.sku} paging="none" />;
}
