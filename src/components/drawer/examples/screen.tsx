/** A create form in a Drawer opened from the primary action in its top bar: grouped fields, errors on submit with focus on the first invalid field, a loading submit, a toast and the new row in the list — `Drawer.Trigger`, `Drawer.Guard`. */
import {
  Badge,
  Button,
  Checkbox,
  DataTable,
  type DataTableColumn,
  Drawer,
  Fieldset,
  Icon,
  Input,
  Page,
  Radio,
  Select,
  SmartFilter,
  Textarea,
  useNotifications,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./screen.module.css";

type Client = { id: string; name: string; kind: "company" | "person"; manager: string };
type Errors = Partial<Record<"name" | "inn" | "email", string>>;

const MANAGERS = ["Анна Климова", "Илья Петров", "Марат Хасанов"];

const CLIENTS: Client[] = [
  { id: "c1", name: "ООО «Северный ветер»", kind: "company", manager: "Анна Климова" },
  { id: "c2", name: "АО «Техностиль»", kind: "company", manager: "Илья Петров" },
  { id: "c3", name: "ИП Соколова М. А.", kind: "person", manager: "Анна Климова" },
];

const COLUMNS: DataTableColumn<Client>[] = [
  { id: "name", header: "Клиент", accessor: "name" },
  {
    id: "kind",
    header: "Тип",
    cell: (row) =>
      row.kind === "company" ? (
        <Badge.Root color="blue">Компания</Badge.Root>
      ) : (
        <Badge.Root color="purple">ИП</Badge.Root>
      ),
  },
  { id: "manager", header: "Менеджер", accessor: "manager" },
];

const CLIENT_WORDS = ["клиент", "клиента", "клиентов"] as const;
const COMPANY_WORDS = ["компания", "компании", "компаний"] as const;

/** «1 клиент», «3 клиента», «5 клиентов». */
const plural = (count: number, [one, few, many]: readonly [string, string, string]) => {
  const tens = count % 100;
  const ones = count % 10;
  if (tens >= 11 && tens <= 14) return `${count} ${many}`;
  if (ones === 1) return `${count} ${one}`;
  if (ones >= 2 && ones <= 4) return `${count} ${few}`;
  return `${count} ${many}`;
};

function validate(data: FormData): Errors {
  const errors: Errors = {};
  const name = String(data.get("name") ?? "").trim();
  const inn = String(data.get("inn") ?? "").replace(/\s/g, "");
  const email = String(data.get("email") ?? "").trim();
  if (!name) errors.name = "Введите название клиента";
  if (!/^\d{10}(\d{2})?$/.test(inn)) errors.inn = "ИНН — 10 цифр для компании или 12 для ИП";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Введите почту в формате name@company.ru";
  return errors;
}

export default function DrawerScreenExample() {
  const { notify } = useNotifications();
  const formId = React.useId();
  const [clients, setClients] = React.useState(CLIENTS);
  const [open, setOpen] = React.useState(false);
  const [errors, setErrors] = React.useState<Errors>({});
  const [saving, setSaving] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);
  const [manager, setManager] = React.useState(MANAGERS[0]);
  const [search, setSearch] = React.useState("");

  // Drawer.Guard holds every way out while saving and asks before an edited form is discarded.
  const changeOpen = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setErrors({});
      setDirty(false);
    }
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);
    const firstInvalid = (["name", "inn", "email"] as const).find((key) => found[key]);
    if (firstInvalid) {
      form.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      const name = String(data.get("name")).trim();
      setClients((list) => [
        {
          id: `c${list.length + 1}`,
          name,
          kind: data.get("kind") === "person" ? "person" : "company",
          manager,
        },
        ...list,
      ]);
      setSaving(false);
      setDirty(false);
      setOpen(false);
      notify({ tone: "success", title: "Клиент добавлен", description: name });
    }, 900);
  };

  const query = search.trim().toLowerCase();
  const shown = clients.filter((client) => client.name.toLowerCase().includes(query));
  const people = clients.filter((client) => client.kind === "person").length;

  return (
    <SmartFilter.Root fields={[]} search={search} onSearchChange={setSearch}>
      <Page.Root>
        {/* A work screen titles itself in its top bar: the only h1, the counts under it and the one
          primary action — the Drawer trigger. The table's search lives in the table's toolbar. */}
        <Page.TopBar>
          <Page.Heading>
            <Page.Title>Клиенты</Page.Title>
            <Page.Description>
              {plural(clients.length, CLIENT_WORDS)} ·{" "}
              {plural(clients.length - people, COMPANY_WORDS)} и {people} ИП
            </Page.Description>
          </Page.Heading>
          <Page.Actions>
            <Drawer.Root open={open} onOpenChange={changeOpen}>
              <Drawer.Trigger>
                <Button.Root aria-label="Новый клиент">
                  <Button.Icon>
                    <Icon name="action.add" />
                  </Button.Icon>
                  Клиент
                </Button.Root>
              </Drawer.Trigger>
              <Drawer.Content>
                <Drawer.Header>
                  <Drawer.Title>Новый клиент</Drawer.Title>
                  <Drawer.Description>
                    Появится в списке и в выборе клиента при выставлении счёта.
                  </Drawer.Description>
                </Drawer.Header>
                <Drawer.Body>
                  <Drawer.Guard busy={saving} dirty={dirty} />
                  <form
                    id={formId}
                    className={styles.form}
                    noValidate
                    onSubmit={submit}
                    onChange={() => setDirty(true)}
                  >
                    <Fieldset label="Реквизиты" disabled={saving}>
                      <Radio.Group
                        name="kind"
                        label="Тип клиента"
                        defaultValue="company"
                        orientation="horizontal"
                      >
                        <Radio.Root value="company">
                          <Radio.Label>Компания</Radio.Label>
                        </Radio.Root>
                        <Radio.Root value="person">
                          <Radio.Label>ИП</Radio.Label>
                        </Radio.Root>
                      </Radio.Group>
                      <Input.Root label="Название" error={errors.name}>
                        <Input.Wrapper>
                          <Input.Field name="name" placeholder="ООО «Ромашка»" />
                        </Input.Wrapper>
                      </Input.Root>
                      <div className={styles.pair}>
                        <Input.Root label="ИНН" error={errors.inn} reserveSupportRow>
                          <Input.Wrapper>
                            <Input.Field name="inn" inputMode="numeric" placeholder="7704512908" />
                          </Input.Wrapper>
                        </Input.Root>
                        <Input.Root label="КПП" optional reserveSupportRow>
                          <Input.Wrapper>
                            <Input.Field name="kpp" inputMode="numeric" placeholder="770401001" />
                          </Input.Wrapper>
                        </Input.Root>
                      </div>
                    </Fieldset>
                    <Fieldset label="Контакты" disabled={saving}>
                      <Input.Root
                        label="Почта для счетов"
                        error={errors.email}
                        hint="На неё уйдут счета и акты"
                      >
                        <Input.Wrapper>
                          <Input.Icon side="start">
                            <Icon name="field.email" />
                          </Input.Icon>
                          <Input.Field name="email" type="email" placeholder="billing@company.ru" />
                        </Input.Wrapper>
                      </Input.Root>
                      <Select.Root
                        label="Менеджер"
                        value={manager}
                        onValueChange={(next) => {
                          setManager(next);
                          setDirty(true);
                        }}
                      >
                        <Select.Trigger>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          {MANAGERS.map((name) => (
                            <Select.Item key={name} value={name}>
                              {name}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                      <Textarea.Root name="note" label="Комментарий" optional rows={2} />
                      <Checkbox.Root
                        name="invite"
                        defaultChecked
                        hint="Клиент увидит свои счета и акты онлайн"
                      >
                        <Checkbox.Label>Пригласить в личный кабинет</Checkbox.Label>
                      </Checkbox.Root>
                    </Fieldset>
                  </form>
                </Drawer.Body>
                <Drawer.Footer>
                  <Drawer.Close>
                    <Button.Root variant="soft" tone="neutral">
                      Отмена
                    </Button.Root>
                  </Drawer.Close>
                  <Button.Root type="submit" form={formId} loading={saving}>
                    Добавить клиента
                  </Button.Root>
                </Drawer.Footer>
              </Drawer.Content>
            </Drawer.Root>
          </Page.Actions>
        </Page.TopBar>
        <Page.Body>
          <DataTable
            columns={COLUMNS}
            rows={shown}
            getRowKey={(row) => row.id}
            paging="none"
            toolbar={<SmartFilter.Toolbar />}
            empty="Клиентов не найдено"
          />
        </Page.Body>
      </Page.Root>
    </SmartFilter.Root>
  );
}
