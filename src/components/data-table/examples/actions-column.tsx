/** Orders wider than the table: the order number stays at the start and the ⋯ row actions at the end while the columns between scroll sideways — `stickyFirstColumn`, `stickyLastColumn`. */
import { Badge, Button, DataTable, type DataTableColumn, Dropdown, Icon } from "prime-ui-kit";

type Order = {
  id: string;
  client: string;
  manager: string;
  city: string;
  address: string;
  status: "new" | "paid" | "shipped" | "cancelled";
  date: string;
  items: number;
  amount: number;
};

const ORDERS: Order[] = [
  {
    id: "З-2041",
    client: "ООО «Северный ветер»",
    manager: "Анна Смирнова",
    city: "Санкт-Петербург",
    address: "Лиговский пр., 50, склад 3",
    status: "paid",
    date: "02.10.2026",
    items: 14,
    amount: 184_500,
  },
  {
    id: "З-2042",
    client: "ИП Козлов",
    manager: "Игорь Петров",
    city: "Казань",
    address: "ул. Петербургская, 12, офис 4",
    status: "new",
    date: "03.10.2026",
    items: 3,
    amount: 27_900,
  },
  {
    id: "З-2043",
    client: "АО «Технопарк»",
    manager: "Анна Смирнова",
    city: "Новосибирск",
    address: "ул. Станционная, 38, терминал Б",
    status: "shipped",
    date: "05.10.2026",
    items: 42,
    amount: 612_000,
  },
  {
    id: "З-2044",
    client: "ООО «Лента Логистик»",
    manager: "Мария Орлова",
    city: "Екатеринбург",
    address: "ул. Монтажников, 4, ворота 2",
    status: "cancelled",
    date: "06.10.2026",
    items: 8,
    amount: 96_300,
  },
  {
    id: "З-2045",
    client: "ООО «Гранит»",
    manager: "Игорь Петров",
    city: "Москва",
    address: "Варшавское ш., 125, стр. 1",
    status: "paid",
    date: "08.10.2026",
    items: 21,
    amount: 275_400,
  },
];

const STATUS = {
  new: { label: "Новый", tone: "info" },
  paid: { label: "Оплачен", tone: "success" },
  shipped: { label: "Отгружен", tone: "neutral" },
  cancelled: { label: "Отменён", tone: "danger" },
} as const;

const RUB = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const COLUMNS: DataTableColumn<Order>[] = [
  { id: "id", header: "Заказ", accessor: "id" },
  { id: "client", header: "Клиент", accessor: "client", minWidth: "14rem" },
  { id: "manager", header: "Менеджер", accessor: "manager", minWidth: "10rem" },
  { id: "city", header: "Город", accessor: "city", minWidth: "10rem" },
  { id: "address", header: "Адрес доставки", accessor: "address", minWidth: "18rem" },
  {
    id: "status",
    header: "Статус",
    cell: (row) => (
      <Badge.Root tone={STATUS[row.status].tone}>{STATUS[row.status].label}</Badge.Root>
    ),
  },
  { id: "date", header: "Дата", accessor: "date", numeric: true, headerAlign: "end" },
  { id: "items", header: "Позиций", accessor: "items", numeric: true, headerAlign: "end" },
  {
    id: "amount",
    header: "Сумма",
    accessor: "amount",
    numeric: true,
    headerAlign: "end",
    cell: (row) => RUB.format(row.amount),
  },
  {
    id: "actions",
    header: "Действия",
    hideHeader: true,
    align: "end",
    cell: (row) => (
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root
            variant="ghost"
            tone="neutral"
            size="s"
            aria-label={`Действия с заказом ${row.id}`}
          >
            <Button.Icon>
              <Icon name="action.more" />
            </Button.Icon>
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Открыть</Dropdown.Item>
          <Dropdown.Item>Скачать счёт</Dropdown.Item>
          <Dropdown.Item>Повторить заказ</Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item tone="danger">Отменить</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    ),
  },
];

export default function DataTableActionsColumnExample() {
  return (
    <DataTable
      columns={COLUMNS}
      rows={ORDERS}
      getRowKey={(row) => row.id}
      paging="none"
      stickyFirstColumn
      stickyLastColumn
    />
  );
}
