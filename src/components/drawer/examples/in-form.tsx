/** A settings form in the panel: the footer button submits the form and an empty name keeps it open — `Drawer.Body`, `Drawer.Footer`, `error`. */
import { Button, Drawer, Icon, Input, Select, Switch } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function DrawerInFormExample() {
  const formId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string>();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name") ?? "").trim();
    if (!name) {
      setError("Введите название пространства");
      return;
    }
    setOpen(false);
  };

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setError(undefined);
      }}
    >
      <Drawer.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Настройки пространства
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Icon>
            <Icon name="nav.layoutGrid" />
          </Drawer.Icon>
          <Drawer.Title>Рабочее пространство</Drawer.Title>
          <Drawer.Description>Изменения увидят все участники</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <form id={formId} className={styles.form} noValidate onSubmit={submit}>
            <Input.Root label="Название" required error={error} reserveSupportRow>
              <Input.Wrapper>
                <Input.Field name="name" defaultValue="Команда продукта" autoFocus />
              </Input.Wrapper>
            </Input.Root>
            <Input.Root label="Адрес" hint="Только латиница, цифры и дефис">
              <Input.Wrapper>
                <Input.Field name="slug" defaultValue="product-team" />
              </Input.Wrapper>
            </Input.Root>
            <Select.Root label="Язык интерфейса" defaultValue="ru">
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="ru">Русский</Select.Item>
                <Select.Item value="en">English</Select.Item>
              </Select.Content>
            </Select.Root>
            <Switch.Root name="digest" defaultChecked>
              <Switch.Label>Еженедельная сводка на почту</Switch.Label>
            </Switch.Root>
          </form>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close>
            <Button.Root variant="outline" tone="neutral">
              Отмена
            </Button.Root>
          </Drawer.Close>
          <Button.Root type="submit" form={formId}>
            Сохранить
          </Button.Root>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
}
