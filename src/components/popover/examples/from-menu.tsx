/** A menu command opens a panel at the same button: the rename item shows a form anchored to the menu button and focus lands in its field, not back on that button — `Popover.Anchor`, `initialFocus`. */
import { Button, Dropdown, Icon, Input, Popover } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function PopoverFromMenuExample() {
  const [renaming, setRenaming] = React.useState(false);
  const [name, setName] = React.useState("Запуск в регионах");

  return (
    <Popover.Root open={renaming} onOpenChange={setRenaming}>
      <Popover.Anchor>
        <span className={styles.anchor}>
          <Dropdown.Root>
            <Dropdown.Trigger>
              <Button.Root variant="ghost" tone="neutral" aria-label="Действия с проектом">
                <Button.Icon>
                  <Icon name="action.more" />
                </Button.Icon>
              </Button.Root>
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Item onSelect={() => setRenaming(true)}>Переименовать…</Dropdown.Item>
              <Dropdown.Item>Дублировать</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </span>
      </Popover.Anchor>
      <Popover.Content className={styles.panel} initialFocus trapFocus>
        <form
          className={styles.stack}
          onSubmit={(event) => {
            event.preventDefault();
            setName(String(new FormData(event.currentTarget).get("name") ?? name));
            setRenaming(false);
          }}
        >
          <Input.Root label="Название проекта">
            <Input.Wrapper>
              <Input.Field name="name" defaultValue={name} />
            </Input.Wrapper>
          </Input.Root>
          <Popover.Actions>
            <Popover.Close>
              <Button.Root variant="soft" tone="neutral">
                Отмена
              </Button.Root>
            </Popover.Close>
            <Button.Root type="submit">Сохранить</Button.Root>
          </Popover.Actions>
        </form>
      </Popover.Content>
    </Popover.Root>
  );
}
