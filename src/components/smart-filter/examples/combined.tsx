/** Orders narrowed from one field: the search on the left, the filter section with its count on the right, the same panel from either; on a phone the section keeps only its icon and count — `layout`, `search`, `value`. */
import {
  Badge,
  Card,
  List,
  matchesSmartFilter,
  SmartFilter,
  type SmartFilterField,
  type SmartFilterValue,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const STATUS = {
  new: { label: "Новый", color: "blue" },
  paid: { label: "Оплачен", color: "green" },
  shipped: { label: "Отгружен", color: "purple" },
  cancelled: { label: "Отменён", color: "red" },
} as const;

const ORDERS = [
  { id: "ORD-1042", client: "ООО «Северный ветер»", status: "paid", city: "Москва" },
  { id: "ORD-1043", client: "ИП Кузнецов", status: "new", city: "Казань" },
  { id: "ORD-1044", client: "АО «Техноград»", status: "shipped", city: "Самара" },
  { id: "ORD-1045", client: "ООО «Лента групп»", status: "cancelled", city: "Москва" },
  { id: "ORD-1046", client: "ООО «Арсенал»", status: "paid", city: "Пермь" },
  { id: "ORD-1047", client: "ИП Миронова", status: "new", city: "Казань" },
] as const;

const FIELDS: SmartFilterField[] = [
  {
    key: "status",
    label: "Статус",
    options: Object.entries(STATUS).map(([value, { label }]) => ({ value, label })),
  },
  {
    key: "city",
    label: "Город",
    finite: false,
    options: ["Москва", "Казань", "Самара", "Пермь"].map((v) => ({ value: v, label: v })),
  },
];

export default function SmartFilterCombinedExample() {
  const [value, setValue] = React.useState<SmartFilterValue>({
    status: { include: ["paid", "new"], exclude: [] },
  });
  const [search, setSearch] = React.useState("");

  const query = search.trim().toLowerCase();
  const found = ORDERS.filter(
    (order) =>
      matchesSmartFilter(value.status, order.status) &&
      matchesSmartFilter(value.city, order.city) &&
      `${order.id} ${order.client}`.toLowerCase().includes(query),
  );

  return (
    <div className={styles.stack}>
      <SmartFilter.Root
        fields={FIELDS}
        value={value}
        onValueChange={setValue}
        search={search}
        onSearchChange={setSearch}
      >
        <SmartFilter.Toolbar layout="combined" />
        <SmartFilter.Chips />
      </SmartFilter.Root>
      <Card.Root>
        <Card.Header>
          <Card.Title>Заказы</Card.Title>
          <Card.Description>
            {found.length} из {ORDERS.length}
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <List.Root aria-label="Заказы">
            {found.map((order) => (
              <List.Item key={order.id}>
                <List.ItemText>{order.client}</List.ItemText>
                <List.ItemDescription>{order.id}</List.ItemDescription>
                <List.ItemMeta>
                  <Badge.Root color={STATUS[order.status].color}>
                    {STATUS[order.status].label}
                  </Badge.Root>
                </List.ItemMeta>
              </List.Item>
            ))}
          </List.Root>
        </Card.Body>
      </Card.Root>
    </div>
  );
}
