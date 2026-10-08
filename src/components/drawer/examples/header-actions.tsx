/** A record card: its status and a ⋯ menu sit in the header before the close button, one tier smaller — `Drawer.Actions`. */
import { Badge, Button, Drawer, Dropdown, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

const DEAL = {
  title: "Сделка №1042",
  client: "ООО «Северный ветер»",
  amount: "480 000 ₽",
  owner: "Анна Соколова",
};

export default function DrawerHeaderActionsExample() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Открыть сделку
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>{DEAL.title}</Drawer.Title>
          <Drawer.Description>{DEAL.client}</Drawer.Description>
          <Drawer.Actions>
            <Badge.Root color="green">Выиграна</Badge.Root>
            <Dropdown.Root>
              <Dropdown.Trigger>
                <Button.Root variant="ghost" tone="neutral" aria-label="Действия со сделкой">
                  <Button.Icon>
                    <Icon name="action.more" />
                  </Button.Icon>
                </Button.Root>
              </Dropdown.Trigger>
              <Dropdown.Content align="end">
                <Dropdown.Item>Дублировать</Dropdown.Item>
                <Dropdown.Item>Скопировать ссылку</Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item tone="danger">Удалить сделку</Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Root>
          </Drawer.Actions>
        </Drawer.Header>
        <Drawer.Body>
          <dl className={styles.details}>
            <dt>Сумма</dt>
            <dd>{DEAL.amount}</dd>
            <dt>Ответственный</dt>
            <dd>{DEAL.owner}</dd>
          </dl>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close>
            <Button.Root variant="outline" tone="neutral">
              Закрыть
            </Button.Root>
          </Drawer.Close>
          <Button.Root>Выставить счёт</Button.Root>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
}
