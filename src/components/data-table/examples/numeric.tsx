/** `numeric` columns align end with `tabular-nums`; `truncate` + `maxWidth` keeps a long name on one line with a `title`; `columnDividers` adds vertical lines. Use for inventories and reports with many numbers. */

import { DataTable, type DataTableColumn } from "prime-ui-kit";

type Sku = {
  sku: string;
  name: string;
  stock: number;
  price: number;
  sold: number;
  margin: number;
};

const rows: Sku[] = [
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
];

const int = new Intl.NumberFormat("ru-RU");
const pct = new Intl.NumberFormat("ru-RU", { style: "percent", maximumFractionDigits: 1 });

const columns: DataTableColumn<Sku>[] = [
  { id: "sku", header: "Артикул", accessor: "sku", width: "6rem" },
  { id: "name", header: "Товар", accessor: "name", truncate: true, maxWidth: "14rem" },
  { id: "stock", header: "Остаток, шт", numeric: true, cell: (r) => int.format(r.stock) },
  { id: "price", header: "Цена, ₽", numeric: true, cell: (r) => int.format(r.price) },
  { id: "sold", header: "Продано", numeric: true, cell: (r) => int.format(r.sold) },
  { id: "margin", header: "Маржа", numeric: true, cell: (r) => pct.format(r.margin) },
];

export default function DataTableNumericExample() {
  return (
    <DataTable.Root
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.sku}
      columnDividers
      showPagination={false}
    />
  );
}
