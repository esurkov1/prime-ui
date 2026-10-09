/** Deals closed per manager and month as a heatmap: each count shades its cell on the chart scale and stays readable in it — `scale`, `numeric`. */
import { DataTable, type DataTableColumn } from "prime-ui-kit";

type Row = { manager: string; jul: number; aug: number; sep: number; oct: number };

const MONTHS = [
  { id: "jul", header: "Июль" },
  { id: "aug", header: "Август" },
  { id: "sep", header: "Сентябрь" },
  { id: "oct", header: "Октябрь" },
] as const;

const ROWS: Row[] = [
  { manager: "Ольга Смирнова", jul: 14, aug: 18, sep: 22, oct: 25 },
  { manager: "Игорь Волков", jul: 9, aug: 7, sep: 12, oct: 10 },
  { manager: "Мария Орлова", jul: 4, aug: 11, sep: 16, oct: 21 },
  { manager: "Глеб Котов", jul: 2, aug: 3, sep: 5, oct: 8 },
];

const COLUMNS: DataTableColumn<Row>[] = [
  { id: "manager", header: "Менеджер", accessor: "manager" },
  // One fixed range for every month, so the same count has the same shade in each column.
  ...MONTHS.map(
    ({ id, header }): DataTableColumn<Row> => ({
      id,
      header,
      accessor: id,
      numeric: true,
      scale: { min: 0, max: 25 },
    }),
  ),
];

export default function DataTableHeatmapExample() {
  return (
    <DataTable
      columns={COLUMNS}
      rows={ROWS}
      getRowKey={(row) => row.manager}
      paging="none"
      highlightRowOnHover={false}
    />
  );
}
