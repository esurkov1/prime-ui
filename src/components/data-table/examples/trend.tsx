/** Clients with revenue by month as a compact Sparkline in a cell of each row, next to the half-year total — `cell`, `width`. */
import { DataTable, type DataTableColumn, Sparkline, type SparklinePoint } from "prime-ui-kit";

type Client = { id: string; name: string; manager: string; revenue: number[] };
type Row = Client & { trend: SparklinePoint[]; total: number };

const MONTHS = ["май", "июн", "июл", "авг", "сен", "окт"];

const CLIENTS: Client[] = [
  {
    id: "C-118",
    name: "ООО «Северный ветер»",
    manager: "Ольга Смирнова",
    revenue: [184_000, 196_500, 172_300, 210_800, 238_000, 251_400],
  },
  {
    id: "C-102",
    name: "АО «Технопарк»",
    manager: "Игорь Волков",
    revenue: [612_000, 580_400, 545_900, 498_200, 470_000, 455_600],
  },
  {
    id: "C-131",
    name: "ООО «Гранит»",
    manager: "Мария Орлова",
    revenue: [96_000, 88_400, 121_700, 134_000, 129_300, 152_800],
  },
  {
    id: "C-147",
    name: "ИП Козлов",
    manager: "Глеб Котов",
    revenue: [27_900, 31_200, 26_800, 35_400, 33_100, 41_000],
  },
];

const RUB = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

// The series are built once: a new array per render would cross-fade every plot again.
const ROWS: Row[] = CLIENTS.map((client) => ({
  ...client,
  trend: client.revenue.map((value, i) => ({ label: MONTHS[i] ?? "", value })),
  total: client.revenue.reduce((sum, value) => sum + value, 0),
}));

const COLUMNS: DataTableColumn<Row>[] = [
  { id: "name", header: "Клиент", accessor: "name", sortable: true },
  { id: "manager", header: "Менеджер", accessor: "manager" },
  {
    id: "trend",
    header: "По месяцам",
    width: "10rem",
    cell: (row) => (
      <Sparkline
        layout="compact"
        data={row.trend}
        label={`Выручка по месяцам, ${row.name}`}
        formatValue={(value) => RUB.format(value)}
      />
    ),
  },
  {
    id: "total",
    header: "За полгода",
    accessor: "total",
    sortable: true,
    numeric: true,
    cell: (row) => RUB.format(row.total),
  },
];

export default function DataTableTrendExample() {
  return (
    <DataTable
      columns={COLUMNS}
      rows={ROWS}
      getRowKey={(row) => row.id}
      getRowLabel={(row) => row.name}
      paging="none"
    />
  );
}
