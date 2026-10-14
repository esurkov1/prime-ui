/** Order details in a full-width row under an expanded order, aligned with the first content column; a cancelled order has nothing to show and gets no toggle — `renderExpanded`, `defaultExpanded`, `isRowExpandable`. */
import { DataTable, type DataTableColumn, DescriptionList } from "prime-ui-kit";

type Order = {
  id: string;
  number: string;
  customer: string;
  date: string;
  total: number;
  /** Delivery details; a cancelled order has none. */
  delivery: { address: string; items: string } | null;
};

const ORDERS: Order[] = [
  {
    id: "o1",
    number: "№ 10 482",
    customer: "Анна Соколова",
    date: "07.10.26",
    total: 12_480,
    delivery: {
      address: "Москва, ул. Тверская, 12, кв. 45",
      items: "Кабель USB-C, 2 м × 2, док-станция × 1",
    },
  },
  {
    id: "o2",
    number: "№ 10 481",
    customer: "Дмитрий Орлов",
    date: "06.10.26",
    total: 34_900,
    delivery: { address: "Санкт-Петербург, Невский пр., 28", items: 'Монитор 27" × 1' },
  },
  {
    id: "o3",
    number: "№ 10 479",
    customer: "Игорь Белов",
    date: "06.10.26",
    total: 2_990,
    delivery: null,
  },
  {
    id: "o4",
    number: "№ 10 477",
    customer: "Мария Ким",
    date: "05.10.26",
    total: 4_350,
    delivery: { address: "Казань, ул. Баумана, 7", items: "Клавиатура × 1" },
  },
];

const RUB = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const COLUMNS: DataTableColumn<Order>[] = [
  { id: "number", header: "Заказ", accessor: "number", minWidth: "8rem" },
  {
    id: "customer",
    header: "Покупатель",
    accessor: "customer",
    sortable: true,
    cell: (row) => (row.delivery ? row.customer : `${row.customer} · отменён`),
  },
  { id: "date", header: "Дата", accessor: "date", numeric: true },
  {
    id: "total",
    header: "Сумма",
    accessor: "total",
    sortable: true,
    numeric: true,
    cell: (row) => RUB.format(row.total),
  },
];

export default function DataTableDetailPanelExample() {
  return (
    <DataTable
      columns={COLUMNS}
      rows={ORDERS}
      getRowKey={(row) => row.id}
      getRowLabel={(row) => row.number}
      isRowExpandable={(row) => row.delivery !== null}
      renderExpanded={(row) =>
        row.delivery ? (
          <DescriptionList.Root size="s">
            <DescriptionList.Item label="Адрес доставки">
              {row.delivery.address}
            </DescriptionList.Item>
            <DescriptionList.Item label="Состав">{row.delivery.items}</DescriptionList.Item>
          </DescriptionList.Root>
        ) : null
      }
      defaultExpanded={["o1"]}
      paging="none"
    />
  );
}
