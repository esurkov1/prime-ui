import { Badge, DataTable, type DataTableColumn, Tag } from "prime-ui-kit";

type InvoiceRow = {
  id: string;
  customer: string;
  amount: number;
  country: string;
  status: "Paid" | "Pending" | "Overdue";
};

const rows: InvoiceRow[] = [
  { id: "INV-1001", customer: "Monday Inc.", amount: 1240, country: "USA", status: "Paid" },
  { id: "INV-1002", customer: "Pixel Lab", amount: 860, country: "Germany", status: "Pending" },
  { id: "INV-1003", customer: "Stella Team", amount: 2910, country: "Spain", status: "Paid" },
  { id: "INV-1004", customer: "Nordic Grid", amount: 1490, country: "Sweden", status: "Pending" },
  { id: "INV-1005", customer: "Onboardly", amount: 480, country: "France", status: "Overdue" },
  { id: "INV-1006", customer: "Clever Peak", amount: 3010, country: "Canada", status: "Paid" },
  { id: "INV-1007", customer: "Nimbus", amount: 1980, country: "UK", status: "Pending" },
  { id: "INV-1008", customer: "Solar Crest", amount: 540, country: "Italy", status: "Overdue" },
  { id: "INV-1009", customer: "Edge Point", amount: 2270, country: "USA", status: "Paid" },
  { id: "INV-1010", customer: "Seven Loop", amount: 1750, country: "Poland", status: "Pending" },
  { id: "INV-1011", customer: "Mint Dash", amount: 900, country: "Japan", status: "Paid" },
  { id: "INV-1012", customer: "Blue Stone", amount: 1425, country: "Norway", status: "Overdue" },
];

function mapStatusToColor(status: InvoiceRow["status"]) {
  if (status === "Paid") return "green";
  if (status === "Overdue") return "red";
  return "yellow";
}

const columns: DataTableColumn<InvoiceRow>[] = [
  { id: "id", header: "Invoice", accessor: "id", sortable: true, minWidth: "8rem" },
  { id: "customer", header: "Customer", accessor: "customer", sortable: true, minWidth: "12rem" },
  {
    id: "amount",
    header: "Amount",
    accessor: "amount",
    sortable: true,
    align: "end",
    cell: (row) => `$${row.amount.toLocaleString()}`,
    minWidth: "7rem",
  },
  {
    id: "country",
    header: "Country",
    accessor: "country",
    sortable: true,
    minWidth: "8rem",
    cell: (row) => <Tag.Root>{row.country}</Tag.Root>,
  },
  {
    id: "status",
    header: "Status",
    accessor: "status",
    sortable: true,
    minWidth: "8rem",
    cell: (row) => (
      <Badge.Root color={mapStatusToColor(row.status)} variant="light">
        {row.status}
      </Badge.Root>
    ),
  },
];

/** Соответствует `playground/snippets/data-table/sorting-pagination.tsx`. */
export default function DataTableSortingPaginationExample() {
  return (
    <DataTable.Root
      columns={columns}
      rows={rows}
      defaultSort={{ columnId: "amount", order: "desc" }}
      pageSize={5}
    />
  );
}
