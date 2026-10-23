/** On a phone column nothing wraps inside a line: the title gives way to its floor and the badges fold into a count, icon controls stay, a labelled button drops under the text — `List.ItemBadges`, `List.ItemActions`. */
import { Avatar, Badge, Button, Card, Icon, List, StatusDot, Switch } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ListNarrowExample() {
  return (
    <Card.Root className={styles.narrow}>
      <Card.Body>
        <List.Root aria-label="Поставки и сеансы">
          <List.Item>
            <List.ItemIcon>
              <Avatar.Root color="purple">
                <Avatar.Fallback>АК</Avatar.Fallback>
              </Avatar.Root>
            </List.ItemIcon>
            <List.ItemText number="#318">Поставка на склад «Север»</List.ItemText>
            <List.ItemBadges>
              <Badge.Root tone="danger">Срочно</Badge.Root>
              <Badge.Root>Опт</Badge.Root>
              <Badge.Root>Холодильник</Badge.Root>
            </List.ItemBadges>
            <List.ItemDescription>
              <StatusDot tone="warning">Ждёт приёмки</StatusDot>9 окт., ООО «Северный ветер»
            </List.ItemDescription>
            <List.ItemActions>
              <Switch.Root aria-label="Уведомлять о поставке №318" defaultChecked />
            </List.ItemActions>
          </List.Item>
          <List.Item>
            <List.ItemIcon>
              <Icon name="viewport.mobile" />
            </List.ItemIcon>
            <List.ItemText>Safari · iPhone</List.ItemText>
            <List.ItemDescription>Казань · вчера в 21:40</List.ItemDescription>
            <List.ItemActions>
              <Button.Root variant="soft" tone="neutral">
                Завершить сеанс
              </Button.Root>
            </List.ItemActions>
          </List.Item>
        </List.Root>
      </Card.Body>
    </Card.Root>
  );
}
