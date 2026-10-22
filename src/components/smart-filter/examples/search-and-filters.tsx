/** Clients found by a name and a status together: Enter pins the typed name as the first chip, the field empties for the next filter, and the list keeps the rows that match both — `search`, `value`, `labels`, `matchesSmartFilter`. */
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

const STATUS = {
  rent: { label: "В аренде", color: "blue" },
  returned: { label: "Вернул", color: "green" },
  overdue: { label: "Просрочка", color: "red" },
} as const;

const CLIENTS = [
  { id: 1, name: "Евгений Орлов", phone: "+7 912 400-11-20", status: "rent" },
  { id: 2, name: "Евгений Ким", phone: "+7 903 155-02-48", status: "returned" },
  { id: 3, name: "Евгения Белова", phone: "+7 921 870-33-14", status: "rent" },
  { id: 4, name: "Илья Соколов", phone: "+7 916 222-90-01", status: "rent" },
  { id: 5, name: "Евгений Миронов", phone: "+7 905 611-47-73", status: "overdue" },
  { id: 6, name: "Мария Лебедева", phone: "+7 926 318-64-55", status: "returned" },
] as const;

const FIELDS: SmartFilterField[] = [
  {
    key: "status",
    label: "Статус",
    options: Object.entries(STATUS).map(([value, { label }]) => ({ value, label })),
  },
];

const LABELS = { searchPlaceholder: "Имя или телефон" };

export default function SmartFilterSearchAndFiltersExample() {
  const [search, setSearch] = React.useState("Евгений");
  const [value, setValue] = React.useState<SmartFilterValue>({
    status: { include: ["rent"], exclude: [] },
  });

  // The pinned query and the filters narrow together: a row stays when it matches both.
  const query = search.trim().toLowerCase();
  const found = CLIENTS.filter(
    (client) =>
      matchesSmartFilter(value.status, client.status) &&
      `${client.name} ${client.phone}`.toLowerCase().includes(query),
  );

  return (
    <div className={styles.stack}>
      <SmartFilter.Root
        fields={FIELDS}
        value={value}
        onValueChange={setValue}
        search={search}
        onSearchChange={setSearch}
        labels={LABELS}
      >
        <SmartFilter.Toolbar layout="combined" />
        <SmartFilter.Chips />
      </SmartFilter.Root>
      <Card.Root>
        <Card.Header>
          <Card.Title>Клиенты</Card.Title>
          <Card.Actions>
            <Typography as="span" variant="caption" tone="muted">
              {found.length} из {CLIENTS.length}
            </Typography>
          </Card.Actions>
        </Card.Header>
        <Card.List>
          {found.map((client) => (
            <Card.ListItem key={client.id}>
              <span className={styles.request}>
                <Typography as="span" variant="body-m" className={styles.route} truncate>
                  {client.name}
                </Typography>
                <Typography as="span" variant="caption" tone="muted">
                  {client.phone}
                </Typography>
                <Badge.Root color={STATUS[client.status].color}>
                  {STATUS[client.status].label}
                </Badge.Root>
              </span>
            </Card.ListItem>
          ))}
        </Card.List>
      </Card.Root>
    </div>
  );
}
