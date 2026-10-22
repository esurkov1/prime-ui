/** Cards about one object in one two-line shape: its mark leads the header — a person's avatar, an icon tile, a term ring — its name stands over one secondary line and its action sits at the end — `Card.Icon`, `Avatar.Root`, `ProgressCircle`, `Card.Actions`. */
import { Avatar, Button, Card, Icon, ProgressCircle } from "prime-ui-kit";

import styles from "./examples.module.css";

const ACCOUNT = {
  initials: "АС",
  name: "Анна Соколова",
  details: "Telegram @a.sokolova · привязан 12 сентября",
};

const SESSION = { title: "Chrome · macOS", details: "Москва · сейчас" };

const RENTAL = {
  daysLeft: 17,
  daysTotal: 30,
  title: "Аренда до 21 нояб",
  details: "Осталось 17 дней",
};

export default function CardMarksExample() {
  return (
    <div className={styles.panel}>
      <div className={styles.stack}>
        <Card.Root>
          <Card.Header>
            <Card.Icon>
              <Avatar.Root color="blue">
                <Avatar.Fallback>{ACCOUNT.initials}</Avatar.Fallback>
              </Avatar.Root>
            </Card.Icon>
            <Card.Title>{ACCOUNT.name}</Card.Title>
            <Card.Description>{ACCOUNT.details}</Card.Description>
            <Card.Actions>
              <Button.Root variant="soft" tone="neutral">
                Отвязать
              </Button.Root>
            </Card.Actions>
          </Card.Header>
        </Card.Root>
        <Card.Root>
          <Card.Header>
            <Card.Icon>
              <Icon name="viewport.desktop" />
            </Card.Icon>
            <Card.Title>{SESSION.title}</Card.Title>
            <Card.Description>{SESSION.details}</Card.Description>
            <Card.Actions>
              <Button.Root variant="soft" tone="neutral">
                Завершить
              </Button.Root>
            </Card.Actions>
          </Card.Header>
        </Card.Root>
        <Card.Root>
          <Card.Header>
            <Card.Icon>
              <ProgressCircle
                value={((RENTAL.daysTotal - RENTAL.daysLeft) / RENTAL.daysTotal) * 100}
                color="blue"
                aria-label={`Аренда: осталось ${RENTAL.daysLeft} д из ${RENTAL.daysTotal}`}
              >
                {`${RENTAL.daysLeft} д`}
              </ProgressCircle>
            </Card.Icon>
            <Card.Title>{RENTAL.title}</Card.Title>
            <Card.Description>{RENTAL.details}</Card.Description>
            <Card.Actions>
              <Button.Root variant="soft" tone="neutral">
                Продлить
              </Button.Root>
            </Card.Actions>
          </Card.Header>
        </Card.Root>
      </div>
    </div>
  );
}
