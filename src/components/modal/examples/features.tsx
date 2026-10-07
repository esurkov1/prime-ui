/** A long body that scrolls while header and footer stay put, and a dialog portaled into a custom `container`. Use for terms and long text, or to mount a dialog inside a specific node. */
import { Button, Modal, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const TERMS = Array.from(
  { length: 14 },
  (_, i) =>
    `${i + 1}. Исполнитель обрабатывает данные только для оказания услуги и не передаёт их третьим лицам без согласия заказчика.`,
);

export default function ModalFeaturesExample() {
  const [host, setHost] = React.useState<HTMLDivElement | null>(null);

  return (
    <div className={styles.row}>
      <Modal.Root>
        <Modal.Trigger>
          <Button.Root variant="soft" tone="neutral">
            Длинный текст
          </Button.Root>
        </Modal.Trigger>
        <Modal.Content size="l">
          <Modal.Header>
            <Modal.Title>Условия обработки данных</Modal.Title>
            <Modal.Description>Редакция от 1 октября 2026 года</Modal.Description>
          </Modal.Header>
          <Modal.Body>
            {TERMS.map((line) => (
              <Typography.Root key={line} variant="body-m" tone="secondary">
                {line}
              </Typography.Root>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>
              <Button.Root variant="outline" tone="neutral">
                Не сейчас
              </Button.Root>
            </Modal.Close>
            <Modal.Close>
              <Button.Root>Принимаю</Button.Root>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>

      <div ref={setHost} className={styles.portalHost}>
        {host ? (
          <Modal.Root>
            <Modal.Trigger>
              <Button.Root variant="soft" tone="neutral">
                Портал в этот блок
              </Button.Root>
            </Modal.Trigger>
            <Modal.Content container={host} size="s">
              <Modal.Header>
                <Modal.Title>Свой контейнер</Modal.Title>
                <Modal.Description>Диалог смонтирован внутрь выделенного блока.</Modal.Description>
              </Modal.Header>
            </Modal.Content>
          </Modal.Root>
        ) : null}
      </div>
    </div>
  );
}
