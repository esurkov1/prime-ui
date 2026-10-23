/** Filters above a request list: the filter button and the search, applied filters as tags, rows narrowed by the value and the text — `fields`, `value`, `search`, `matchesSmartFilter`. */
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

const METHOD_COLOR = {
  GET: "green",
  POST: "blue",
  PUT: "orange",
  PATCH: "purple",
  DELETE: "red",
} as const;

const REQUESTS = [
  { id: 1, route: "/orders", method: "GET", service: "orders", state: "active" },
  { id: 2, route: "/orders", method: "POST", service: "orders", state: "active" },
  { id: 3, route: "/orders/:id", method: "PUT", service: "orders", state: "inactive" },
  { id: 4, route: "/catalog/items", method: "GET", service: "catalog", state: "active" },
  { id: 5, route: "/catalog/items/:id", method: "PATCH", service: "catalog", state: "active" },
  { id: 6, route: "/billing/invoices", method: "GET", service: "billing", state: "active" },
  {
    id: 7,
    route: "/billing/invoices/:id",
    method: "DELETE",
    service: "billing",
    state: "inactive",
  },
  { id: 8, route: "/events/subscribe", method: "POST", service: "events", state: "active" },
] as const;

const asOptions = (values: readonly string[]) => values.map((v) => ({ value: v, label: v }));

const FIELDS: SmartFilterField[] = [
  {
    key: "service",
    label: "Сервис",
    finite: false,
    options: asOptions(["billing", "catalog", "events", "orders"]),
  },
  { key: "method", label: "Метод", options: asOptions(["GET", "POST", "PUT", "PATCH", "DELETE"]) },
  {
    key: "state",
    label: "Состояние",
    options: [
      { value: "active", label: "Активные" },
      { value: "inactive", label: "Неактивные" },
    ],
  },
];

export default function SmartFilterOverviewExample() {
  const [value, setValue] = React.useState<SmartFilterValue>({});
  const [search, setSearch] = React.useState("");

  const found = REQUESTS.filter(
    (request) =>
      matchesSmartFilter(value.service, request.service) &&
      matchesSmartFilter(value.method, request.method) &&
      matchesSmartFilter(value.state, request.state) &&
      request.route.toLowerCase().includes(search.trim().toLowerCase()),
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
        <SmartFilter.Toolbar />
        <SmartFilter.Chips />
      </SmartFilter.Root>
      <Card.Root>
        <Card.Header>
          <Card.Title>Запросы</Card.Title>
          <Card.Description>
            {found.length} из {REQUESTS.length}
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <List.Root aria-label="Запросы">
            {found.map((request) => (
              <List.Item key={request.id}>
                <List.ItemText>{request.route}</List.ItemText>
                <List.ItemDescription>{request.service}</List.ItemDescription>
                <List.ItemMeta>
                  <Badge.Root color={METHOD_COLOR[request.method]}>{request.method}</Badge.Root>
                </List.ItemMeta>
              </List.Item>
            ))}
          </List.Root>
        </Card.Body>
      </Card.Root>
    </div>
  );
}
