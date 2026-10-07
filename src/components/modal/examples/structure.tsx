/** Optional parts: an icon tile with a header-only notice, and a header with a footer but no body — `Modal.Icon`, `Modal.Body`, `Modal.Footer`. */
import { Button, Icon, Modal } from "prime-ui-kit";

export default function ModalStructureExample() {
  return (
    <>
      <Modal.Root>
        <Modal.Trigger>
          <Button.Root variant="soft" tone="neutral">
            Выгрузить отчёт
          </Button.Root>
        </Modal.Trigger>
        <Modal.Content size="s">
          <Modal.Header>
            <Modal.Icon tone="info">
              <Icon name="status.info" />
            </Modal.Icon>
            <Modal.Title>Отчёт готовится</Modal.Title>
            <Modal.Description>
              Пришлём письмо, когда файл можно будет скачать. Обычно это пара минут.
            </Modal.Description>
          </Modal.Header>
        </Modal.Content>
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger>
          <Button.Root variant="soft" tone="neutral">
            Опубликовать тариф
          </Button.Root>
        </Modal.Trigger>
        <Modal.Content size="s">
          <Modal.Header>
            <Modal.Title>Опубликовать «Бизнес 2026»?</Modal.Title>
            <Modal.Description>
              Новые клиенты увидят тариф сразу после публикации.
            </Modal.Description>
          </Modal.Header>
          <Modal.Footer>
            <Modal.Close>
              <Button.Root variant="outline" tone="neutral">
                Не сейчас
              </Button.Root>
            </Modal.Close>
            <Modal.Confirm>
              <Button.Root>Опубликовать</Button.Root>
            </Modal.Confirm>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
