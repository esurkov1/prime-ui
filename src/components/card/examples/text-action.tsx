/** Summary tiles of a rental with the action of each step at the end of the row — `stat-text`, `Card.Value`, `Card.Meta`. */
import { Button, Card, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function CardTextActionExample() {
  return (
    <div className={styles.grid}>
      <Card.Root variant="stat-text">
        <Card.Label>Выдан</Card.Label>
        <Card.Value>14 октября, 12:40</Card.Value>
        <Card.Meta>Выдала Анна Смирнова</Card.Meta>
        <Button.Root variant="soft" tone="neutral">
          Отменить
        </Button.Root>
      </Card.Root>
      <Card.Root variant="stat-text">
        <Card.Label>Вернули</Card.Label>
        <Card.Value>Ещё не вернули</Card.Value>
        <Card.Meta>Срок — 21 октября</Card.Meta>
        <Button.Root variant="soft">
          <Button.Icon>
            <Icon name="action.check" />
          </Button.Icon>
          Вернули
        </Button.Root>
      </Card.Root>
    </div>
  );
}
