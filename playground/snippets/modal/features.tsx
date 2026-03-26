import * as React from "react";

import { Button } from "@/components/button/Button";
import { Modal } from "@/components/modal/Modal";
import { Icon } from "@/icons";

export default function ModalFeaturesSnippet() {
  const [portalHost, setPortalHost] = React.useState<HTMLDivElement | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        ref={setPortalHost}
        style={{
          minHeight: "8rem",
          border: "1px dashed var(--prime-sys-color-border-default, #ccc)",
          borderRadius: "8px",
          padding: "0.75rem",
          position: "relative",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            color: "var(--prime-sys-color-content-secondary)",
          }}
        >
          Проп <code>container</code> у <code>Modal.Panel</code>: портал монтируется сюда в DOM
          (удобно для изоляции в тестах и особых контекстов наложения).
        </p>
        {portalHost ? (
          <Modal.Root>
            <Modal.Trigger>
              <Button.Root size="m" variant="neutral" mode="stroke">
                Портал в контейнер
              </Button.Root>
            </Modal.Trigger>
            <Modal.Panel closeAriaLabel="Закрыть" container={portalHost} icon={<Icon name="nav.layoutGrid" />} title="Свой контейнер">
              <p>Содержимое портала — дочерний узел выделенной области выше.</p>
            </Modal.Panel>
          </Modal.Root>
        ) : null}
      </div>

      <Modal.Root>
        <Modal.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            Длинное содержимое с прокруткой
          </Button.Root>
        </Modal.Trigger>
        <Modal.Panel
          bodyStyle={{ maxHeight: "10rem", overflowY: "auto" }}
          closeAriaLabel="Закрыть"
          description={
            <>
              Задайте ограничение по высоте на область тела через <code>bodyStyle</code> (или{" "}
              <code>bodyClassName</code>), чтобы фон страницы оставался заблокированным.
            </>
          }
          footer={
            <Modal.Close>
              <Button.Root size="m" variant="primary">
                Закрыть
              </Button.Root>
            </Modal.Close>
          }
          icon={<Icon name="nav.itemDot" />}
          title="Прокрутка внутри панели"
        >
          {[
            "Пункт списка 1: текст для проверки прокрутки внутри диалога.",
            "Пункт списка 2: текст для проверки прокрутки внутри диалога.",
            "Пункт списка 3: текст для проверки прокрутки внутри диалога.",
            "Пункт списка 4: текст для проверки прокрутки внутри диалога.",
            "Пункт списка 5: текст для проверки прокрутки внутри диалога.",
            "Пункт списка 6: текст для проверки прокрутки внутри диалога.",
            "Пункт списка 7: текст для проверки прокрутки внутри диалога.",
            "Пункт списка 8: текст для проверки прокрутки внутри диалога.",
            "Пункт списка 9: текст для проверки прокрутки внутри диалога.",
            "Пункт списка 10: текст для проверки прокрутки внутри диалога.",
            "Пункт списка 11: текст для проверки прокрутки внутри диалога.",
            "Пункт списка 12: текст для проверки прокрутки внутри диалога.",
          ].map((line) => (
            <p key={line} style={{ margin: "0 0 0.5rem" }}>
              {line}
            </p>
          ))}
        </Modal.Panel>
      </Modal.Root>
    </div>
  );
}
