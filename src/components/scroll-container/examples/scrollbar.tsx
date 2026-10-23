/** The kit's quiet thin bar on a list and no bar on a strip of chips, where the faded edges show the overflow — `scrollbar`. */
import { Badge, Card, List, ScrollContainer } from "prime-ui-kit";

import styles from "./examples.module.css";

const CLIENTS = [
  "ООО «Северный склад»",
  "АО «Тепломонтаж»",
  "ИП Кравцова",
  "ООО «Логистик Плюс»",
  "ООО «Альфа Ритейл»",
  "АО «ПромСнаб»",
  "ООО «Городские аптеки»",
  "ООО «Вектор»",
  "ИП Сафонов",
];
const TAGS = ["Новые", "В работе", "Ждут оплаты", "Отгружены", "Возвраты", "Архив", "Черновики"];

export default function ScrollContainerScrollbarExample() {
  return (
    <div className={styles.layout}>
      <Card.Root role="region" className={styles.card} aria-label="Клиенты">
        <Card.Header>
          <Card.Title>Клиенты</Card.Title>
          <Card.Description>thin</Card.Description>
        </Card.Header>
        <Card.Body>
          <ScrollContainer>
            <List.Root aria-label="Клиенты">
              {CLIENTS.map((client) => (
                <List.Item key={client}>
                  <List.ItemText>{client}</List.ItemText>
                </List.Item>
              ))}
            </List.Root>
          </ScrollContainer>
        </Card.Body>
      </Card.Root>
      <Card.Root role="region" className={styles.card} aria-label="Статусы заказов">
        <Card.Header>
          <Card.Title>Статусы заказов</Card.Title>
          <Card.Description>hidden</Card.Description>
        </Card.Header>
        <Card.Body>
          <ScrollContainer axis="horizontal" scrollbar="hidden">
            <div className={styles.strip}>
              {TAGS.map((tag) => (
                <Badge.Root key={tag}>{tag}</Badge.Root>
              ))}
            </div>
          </ScrollContainer>
        </Card.Body>
      </Card.Root>
    </div>
  );
}
