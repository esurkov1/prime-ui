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
        <Modal.Panel
          closeAriaLabel="Закрыть"
          description={
            <>
              Открытие и закрытие идут через <code>open</code> и <code>onOpenChange</code>.
            </>
          }
          footer={
            <Modal.Close>
              <Button.Root size="m" variant="primary">
                Готово
              </Button.Root>
            </Modal.Close>
          }
          icon={<Icon name="action.copy" />}
          title="Состояние снаружи"
        >
          <p>Триггер внутри разметки не обязателен: окно управляется родителем.</p>
        </Modal.Panel>
      </Modal.Root>
    </div>
  );
}
