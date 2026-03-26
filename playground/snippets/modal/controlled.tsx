import * as React from "react";

import { Button } from "@/components/button/Button";
import { Modal } from "@/components/modal/Modal";
import { Icon } from "@/icons";

export default function ModalControlledSnippet() {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
      <Button.Root size="m" variant="primary" onClick={() => setOpen(true)}>
        Открыть извне
      </Button.Root>
      <Button.Root size="m" mode="stroke" variant="neutral" onClick={() => setOpen(false)}>
        Закрыть извне
      </Button.Root>

      <Modal.Root open={open} onOpenChange={setOpen}>
        <Modal.Portal>
          <Modal.Overlay>
            <Modal.Content aria-labelledby="modal-controlled-title">
              <Modal.Header
                icon={<Icon name="action.copy" />}
                titleId="modal-controlled-title"
                title="Состояние снаружи"
                description={
                  <>
                    Открытие и закрытие идут через <code>open</code> и <code>onOpenChange</code>.
                  </>
                }
              >
                <Modal.Close>
                  <Button.Root variant="neutral" mode="ghost" aria-label="Закрыть">
                    <Button.Icon>
                      <Icon name="action.close" tone="subtle" />
                    </Button.Icon>
                  </Button.Root>
                </Modal.Close>
              </Modal.Header>
              <Modal.Body>
                <p>Триггер внутри разметки не обязателен: окно управляется родителем.</p>
              </Modal.Body>
              <Modal.Footer>
                <Modal.Close>
                  <Button.Root size="m" variant="primary">
                    Готово
                  </Button.Root>
                </Modal.Close>
              </Modal.Footer>
            </Modal.Content>
          </Modal.Overlay>
        </Modal.Portal>
      </Modal.Root>
    </div>
  );
}
