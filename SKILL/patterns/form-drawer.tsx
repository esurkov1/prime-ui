/** A create form in a Drawer: grouped fields, errors on submit with focus on the first invalid field, a loading submit, a toast and the new row in the list. */
import {
  Badge,
  Button,
  Checkbox,
  DataTable,
  type DataTableColumn,
  Drawer,
  Icon,
  Input,
  PageContent,
  Radio,
  Select,
  Textarea,
  Typography,
  useNotifications,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./form-drawer.module.css";

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

export default function FormDrawerPattern() {
  const { notify } = useNotifications();
  const formId = React.useId();
  const [clients, setClients] = React.useState(CLIENTS);
  const [open, setOpen] = React.useState(false);
  const [errors, setErrors] = React.useState<Errors>({});
  const [saving, setSaving] = React.useState(false);
  const [manager, setManager] = React.useState(MANAGERS[0]);

  const changeOpen = (next: boolean) => {
    if (saving) return;
    setOpen(next);
    if (!next) setErrors({});
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
      setOpen(false);
      notify({ tone: "success", title: "Клиент добавлен", description: name });
    }, 900);
  };

  return (
    <PageContent.Section aria-labelledby="clients-title">
      <PageContent.Header>
        <PageContent.Title id="clients-title">Клиенты</PageContent.Title>
        <PageContent.Description>
          Компании и ИП, которым вы выставляете счета.
        </PageContent.Description>
        <PageContent.Actions>
          <Drawer.Root open={open} onOpenChange={changeOpen} closeOnEscape={!saving}>
            <Drawer.Trigger>
              <Button.Root>
                <Button.Icon>
                  <Icon name="action.add" />
                </Button.Icon>
                Новый клиент
              </Button.Root>
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header showClose={!saving}>
                <Drawer.Title>Новый клиент</Drawer.Title>
                <Drawer.Description>
                  Появится в списке и в выборе клиента при выставлении счёта.
                </Drawer.Description>
              </Drawer.Header>
              <Drawer.Body>
                <form id={formId} className={styles.form} noValidate onSubmit={submit}>
                  <fieldset
                    className={styles.group}
                    disabled={saving}
                    aria-labelledby="new-client-company"
                  >
                    <Typography as="h3" variant="title-s" id="new-client-company">
                      Реквизиты
                    </Typography>
                    <div className={styles.fields}>
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
                      <Input.Root label="Название" required error={errors.name}>
                        <Input.Wrapper>
                          <Input.Field
                            name="name"
                            placeholder="ООО «Ромашка»"
                            autoComplete="organization"
                          />
                        </Input.Wrapper>
                      </Input.Root>
                      <div className={styles.pair}>
                        <Input.Root label="ИНН" required error={errors.inn} reserveSupportRow>
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
                    </div>
                  </fieldset>
                  <fieldset
                    className={styles.group}
                    disabled={saving}
                    aria-labelledby="new-client-contacts"
                  >
                    <Typography as="h3" variant="title-s" id="new-client-contacts">
                      Контакты
                    </Typography>
                    <div className={styles.fields}>
                      <Input.Root
                        label="Почта для счетов"
                        required
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
                      <Select.Root label="Менеджер" value={manager} onValueChange={setManager}>
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
                    </div>
                  </fieldset>
                </form>
              </Drawer.Body>
              <Drawer.Footer>
                <Drawer.Close>
                  <Button.Root variant="outline" tone="neutral" disabled={saving}>
                    Отмена
                  </Button.Root>
                </Drawer.Close>
                <Button.Root type="submit" form={formId} loading={saving}>
                  Добавить клиента
                </Button.Root>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Root>
        </PageContent.Actions>
      </PageContent.Header>
      <PageContent.Body>
        <DataTable columns={COLUMNS} rows={clients} getRowKey={(row) => row.id} paging="none" />
      </PageContent.Body>
    </PageContent.Section>
  );
}
