/** Invite form in a popover: `trapFocus`, a nested Select whose list is not an outside click, submit closes the panel. Use for short forms anchored to a button. */
import { Button, Input, Label, Popover, Select } from "prime-ui-kit";
import * as React from "react";

import preview from "./examples.module.css";

export default function PopoverFeaturesExample() {
  const roleId = React.useId();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <Button.Root>Пригласить</Button.Root>
      </Popover.Trigger>
      <Popover.Content className={preview.panelWidth} trapFocus>
        <Popover.Header>
          <Popover.Title>Пригласить в проект</Popover.Title>
          <Popover.Description>Приглашение придёт на почту.</Popover.Description>
        </Popover.Header>
        <form
          className={preview.stack}
          onSubmit={(event) => {
            event.preventDefault();
            setOpen(false);
          }}
        >
          <Input.Root label="Почта" required>
            <Input.Wrapper>
              <Input.Field type="email" placeholder="name@company.ru" />
            </Input.Wrapper>
          </Input.Root>
          <div className={preview.field}>
            <Label.Root id={roleId}>Роль</Label.Root>
            <Select.Root defaultValue="editor">
              <Select.Trigger aria-labelledby={roleId}>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="viewer">Наблюдатель</Select.Item>
                <Select.Item value="editor">Редактор</Select.Item>
                <Select.Item value="admin">Администратор</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
          <Popover.Actions>
            <Button.Root variant="ghost" tone="neutral" onClick={() => setOpen(false)}>
              Отмена
            </Button.Root>
            <Button.Root type="submit">Отправить</Button.Root>
          </Popover.Actions>
        </form>
      </Popover.Content>
    </Popover.Root>
  );
}
