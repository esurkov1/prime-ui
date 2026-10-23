/** A switch in a card: one setting is a one-line card with the switch at its end, several settings are a group card with a more menu in the header and a switch per row — `Switch.Root`, `fullWidth`, `Card.Actions`. */
import { Button, Card, Dropdown, Icon, Switch } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function CardSwitchExample() {
  return (
    <div className={styles.grid}>
      <Card.Root>
        <Card.Header>
          <Card.Icon>
            <Icon name="object.bell" />
          </Card.Icon>
          <Card.Title>Уведомления</Card.Title>
          <Card.Actions>
            <Switch.Root defaultChecked aria-label="Уведомления" />
          </Card.Actions>
        </Card.Header>
      </Card.Root>
      <Card.Root>
        <Card.Header>
          <Card.Title>Письма клиентам</Card.Title>
          <Card.Actions>
            <Dropdown.Root>
              <Dropdown.Trigger>
                <Button.Root variant="soft" tone="neutral" aria-label="Ещё">
                  <Button.Icon>
                    <Icon name="action.more" />
                  </Button.Icon>
                </Button.Root>
              </Dropdown.Trigger>
              <Dropdown.Content align="end">
                <Dropdown.Item>Настройки писем</Dropdown.Item>
                <Dropdown.Item>Сбросить к умолчанию</Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Root>
          </Card.Actions>
        </Card.Header>
        <Card.Body>
          <Switch.Root fullWidth defaultChecked>
            <Switch.Label>Счёт выставлен</Switch.Label>
          </Switch.Root>
          <Switch.Root fullWidth defaultChecked>
            <Switch.Label>Счёт оплачен</Switch.Label>
          </Switch.Root>
          <Switch.Root fullWidth>
            <Switch.Label>Напоминание о сроке</Switch.Label>
          </Switch.Root>
        </Card.Body>
      </Card.Root>
    </div>
  );
}
