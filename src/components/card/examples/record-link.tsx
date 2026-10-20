/** A transport card that opens its record from anywhere and keeps its own button, a full-width line above the action row, and a deposit card that opens its window in place — `Card.Link`, `asChild`, `Card.Footer`, `divider`. */
import { Badge, Button, Card, Icon, Modal } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function CardRecordLinkExample() {
  const [depositOpen, setDepositOpen] = React.useState(false);

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
          <Button.Root size="s" variant="soft" tone="neutral">
            <Button.Icon>
              <Icon name="action.check" />
            </Button.Icon>
            Выдан
          </Button.Root>
        </Card.Footer>
      </Card.Root>
      <Card.Root>
        <Card.Header>
          <Card.Title>
            <Card.Link asChild>
              <button type="button" onClick={() => setDepositOpen(true)}>
                Залог · 15 000 ₽
              </button>
            </Card.Link>
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Description>Принят наличными 14 октября</Card.Description>
          <Badge.Root color="green">Получен</Badge.Root>
        </Card.Body>
      </Card.Root>
      <Modal.Root open={depositOpen} onOpenChange={setDepositOpen}>
        <Modal.Content size="s">
          <Modal.Header>
            <Modal.Title>Залог · 15 000 ₽</Modal.Title>
            <Modal.Description>Принят наличными 14 октября, вернуть при сдаче.</Modal.Description>
          </Modal.Header>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
}
