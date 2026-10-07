/** The same group on the canvas, in a card, in a nested card and in a modal. Use it to check the track and thumb contrast on every host. */
import { Button, Card, Modal, SegmentedControl, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

function Period({ label }: { label: string }) {
  return (
    <SegmentedControl.Root defaultValue="week" aria-label={label}>
      <SegmentedControl.Item value="day">День</SegmentedControl.Item>
      <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
      <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}

export default function SegmentedControlSurfacesExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={styles.hosts}>
      <div className={styles.host}>
        <Typography.Root variant="caption" tone="muted">
          Холст
        </Typography.Root>
        <Period label="Период, холст" />
      </div>
      <div className={styles.host}>
        <Typography.Root variant="caption" tone="muted">
          Карточка
        </Typography.Root>
        <Card.Root>
          <Period label="Период, карточка" />
        </Card.Root>
      </div>
      <div className={styles.host}>
        <Typography.Root variant="caption" tone="muted">
          Карточка в карточке
        </Typography.Root>
        <Card.Root>
          <Card.Root>
            <Period label="Период, вложенная карточка" />
          </Card.Root>
        </Card.Root>
      </div>
      <div className={styles.host}>
        <Typography.Root variant="caption" tone="muted">
          Модальное окно
        </Typography.Root>
        <Button.Root variant="outline" tone="neutral" onClick={() => setOpen(true)}>
          Открыть
        </Button.Root>
        <Modal.Root open={open} onOpenChange={setOpen}>
          <Modal.Content size="s">
            <Modal.Header>
              <Modal.Title>Экспорт отчёта</Modal.Title>
              <Modal.Description>Выберите период выгрузки.</Modal.Description>
            </Modal.Header>
            <Modal.Body>
              <SegmentedControl.Root fullWidth defaultValue="month" aria-label="Период выгрузки">
                <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
                <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
                <SegmentedControl.Item value="quarter">Квартал</SegmentedControl.Item>
                <SegmentedControl.Item value="year">Год</SegmentedControl.Item>
              </SegmentedControl.Root>
            </Modal.Body>
            <Modal.Footer>
              <Modal.Close>
                <Button.Root variant="outline" tone="neutral">
                  Отмена
                </Button.Root>
              </Modal.Close>
              <Modal.Confirm>
                <Button.Root onClick={() => setOpen(false)}>Выгрузить</Button.Root>
              </Modal.Confirm>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Root>
      </div>
    </div>
  );
}
