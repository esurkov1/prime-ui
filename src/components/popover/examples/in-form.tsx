/** An invite form in a panel: Tab stays inside, the role list does not count as an outside click, and submit closes the panel — `trapFocus`. */
import { Button, Input, Popover, Select } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function PopoverInFormExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
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
          onSubmit={(event) => {
            event.preventDefault();
            setOpen(false);
          }}
        >
          <Input.Root label="Почта" required>
            <Input.Wrapper>
              <Input.Field type="email" name="email" placeholder="name@company.ru" />
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
