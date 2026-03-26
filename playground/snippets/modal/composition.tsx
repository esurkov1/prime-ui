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
        Один компонент <code>Modal.Panel</code>: проп <code>title</code>, опционально <code>description</code>,{" "}
        <code>children</code> (тело), <code>footer</code>.
      </p>

      <Modal.Root>
        <Modal.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            Только шапка и футер
          </Button.Root>
        </Modal.Trigger>
        <Modal.Panel
          description="Когда нужен только заголовок и действия."
          footer={
            <>
              <Modal.Close>
                <Button.Root size="m" variant="neutral" mode="stroke">
                  Отмена
                </Button.Root>
              </Modal.Close>
              <Button.Root size="m" variant="primary">
                Подтвердить
              </Button.Root>
            </>
          }
          title="Подтверждение без контента"
        />
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            Шапка и контент без футера
          </Button.Root>
        </Modal.Trigger>
        <Modal.Panel
          description="Футер не нужен, если нет явных действий."
          icon={<Icon name="nav.itemDot" />}
          title="Только информация"
        >
          <p style={{ margin: 0 }}>Контент отделён от шапки и не прилипает к заголовку.</p>
        </Modal.Panel>
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            Только шапка (полный блок)
          </Button.Root>
        </Modal.Trigger>
        <Modal.Panel
          description="Полный блок шапки: заголовок и описание, без контента и футера."
          title="Короткое уведомление"
        />
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            Черновик доставки
          </Button.Root>
        </Modal.Trigger>
        <Modal.Panel
          description="Заполните поле перед сохранением маршрута."
          footer={
            <>
              <Modal.Close>
                <Button.Root size="m" variant="neutral" mode="stroke">
                  Отмена
                </Button.Root>
              </Modal.Close>
              <Button.Root size="m" variant="primary">
                Сохранить
              </Button.Root>
            </>
          }
          icon={<Icon name="field.email" />}
          title="Контакт получателя"
        >
          <Input.Root label="Телефон курьера" size="m" hint="Формат: +7 и далее цифры">
            <Input.Wrapper>
              <Input.Field placeholder="+7 900 000-00-00" type="tel" />
            </Input.Wrapper>
          </Input.Root>
        </Modal.Panel>
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger>
          <LinkButton.Root href="#" onClick={(e) => e.preventDefault()}>
            Юридический текст
          </LinkButton.Root>
        </Modal.Trigger>
        <Modal.Panel
          description={
            <>
              <code>Modal.Trigger</code> клонирует обработчик на единственного потомка — здесь ссылка.
            </>
          }
          footer={
            <Modal.Close>
              <Button.Root size="m" variant="primary">
                Принимаю
              </Button.Root>
            </Modal.Close>
          }
          title="Согласие на обработку данных"
        >
          <p>Краткий текст политики: данные используются только для оказания услуги.</p>
        </Modal.Panel>
      </Modal.Root>
    </>
  );
}
