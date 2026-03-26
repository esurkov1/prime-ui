import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { LinkButton } from "@/components/link-button/LinkButton";
import { Modal } from "@/components/modal/Modal";
import { Icon } from "@/icons";

export default function ModalCompositionSnippet() {
  return (
    <>
      <p
        style={{
          margin: 0,
          fontSize: "0.875rem",
          color: "var(--prime-sys-color-content-secondary)",
        }}
      >
        Рекомендуемая структура: <code>Modal.Header</code> (обязателен), <code>Modal.Body</code>{" "}
        (опционально), <code>Modal.Footer</code> (опционально).
      </p>

      <Modal.Root>
        <Modal.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            Только шапка и футер
          </Button.Root>
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Overlay>
            <Modal.Content>
              <Modal.Header
                title="Подтверждение без контента"
                description="Когда нужен только заголовок и действия."
                closeAriaLabel="Закрыть"
              />
              <Modal.Footer>
                <Modal.Close>
                  <Button.Root size="m" variant="neutral" mode="stroke">
                    Отмена
                  </Button.Root>
                </Modal.Close>
                <Button.Root size="m" variant="primary">
                  Подтвердить
                </Button.Root>
              </Modal.Footer>
            </Modal.Content>
          </Modal.Overlay>
        </Modal.Portal>
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            Шапка и контент без футера
          </Button.Root>
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Overlay>
            <Modal.Content>
              <Modal.Header
                icon={<Icon name="nav.itemDot" />}
                title="Только информация"
                description="Футер не нужен, если нет явных действий."
                closeAriaLabel="Закрыть"
              />
              <Modal.Body>
                <p style={{ margin: 0 }}>Контент отделён от шапки и не прилипает к заголовку.</p>
              </Modal.Body>
            </Modal.Content>
          </Modal.Overlay>
        </Modal.Portal>
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            Только шапка (полный блок)
          </Button.Root>
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Overlay>
            <Modal.Content>
              <Modal.Header
                title="Короткое уведомление"
                description="Полный блок шапки: заголовок и описание, без контента и футера."
                closeAriaLabel="Закрыть"
              />
            </Modal.Content>
          </Modal.Overlay>
        </Modal.Portal>
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            Черновик доставки
          </Button.Root>
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Overlay>
            <Modal.Content>
              <Modal.Header
                icon={<Icon name="field.email" />}
                title="Контакт получателя"
                description="Заполните поле перед сохранением маршрута."
                closeAriaLabel="Закрыть"
              />
              <Modal.Body>
                <Input.Root label="Телефон курьера" size="m" hint="Формат: +7 и далее цифры">
                  <Input.Wrapper>
                    <Input.Field placeholder="+7 900 000-00-00" type="tel" />
                  </Input.Wrapper>
                </Input.Root>
              </Modal.Body>
              <Modal.Footer>
                <Modal.Close>
                  <Button.Root size="m" variant="neutral" mode="stroke">
                    Отмена
                  </Button.Root>
                </Modal.Close>
                <Button.Root size="m" variant="primary">
                  Сохранить
                </Button.Root>
              </Modal.Footer>
            </Modal.Content>
          </Modal.Overlay>
        </Modal.Portal>
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger>
          <LinkButton.Root href="#" onClick={(e) => e.preventDefault()}>
            Юридический текст
          </LinkButton.Root>
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Overlay>
            <Modal.Content>
              <Modal.Header
                title="Согласие на обработку данных"
                description={
                  <>
                    <code>Modal.Trigger</code> клонирует обработчик на единственного потомка — здесь
                    ссылка.
                  </>
                }
                closeAriaLabel="Закрыть"
              />
              <Modal.Body>
                <p>Краткий текст политики: данные используются только для оказания услуги.</p>
              </Modal.Body>
              <Modal.Footer>
                <Modal.Close>
                  <Button.Root size="m" variant="primary">
                    Принимаю
                  </Button.Root>
                </Modal.Close>
              </Modal.Footer>
            </Modal.Content>
          </Modal.Overlay>
        </Modal.Portal>
      </Modal.Root>
    </>
  );
}
