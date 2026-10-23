/** A settings page as a document: the path in the top bar that repeats the title once it scrolls away, the large title in the flow, each section a card with its own heading, a form saved by its own button, switches that apply at once and a danger zone with a confirm — `collapse`, `maxWidth`, `Card.Header`. */
import {
  Breadcrumb,
  Button,
  Card,
  ConfirmDialog,
  Dropdown,
  Fieldset,
  Icon,
  Input,
  Page,
  Select,
  Switch,
  Textarea,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./screen.module.css";

const TIMEZONES = [
  { value: "Europe/Kaliningrad", label: "Калининград (UTC+2)" },
  { value: "Europe/Moscow", label: "Москва (UTC+3)" },
  { value: "Europe/Samara", label: "Самара (UTC+4)" },
  { value: "Asia/Yekaterinburg", label: "Екатеринбург (UTC+5)" },
  { value: "Asia/Novosibirsk", label: "Новосибирск (UTC+7)" },
  { value: "Asia/Vladivostok", label: "Владивосток (UTC+10)" },
];

const ALERTS = [
  {
    name: "payments",
    label: "Оплата счетов",
    hint: "Письмо, когда клиент оплатил счёт.",
    defaultChecked: true,
  },
  {
    name: "overdue",
    label: "Просрочка",
    hint: "Напоминание менеджеру на следующий день после срока.",
    defaultChecked: true,
  },
  {
    name: "digest",
    label: "Еженедельная сводка",
    hint: "По понедельникам в 09:00: выручка, долги, новые клиенты.",
    defaultChecked: false,
  },
];

export default function PageScreenExample() {
  const [innError, setInnError] = React.useState<string>();
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const inn = String(new FormData(event.currentTarget).get("inn") ?? "").replace(/\s/g, "");
    if (!/^\d{10}(\d{2})?$/.test(inn)) {
      setInnError("ИНН — 10 цифр для компании или 12 для ИП");
      return;
    }
    setInnError(undefined);
    setSaving(true);
    setSaved(false);
    window.setTimeout(() => {
      setSaving(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    }, 900);
  };

  const [removing, setRemoving] = React.useState(false);

  const removeWorkspace = () => new Promise<void>((resolve) => window.setTimeout(resolve, 1200));

  return (
    <Page.Root maxWidth="wide">
      <Page.TopBar collapse>
        <Page.Heading>
          <Breadcrumb.Root>
            <Breadcrumb.Item href="#workspace">Прайм Софт</Breadcrumb.Item>
          </Breadcrumb.Root>
        </Page.Heading>
      </Page.TopBar>
      <Page.Header>
        <Page.Heading>
          <Page.Title>Настройки</Page.Title>
          <Page.Description>
            Реквизиты компании, уведомления и управление рабочим пространством.
          </Page.Description>
        </Page.Heading>
      </Page.Header>
      <Page.Body>
        <form noValidate onSubmit={save} onReset={() => setInnError(undefined)}>
          <Card.Root>
            <Card.Header>
              <Card.Title as="h2">Компания</Card.Title>
              <Card.Description>Попадают в счета, акты и письма клиентам.</Card.Description>
            </Card.Header>
            <Card.Body>
              <Fieldset disabled={saving}>
                <Input.Root label="Название">
                  <Input.Wrapper>
                    <Input.Field name="name" defaultValue="ООО «Прайм Софт»" />
                  </Input.Wrapper>
                </Input.Root>
                <div className={styles.pair}>
                  <Input.Root label="ИНН" error={innError} hint="10 или 12 цифр" reserveSupportRow>
                    <Input.Wrapper>
                      <Input.Field name="inn" inputMode="numeric" defaultValue="7704512908" />
                    </Input.Wrapper>
                  </Input.Root>
                  <Select.Root label="Часовой пояс" defaultValue="Europe/Moscow">
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content searchable>
                      {TIMEZONES.map((zone) => (
                        <Select.Item key={zone.value} value={zone.value}>
                          {zone.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </div>
                <Textarea.Root
                  name="address"
                  label="Юридический адрес"
                  optional
                  rows={2}
                  defaultValue="125009, Москва, ул. Тверская, д. 7, офис 412"
                />
              </Fieldset>
            </Card.Body>
            <Card.Footer>
              <Card.Actions>
                <Button.Root type="reset" variant="soft" tone="neutral" disabled={saving}>
                  Отменить изменения
                </Button.Root>
                <Button.Root type="submit" loading={saving}>
                  {saved ? "Сохранено" : "Сохранить"}
                </Button.Root>
              </Card.Actions>
            </Card.Footer>
          </Card.Root>
        </form>

        <Card.Root>
          <Card.Header>
            <Card.Title as="h2">Уведомления</Card.Title>
            <Card.Description>Включаются сразу, без сохранения.</Card.Description>
          </Card.Header>
          <Card.Body>
            <Fieldset aria-label="Уведомления">
              {ALERTS.map((alert) => (
                <Switch.Root
                  fullWidth
                  key={alert.name}
                  name={alert.name}
                  defaultChecked={alert.defaultChecked}
                  hint={alert.hint}
                >
                  <Switch.Label>{alert.label}</Switch.Label>
                </Switch.Root>
              ))}
            </Fieldset>
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title as="h2">Рабочее пространство</Card.Title>
            <Card.Description>Удаление необратимо, доступно владельцу.</Card.Description>
            <Card.Actions>
              <Dropdown.Root>
                <Dropdown.Trigger>
                  <Button.Root variant="ghost" tone="neutral" aria-label="Действия с пространством">
                    <Button.Icon>
                      <Icon name="action.more" />
                    </Button.Icon>
                  </Button.Root>
                </Dropdown.Trigger>
                <Dropdown.Content>
                  <Dropdown.Item tone="danger" onSelect={() => setRemoving(true)}>
                    Удалить пространство
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown.Root>
            </Card.Actions>
          </Card.Header>
        </Card.Root>
        <ConfirmDialog.Root
          open={removing}
          onOpenChange={setRemoving}
          title="Удалить «Прайм Софт»?"
          description="312 счетов, 48 клиентов и вся история удалятся без возможности восстановления."
          confirmLabel="Удалить пространство"
          onConfirm={removeWorkspace}
        />
      </Page.Body>
    </Page.Root>
  );
}
