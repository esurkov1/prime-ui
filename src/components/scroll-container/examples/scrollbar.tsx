/** The kit's quiet thin bar on a list and no bar on a strip of chips, where the faded edges show the overflow — `scrollbar`. */
import { Badge, Card, ScrollContainer, Typography } from "prime-ui-kit";

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
        <Typography as="h3" variant="title-s" className={styles.cardTitle}>
          thin
        </Typography>
        <ScrollContainer>
          <ul className={styles.list}>
            {CLIENTS.map((client) => (
              <li key={client}>
                <Typography as="span" variant="body-m">
                  {client}
                </Typography>
              </li>
            ))}
          </ul>
        </ScrollContainer>
      </Card.Root>
      <Card.Root role="region" className={styles.card} aria-label="Фильтры заказов">
        <Typography as="h3" variant="title-s" className={styles.cardTitle}>
          hidden
        </Typography>
        <ScrollContainer axis="horizontal" scrollbar="hidden">
          <div className={styles.strip}>
            {TAGS.map((tag) => (
              <Badge.Root key={tag}>{tag}</Badge.Root>
            ))}
          </div>
        </ScrollContainer>
      </Card.Root>
    </div>
  );
}
