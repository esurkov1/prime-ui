/** A linked Telegram account in an employee card: the avatar leads the header, the handle stands under the name and the unlink button sits at the end — `Card.Icon`, `Avatar.Root`, `Card.Description`. */
import { Avatar, Button, Card, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const ACCOUNT = {
  name: "Анна Соколова",
  initials: "АС",
  handle: "@a.sokolova",
  linkedAt: "Привязан 12 сентября",
};

export default function CardPersonHeaderExample() {
  return (
    <div className={styles.panel}>
      <Card.Root>
        <Card.Header>
          <Card.Icon>
            <Avatar.Root color="blue">
              <Avatar.Fallback>{ACCOUNT.initials}</Avatar.Fallback>
            </Avatar.Root>
          </Card.Icon>
          <Card.Title>{ACCOUNT.name}</Card.Title>
          <Card.Description>{ACCOUNT.handle}</Card.Description>
          <Button.Root variant="soft" tone="neutral">
            Отвязать
          </Button.Root>
        </Card.Header>
        <Card.Body>
          <Typography as="p" variant="body-s" tone="secondary">
            {ACCOUNT.linkedAt}. Бот присылает сюда новые заказы клиентов сотрудника и напоминания о
            просроченных счетах.
          </Typography>
        </Card.Body>
      </Card.Root>
    </div>
  );
}
