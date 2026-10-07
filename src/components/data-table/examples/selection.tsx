/** Team members with checkboxes: Shift+click range, press-and-drag, «select all» and bulk actions in the toolbar — `selectable`, `selected`, `onSelectedChange`, `getRowLabel`. */
import { Button, DataTable, type DataTableColumn, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Member = { id: string; name: string; email: string; role: string };

const MEMBERS: Member[] = [
  { id: "u1", name: "Анна Соколова", email: "anna@prime.dev", role: "Владелец" },
  { id: "u2", name: "Дмитрий Орлов", email: "d.orlov@prime.dev", role: "Администратор" },
  { id: "u3", name: "Мария Ким", email: "maria.kim@prime.dev", role: "Редактор" },
  { id: "u4", name: "Игорь Белов", email: "belov@prime.dev", role: "Наблюдатель" },
  { id: "u5", name: "Ольга Лебедева", email: "o.lebedeva@prime.dev", role: "Редактор" },
  { id: "u6", name: "Тимур Ахметов", email: "timur@prime.dev", role: "Наблюдатель" },
];

const COLUMNS: DataTableColumn<Member>[] = [
  { id: "name", header: "Имя", accessor: "name", sortable: true },
  { id: "email", header: "Почта", accessor: "email", truncate: true, maxWidth: "14rem" },
  { id: "role", header: "Роль", accessor: "role", sortable: true },
];

export default function DataTableSelectionExample() {
  const [selected, setSelected] = React.useState<React.Key[]>(["u2"]);

  return (
    <DataTable
      columns={COLUMNS}
      rows={MEMBERS}
      getRowKey={(row) => row.id}
      getRowLabel={(row) => row.name}
      selectable
      selected={selected}
      onSelectedChange={setSelected}
      paging="none"
      toolbar={
        <div className={styles.toolbar}>
          <Typography.Root as="span" variant="body-s" tone="secondary">
            Выбрано: {selected.length} из {MEMBERS.length}
          </Typography.Root>
          <div className={styles.filters}>
            <Button.Root
              variant="outline"
              tone="neutral"
              size="s"
              disabled={selected.length === 0}
              onClick={() => setSelected([])}
            >
              Снять выбор
            </Button.Root>
            <Button.Root variant="soft" tone="danger" size="s" disabled={selected.length === 0}>
              Удалить
            </Button.Root>
          </div>
        </div>
      }
    />
  );
}
