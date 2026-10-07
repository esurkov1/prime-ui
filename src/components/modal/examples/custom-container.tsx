/** The dialog portals into a given node instead of the document body — `container`. */
import { Button, Modal } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function ModalCustomContainerExample() {
  const [host, setHost] = React.useState<HTMLDivElement | null>(null);

  return (
    <div ref={setHost} className={styles.portalHost}>
      {host ? (
        <Modal.Root>
          <Modal.Trigger>
            <Button.Root variant="soft" tone="neutral">
              Открыть внутри блока
            </Button.Root>
          </Modal.Trigger>
          <Modal.Content container={host} size="s">
            <Modal.Header>
              <Modal.Title>Свой контейнер</Modal.Title>
              <Modal.Description>Диалог смонтирован внутрь этого блока.</Modal.Description>
            </Modal.Header>
          </Modal.Content>
        </Modal.Root>
      ) : null}
    </div>
  );
}
