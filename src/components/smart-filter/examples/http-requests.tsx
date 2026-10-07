/** The main scenario: a toolbar (filter button + search), the applied filters as chips, and a list narrowed by `matchesSmartFilter` and the search text. Values are shown or hidden; a field with a fixed set (method, state) never lets you hide everything. Use above lists and tables with several filterable fields. */
import {
  Badge,
  Card,
  matchesSmartFilter,
  SmartFilter,
  type SmartFilterValue,
  Typography,
} from "prime-ui-kit";
import { useState } from "react";

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

const field = (values: readonly string[]) => values.map((v) => ({ value: v, label: v }));

const FIELDS = [
  {
    key: "service",
    label: "Сервис",
    finite: false,
    options: field(["billing", "catalog", "events", "orders"]),
  },
  {
    key: "method",
    label: "Метод",
    options: field(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  },
  {
    key: "state",
    label: "Состояние",
    options: [
      { value: "active", label: "Активные" },
      { value: "inactive", label: "Неактивные" },
    ],
  },
];

export default function SmartFilterHttpRequestsExample() {
  const [value, setValue] = useState<SmartFilterValue>({});
  const [search, setSearch] = useState("");

  const rows = REQUESTS.filter(
    (r) =>
      matchesSmartFilter(value.service, r.service) &&
      matchesSmartFilter(value.method, r.method) &&
      matchesSmartFilter(value.state, r.state) &&
      r.route.toLowerCase().includes(search.trim().toLowerCase()),
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
      <Card.Root variant="list" className={styles.card}>
        <Card.ListHeader>
          <Card.Title>Запросы</Card.Title>
          <Typography.Root as="span" variant="caption" tone="muted">
            {rows.length} из {REQUESTS.length}
          </Typography.Root>
        </Card.ListHeader>
        <Card.List>
          {rows.map((r) => (
            <Card.ListItem key={r.id}>
              <span className={styles.rowMain}>
                <Badge.Root color={METHOD_COLOR[r.method]}>{r.method}</Badge.Root>
                <Typography.Root as="span" variant="code" className={styles.route} truncate>
                  {r.route}
                </Typography.Root>
                <Typography.Root as="span" variant="caption" tone="muted">
                  {r.service}
                </Typography.Root>
              </span>
            </Card.ListItem>
          ))}
        </Card.List>
      </Card.Root>
    </div>
  );
}
