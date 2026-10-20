/** Object cards in one two-line shape: the object's mark leads the header — a channel avatar, a session icon tile, a term ring — its name stands over one secondary line and its action sits at the end — `Card.Header`, `Card.Icon`, `Card.Title`, `Card.Description`. */
import { Avatar, Button, Card, Icon, ProgressCircle } from "prime-ui-kit";

import styles from "./examples.module.css";

const ACCOUNT = {
  initials: "WR",
  title: "Аккаунт @way2ride_bot",
  details: "Подключён 12 окт · Анна Котова",
};

const SESSION = { title: "Chrome · macOS", details: "Москва · сейчас" };

const RENTAL = {
  daysLeft: 17,
  daysTotal: 30,
  title: "Аренда до 21 нояб",
  details: "Осталось 17 дней",
};

export default function CardObjectCardsExample() {
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
            <Card.Title>{ACCOUNT.title}</Card.Title>
            <Card.Description>{ACCOUNT.details}</Card.Description>
            <Button.Root variant="soft" tone="neutral">
              Отключить
            </Button.Root>
          </Card.Header>
        </Card.Root>
        <Card.Root>
          <Card.Header>
            <Card.Icon>
              <Icon name="viewport.desktop" />
            </Card.Icon>
            <Card.Title>{SESSION.title}</Card.Title>
            <Card.Description>{SESSION.details}</Card.Description>
            <Button.Root variant="soft" tone="neutral">
              Завершить
            </Button.Root>
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
            <Button.Root variant="soft" tone="neutral">
              Продлить
            </Button.Root>
          </Card.Header>
        </Card.Root>
      </div>
    </div>
  );
}
