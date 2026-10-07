/** A settings page: sections with a heading column and a panel, a form saved by its own button, switches that apply at once and a danger zone with a confirm. */
import {
  Button,
  Card,
  Icon,
  Input,
  Modal,
  PageContent,
  Select,
  Switch,
  Textarea,
  Typography,
  useNotifications,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./settings-page.module.css";

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

export default function SettingsPagePattern() {
  const { notify } = useNotifications();
  const [innError, setInnError] = React.useState<string>();
  const [saving, setSaving] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const inn = String(new FormData(event.currentTarget).get("inn") ?? "").replace(/\s/g, "");
    if (!/^\d{10}(\d{2})?$/.test(inn)) {
      setInnError("ИНН — 10 цифр для компании или 12 для ИП");
      return;
    }
    setInnError(undefined);
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      notify({ tone: "success", title: "Реквизиты сохранены" });
    }, 900);
  };

  const removeWorkspace = () => {
    setDeleting(true);
    window.setTimeout(() => {
      setDeleting(false);
      setConfirmOpen(false);
    }, 1200);
  };

  return (
    <PageContent.Root maxWidth="wide" aria-labelledby="settings-title">
      <PageContent.Header>
        <PageContent.Title id="settings-title">Настройки</PageContent.Title>
        <PageContent.Description>
          Реквизиты компании, уведомления и управление рабочим пространством.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <section className={styles.section} aria-labelledby="company-title">
          <div className={styles.lead}>
            <Typography as="h2" variant="title-m" id="company-title">
              Компания
            </Typography>
            <Typography variant="body-m" tone="secondary">
              Попадают в счета, акты и письма клиентам.
            </Typography>
          </div>
          <form
            className={styles.panel}
            noValidate
            onSubmit={save}
            onReset={() => setInnError(undefined)}
          >
            <Card.Root variant="panel">
              <Card.Body>
                <div className={styles.fields}>
                  <Input.Root label="Название" required>
                    <Input.Wrapper>
                      <Input.Field name="name" defaultValue="ООО «Прайм Софт»" disabled={saving} />
                    </Input.Wrapper>
                  </Input.Root>
                  <div className={styles.pair}>
                    <Input.Root
                      label="ИНН"
                      required
                      error={innError}
                      hint="10 или 12 цифр"
                      reserveSupportRow
                    >
                      <Input.Wrapper>
                        <Input.Field
                          name="inn"
                          inputMode="numeric"
                          defaultValue="7704512908"
                          disabled={saving}
                        />
                      </Input.Wrapper>
                    </Input.Root>
                    <Select.Root
                      label="Часовой пояс"
                      defaultValue="Europe/Moscow"
                      disabled={saving}
                    >
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
                    disabled={saving}
                    defaultValue="125009, Москва, ул. Тверская, д. 7, офис 412"
                  />
                </div>
              </Card.Body>
              <Card.Actions>
                <Button.Root type="reset" variant="ghost" tone="neutral" disabled={saving}>
                  Отменить изменения
                </Button.Root>
                <Button.Root type="submit" loading={saving}>
                  Сохранить
                </Button.Root>
              </Card.Actions>
            </Card.Root>
          </form>
        </section>

        <section className={styles.section} aria-labelledby="alerts-title">
          <div className={styles.lead}>
            <Typography as="h2" variant="title-m" id="alerts-title">
              Уведомления
            </Typography>
            <Typography variant="body-m" tone="secondary">
              Включаются сразу, без сохранения.
            </Typography>
          </div>
          <div className={styles.panel}>
            <Card.Root variant="panel">
              <Card.Body>
                <div className={styles.fields}>
                  {ALERTS.map((alert) => (
                    <Switch.Root
                      key={alert.name}
                      name={alert.name}
                      defaultChecked={alert.defaultChecked}
                      hint={alert.hint}
                    >
                      <Switch.Label>{alert.label}</Switch.Label>
                    </Switch.Root>
                  ))}
                </div>
              </Card.Body>
            </Card.Root>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="danger-title">
          <div className={styles.lead}>
            <Typography as="h2" variant="title-m" id="danger-title">
              Рабочее пространство
            </Typography>
            <Typography variant="body-m" tone="secondary">
              Действия, которые нельзя отменить.
            </Typography>
          </div>
          <div className={styles.panel}>
            <Card.Root variant="panel">
              <Card.Body>
                <div className={styles.danger}>
                  <div className={styles.dangerText}>
                    <Typography variant="title-s">Удалить пространство</Typography>
                    <Typography variant="body-s" tone="secondary">
                      Счета, клиенты и история будут удалены для всех участников.
                    </Typography>
                  </div>
                  <Modal.Root
                    open={confirmOpen}
                    onOpenChange={setConfirmOpen}
                    closeOnOutsideClick={false}
                    closeOnEscape={!deleting}
                  >
                    <Modal.Trigger>
                      <Button.Root variant="outline" tone="danger">
                        Удалить
                      </Button.Root>
                    </Modal.Trigger>
                    <Modal.Content size="s">
                      <Modal.Header showClose={!deleting}>
                        <Modal.Icon tone="danger">
                          <Icon name="action.delete" />
                        </Modal.Icon>
                        <Modal.Title>Удалить «Прайм Софт»?</Modal.Title>
                        <Modal.Description>
                          312 счетов, 48 клиентов и вся история удалятся без возможности
                          восстановления.
                        </Modal.Description>
                      </Modal.Header>
                      <Modal.Footer>
                        <Modal.Close>
                          <Button.Root variant="outline" tone="neutral" disabled={deleting}>
                            Не удалять
                          </Button.Root>
                        </Modal.Close>
                        <Modal.Confirm>
                          <Button.Root tone="danger" loading={deleting} onClick={removeWorkspace}>
                            Удалить пространство
                          </Button.Root>
                        </Modal.Confirm>
                      </Modal.Footer>
                    </Modal.Content>
                  </Modal.Root>
                </div>
              </Card.Body>
            </Card.Root>
          </div>
        </section>
      </PageContent.Body>
    </PageContent.Root>
  );
}
