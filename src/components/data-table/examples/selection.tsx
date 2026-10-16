/** Team members with checkboxes: Shift+click range, press-and-drag, «select all», and an actions menu after the search and the column chooser while rows are selected — `selectable`, `selected`, `onSelectedChange`, `getRowLabel`, `renderSelectionActions`. */
import {
  DataTable,
  type DataTableColumn,
  DataTableColumnsMenu,
  Dropdown,
  Icon,
  Input,
} from "prime-ui-kit";
import * as React from "react";

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
  { id: "name", header: "Имя", accessor: "name", sortable: true, hideable: false },
  { id: "email", header: "Почта", accessor: "email", truncate: true, maxWidth: "14rem" },
  { id: "role", header: "Роль", accessor: "role", sortable: true },
];

export default function DataTableSelectionExample() {
  const [members, setMembers] = React.useState(MEMBERS);
  const [selected, setSelected] = React.useState<React.Key[]>(["u2"]);
  const [query, setQuery] = React.useState("");
  const [hidden, setHidden] = React.useState<string[]>([]);

  const needle = query.trim().toLowerCase();
  const shown = needle
    ? members.filter((member) => member.name.toLowerCase().includes(needle))
    : members;

  const removeSelected = (keys: React.Key[]) => {
    setMembers((current) => current.filter((member) => !keys.includes(member.id)));
    setSelected([]);
  };

  return (
    <DataTable
      columns={COLUMNS}
      hiddenColumns={hidden}
      rows={shown}
      getRowKey={(row) => row.id}
      getRowLabel={(row) => row.name}
      selectable
      selected={selected}
      onSelectedChange={setSelected}
      paging="none"
      toolbar={
        <>
          <Input.Root>
            <Input.Wrapper>
              <Input.Icon side="start">
                <Icon name="action.search" />
              </Input.Icon>
              <Input.Field
                type="search"
                placeholder="Поиск по имени"
                aria-label="Поиск по участникам"
                value={query}
                onValueChange={setQuery}
              />
            </Input.Wrapper>
          </Input.Root>
          <DataTableColumnsMenu
            columns={COLUMNS}
            hiddenColumns={hidden}
            onHiddenColumnsChange={setHidden}
          />
        </>
      }
      renderSelectionActions={(keys) => (
        <>
          <Dropdown.Item>
            <Dropdown.ItemIcon>
              <Icon name="action.download" />
            </Dropdown.ItemIcon>
            Выгрузить в CSV
          </Dropdown.Item>
          <Dropdown.Item tone="danger" onSelect={() => removeSelected(keys)}>
            <Dropdown.ItemIcon>
              <Icon name="action.delete" />
            </Dropdown.ItemIcon>
            Удалить из команды
          </Dropdown.Item>
        </>
      )}
    />
  );
}
