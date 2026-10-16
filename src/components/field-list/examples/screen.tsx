/** A record editor as a document page, a long form whose title, description and save stand in the content header and whose blocks are titled cards one under another: a plan's name, its specs and prices; repeating records as FieldList rows with the headings once, an icon and its color side by side, a base price pinned above its changes, the price list on its own fill among the fields of its card, one value in three currencies in one row — `getLocked`, `compact`, `variant`. */
import {
  Button,
  Card,
  ColorPresets,
  FieldList,
  type FieldListColumn,
  Fieldset,
  Icon,
  type IconName,
  Input,
  Page,
  Select,
  Textarea,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./screen.module.css";

type Spec = {
  id: string;
  icon: IconName;
  name: string;
  value: string;
  color: string;
  pinned?: boolean;
};
type Period = { id: string; from: string; price: string; base?: boolean };

const SPEC_COLUMNS: FieldListColumn[] = [
  { label: "Иконка", width: "compact" },
  { label: "Цвет", width: "compact" },
  { label: "Параметр" },
  { label: "Значение" },
];

const SPEC_ICONS: { name: IconName; label: string }[] = [
  { name: "object.users", label: "Сотрудники" },
  { name: "object.storage", label: "Хранилище" },
  { name: "object.headset", label: "Поддержка" },
  { name: "object.chart", label: "Отчёты" },
  { name: "object.key", label: "Доступ" },
  { name: "object.globe", label: "Интеграции" },
];

const SPECS: Spec[] = [
  {
    id: "seats",
    icon: "object.users",
    name: "Сотрудники",
    value: "до 50",
    color: "#5068f5",
    pinned: true,
  },
  {
    id: "storage",
    icon: "object.storage",
    name: "Хранилище",
    value: "200 ГБ",
    color: "#22c55e",
    pinned: true,
  },
  {
    id: "support",
    icon: "object.headset",
    name: "Поддержка",
    value: "8/5, ответ за 2 часа",
    color: "#f97316",
    pinned: true,
  },
  { id: "reports", icon: "object.chart", name: "Отчёты", value: "12 шаблонов", color: "#a855f7" },
  { id: "sso", icon: "object.key", name: "Вход через SSO", value: "SAML, OIDC", color: "#14b8a6" },
];

const PRICE_COLUMNS: FieldListColumn[] = [{ label: "Действует" }, { label: "Цена", width: "m" }];

const MONTHS = [
  { value: "01", label: "С 1 января" },
  { value: "04", label: "С 1 апреля" },
  { value: "07", label: "С 1 июля" },
  { value: "10", label: "С 1 октября" },
];

const PERIODS: Period[] = [
  { id: "base", from: "", price: "4 900", base: true },
  { id: "autumn", from: "10", price: "5 400" },
];

const SETUP_FEE = [
  { currency: "₽", name: "setupRub", label: "Подключение в рублях", value: "15 000" },
  { currency: "$", name: "setupUsd", label: "Подключение в долларах", value: "170" },
  { currency: "€", name: "setupEur", label: "Подключение в евро", value: "" },
];

const SAVE_MS = 900;
const SAVED_MS = 2000;

export default function FieldListScreenExample() {
  const formId = React.useId();
  const specsTitleId = React.useId();
  const [specs, setSpecs] = React.useState(SPECS);
  const [periods, setPeriods] = React.useState(PERIODS);
  const [nameError, setNameError] = React.useState<string>();
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name") ?? "").trim();
    if (name === "") {
      setNameError("Назовите тариф: так его увидят клиенты");
      event.currentTarget.querySelector<HTMLInputElement>("[name='name']")?.focus();
      return;
    }
    setNameError(undefined);
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), SAVED_MS);
    }, SAVE_MS);
  };

  return (
    <Page.Root maxWidth="wide" aria-labelledby="plan-title">
      <Page.Header>
        <Page.Heading>
          <Page.Title id="plan-title">Тариф «Команда»</Page.Title>
          <Page.Description>Так тариф выглядит на странице цен и в счетах.</Page.Description>
        </Page.Heading>
        <Page.Actions>
          <Button.Root type="submit" form={formId} loading={saving}>
            {saved ? "Сохранено" : "Сохранить тариф"}
          </Button.Root>
        </Page.Actions>
      </Page.Header>
      <Page.Body>
        <form id={formId} noValidate onSubmit={save}>
          <Card.Root variant="panel">
            <Card.Header>
              <Card.Title as="h2">Основное</Card.Title>
            </Card.Header>
            <Card.Body>
              <Fieldset disabled={saving} aria-label="Основное">
                <Input.Root label="Название" error={nameError}>
                  <Input.Wrapper>
                    <Input.Field name="name" defaultValue="Команда" />
                  </Input.Wrapper>
                </Input.Root>
                <Textarea.Root
                  name="summary"
                  label="Описание"
                  optional
                  rows={2}
                  defaultValue="Для отделов до 50 человек: задачи, документы и отчёты в одном месте."
                />
              </Fieldset>
            </Card.Body>
          </Card.Root>
        </form>
        <Card.Root variant="panel">
          <Card.Header>
            <Card.Title as="h2" id={specsTitleId}>
              Характеристики
            </Card.Title>
            <Card.Description>Первые три закреплены: их видно в карточке тарифа.</Card.Description>
          </Card.Header>
          <Card.Body>
            <FieldList
              aria-labelledby={specsTitleId}
              disabled={saving}
              columns={SPEC_COLUMNS}
              reorderable
              value={specs}
              onValueChange={setSpecs}
              getId={(spec) => spec.id}
              getLabel={(spec) => spec.name}
              getLocked={(spec) => spec.pinned ?? false}
              createItem={(): Spec => ({
                id: crypto.randomUUID(),
                icon: "object.globe",
                name: "",
                value: "",
                color: "#14b8a6",
              })}
              addLabel="Добавить характеристику"
              renderItem={(spec, row) => (
                <>
                  <Select.Root
                    value={spec.icon}
                    onValueChange={(icon) => row.update({ icon: icon as IconName })}
                  >
                    <Select.Trigger>
                      <Select.TriggerIcon>
                        <Icon name={spec.icon} />
                      </Select.TriggerIcon>
                    </Select.Trigger>
                    <Select.Content>
                      {SPEC_ICONS.map((icon) => (
                        <Select.Item key={icon.name} value={icon.name}>
                          <Select.ItemIcon>
                            <Icon name={icon.name} />
                          </Select.ItemIcon>
                          {icon.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <ColorPresets.Root
                    value={spec.color}
                    onValueChange={(color) => row.update({ color: color ?? spec.color })}
                  >
                    <ColorPresets.Trigger>
                      <ColorPresets.SwatchButton />
                    </ColorPresets.Trigger>
                    <ColorPresets.Content />
                  </ColorPresets.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Field
                        value={spec.name}
                        onChange={(event) => row.update({ name: event.target.value })}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Field
                        value={spec.value}
                        onChange={(event) => row.update({ value: event.target.value })}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </>
              )}
            />
          </Card.Body>
        </Card.Root>
        <Card.Root variant="panel">
          <Card.Header>
            <Card.Title as="h2">Стоимость</Card.Title>
          </Card.Header>
          <Card.Body className={styles.groups}>
            <Fieldset label="За месяц" disabled={saving}>
              <FieldList
                variant="surface"
                columns={PRICE_COLUMNS}
                value={periods}
                onValueChange={setPeriods}
                getId={(period) => period.id}
                getLocked={(period) => period.base ?? false}
                labels={{ lockedReason: "Базовую цену нельзя удалить" }}
                createItem={() => ({ id: crypto.randomUUID(), from: "", price: "" })}
                addLabel="Добавить изменение цены"
                renderItem={(period, row) => (
                  <>
                    {period.base ? (
                      <Input.Root>
                        <Input.Wrapper>
                          <Input.Field value="Всегда, если нет изменений" readOnly />
                        </Input.Wrapper>
                      </Input.Root>
                    ) : (
                      <Select.Root
                        value={period.from}
                        onValueChange={(from) => row.update({ from })}
                        placeholder="Выберите месяц"
                      >
                        <Select.Trigger>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          {MONTHS.map((month) => (
                            <Select.Item key={month.value} value={month.value}>
                              {month.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    )}
                    <Input.Root>
                      <Input.Wrapper>
                        <Input.Field
                          value={period.price}
                          inputMode="decimal"
                          placeholder="0"
                          onChange={(event) => row.update({ price: event.target.value })}
                        />
                        <Input.InlineAffix side="end">₽</Input.InlineAffix>
                      </Input.Wrapper>
                    </Input.Root>
                  </>
                )}
              />
            </Fieldset>
            <Fieldset
              label="Подключение"
              description="Разовый платёж; пустая валюта не выставляется."
              disabled={saving}
            >
              <div className={styles.currencies}>
                {SETUP_FEE.map((fee) => (
                  <Input.Root key={fee.name}>
                    <Input.Wrapper>
                      <Input.Field
                        name={fee.name}
                        aria-label={fee.label}
                        inputMode="decimal"
                        placeholder="0"
                        defaultValue={fee.value}
                      />
                      <Input.InlineAffix side="end">{fee.currency}</Input.InlineAffix>
                    </Input.Wrapper>
                  </Input.Root>
                ))}
              </div>
            </Fieldset>
          </Card.Body>
        </Card.Root>
      </Page.Body>
    </Page.Root>
  );
}
