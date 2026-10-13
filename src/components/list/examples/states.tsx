/** The open record, a regular row and an unavailable one — `current`, `disabled`. */
import { Card, List } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ListStatesExample() {
  return (
    <Card.Root className={styles.pane}>
      <Card.Body>
        <List.Root aria-label="Заявки">
          <List.Item current>
            <List.ItemText>Заявка № 1207 · Возврат оплаты</List.ItemText>
            <List.ItemDescription>Открыта сейчас</List.ItemDescription>
          </List.Item>
          <List.Item>
            <List.ItemText>Заявка № 1206 · Смена тарифа</List.ItemText>
            <List.ItemDescription>Ждёт ответа клиента</List.ItemDescription>
          </List.Item>
          <List.Item disabled>
            <List.ItemText>Заявка № 1198 · Доступ к API</List.ItemText>
            <List.ItemDescription>В архиве, недоступна</List.ItemDescription>
          </List.Item>
        </List.Root>
      </Card.Body>
    </Card.Root>
  );
}
