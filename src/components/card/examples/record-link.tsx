/** A transport card that opens its record from anywhere and keeps its own button, a full-width line above the action row — `Card.Link`, `Card.Footer`, `divider`. */
import { Badge, Button, Card, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function CardRecordLinkExample() {
  return (
    <div className={styles.grid}>
      <Card.Root>
        <Card.Header>
          <Card.Title>
            <Card.Link href="#pcx-160">Honda PCX 160 · А 123 ВС 77</Card.Link>
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Description>Аренда с 14 по 21 октября, залог 15 000 ₽</Card.Description>
          <Badge.Root color="blue">Ждёт выдачи</Badge.Root>
        </Card.Body>
        <Card.Footer divider="full">
          <Button.Root size="s" variant="outline" tone="neutral">
            <Button.Icon>
              <Icon name="action.check" />
            </Button.Icon>
            Выдан
          </Button.Root>
        </Card.Footer>
      </Card.Root>
    </div>
  );
}
