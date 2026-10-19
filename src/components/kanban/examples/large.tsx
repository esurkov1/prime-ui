/** Three thousand orders on one board stay fast: each column draws only the cards in view, a card dragged near an edge scrolls its column, and Alt + arrows reach any card — `items`, `defaultValue`, `getLabel`. */
import { Badge, Kanban, type PaletteColor } from "prime-ui-kit";

import styles from "./examples.module.css";

type Order = {
  id: string;
  number: string;
  client: string;
  total: string;
  label?: { text: string; color: PaletteColor };
};

const COLUMNS = [
  { id: "new", title: "Новые" },
  { id: "assembly", title: "Сборка" },
  { id: "shipping", title: "Доставка" },
];

const CLIENTS = [
  "ООО «Вектор»",
  "ИП Соколов",
  "АО «Северсталь-Логистик»",
  "ООО «Ромашка»",
  "ООО «Технопарк»",
  "ИП Белова",
];

const LABELS = [
  { text: "Срочно", color: "red" },
  { text: "Опт", color: "blue" },
  { text: "Самовывоз", color: "green" },
] as const;

const ORDERS: Order[] = Array.from({ length: 3000 }, (_, index) => ({
  id: `o${index + 1}`,
  number: `З-${String(index + 1).padStart(5, "0")}`,
  client: CLIENTS[index % CLIENTS.length] ?? "",
  total: `${((index * 7919) % 90000) + 1500} ₽`,
  label: index % 4 === 0 ? LABELS[(index / 4) % LABELS.length] : undefined,
}));

const PLACEMENT = Object.fromEntries(
  COLUMNS.map((column, at) => [
    column.id,
    ORDERS.filter((_, index) => index % COLUMNS.length === at).map((order) => order.id),
  ]),
);

export default function KanbanLargeExample() {
  return (
    <Kanban.Root
      aria-label="Заказы"
      className={styles.board}
      columns={COLUMNS}
      items={ORDERS}
      getId={(order) => order.id}
      getLabel={(order) => `Заказ ${order.number}`}
      defaultValue={PLACEMENT}
      renderItem={(order) => (
        <Kanban.Item>
          <Kanban.ItemTitle number={order.number}>{order.client}</Kanban.ItemTitle>
          <Kanban.ItemDescription>{order.total}</Kanban.ItemDescription>
          {order.label ? (
            <Kanban.ItemBadges>
              <Badge.Root color={order.label.color}>{order.label.text}</Badge.Root>
            </Kanban.ItemBadges>
          ) : null}
        </Kanban.Item>
      )}
    />
  );
}
