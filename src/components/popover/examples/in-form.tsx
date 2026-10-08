/** An invite form in a panel: Tab stays inside, the role list does not count as an outside click, an invalid email shakes the field and keeps the panel open until it is fixed — `trapFocus`, `error`. */
import { Button, Input, Popover, Select } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/** The email error, or nothing when the address is valid. */
function emailError(value: string) {
  if (!value.trim()) return "Введите почту";
  if (!/^\S+@\S+\.\S+$/.test(value.trim())) return "Проверьте адрес: нужен вид name@company.ru";
  return undefined;
}

export default function PopoverInFormExample() {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string>();

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setError(undefined);
      }}
    >
      <Popover.Trigger>
        <Button.Root>Пригласить</Button.Root>
      </Popover.Trigger>
      <Popover.Content className={styles.panel} trapFocus>
        <Popover.Header>
          <Popover.Title>Пригласить в проект</Popover.Title>
          <Popover.Description>Приглашение придёт на почту.</Popover.Description>
        </Popover.Header>
        <form
          className={styles.stack}
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            const next = emailError(String(new FormData(event.currentTarget).get("email") ?? ""));
            setError(next);
            if (!next) setOpen(false);
          }}
        >
          <Input.Root label="Почта" required error={error} reserveSupportRow>
            <Input.Wrapper>
              <Input.Field
                type="email"
                name="email"
                placeholder="name@company.ru"
                onValueChange={() => setError(undefined)}
              />
            </Input.Wrapper>
          </Input.Root>
          <Select.Root label="Роль" defaultValue="editor">
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="viewer">Наблюдатель</Select.Item>
              <Select.Item value="editor">Редактор</Select.Item>
              <Select.Item value="admin">Администратор</Select.Item>
            </Select.Content>
          </Select.Root>
          <Popover.Actions>
            <Popover.Close>
              <Button.Root variant="ghost" tone="neutral">
                Отмена
              </Button.Root>
            </Popover.Close>
            <Button.Root type="submit">Отправить</Button.Root>
          </Popover.Actions>
        </form>
      </Popover.Content>
    </Popover.Root>
  );
}
