/** Filters above a request list: the filter button and the search, applied filters as tags, rows narrowed by the value and the text — `fields`, `value`, `search`, `matchesSmartFilter`. */
import {
  Badge,
  Card,
  matchesSmartFilter,
  SmartFilter,
  type SmartFilterField,
  type SmartFilterValue,
  Typography,
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
      <Card.Root variant="list">
        <Card.SectionHeader>
          <Card.SectionTitle>Запросы</Card.SectionTitle>
          <Typography as="span" variant="caption" tone="muted">
            {found.length} из {REQUESTS.length}
          </Typography>
        </Card.SectionHeader>
        <Card.List>
          {found.map((request) => (
            <Card.ListItem key={request.id}>
              <span className={styles.request}>
                <Badge.Root color={METHOD_COLOR[request.method]}>{request.method}</Badge.Root>
                <Typography as="span" variant="code" className={styles.route} truncate>
                  {request.route}
                </Typography>
                <Typography as="span" variant="caption" tone="muted">
                  {request.service}
                </Typography>
              </span>
            </Card.ListItem>
          ))}
        </Card.List>
      </Card.Root>
    </div>
  );
}
