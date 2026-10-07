/** A trigger opens a dialog with a title, a field and two actions; Enter presses the confirm — `Modal.Trigger`, `Modal.Confirm`. */
import { Button, Input, Modal } from "prime-ui-kit";

export default function ModalOverviewExample() {
  return (
    <Modal.Root>
      <Modal.Trigger>
        <Button.Root>Пригласить участника</Button.Root>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Пригласить в проект</Modal.Title>
          <Modal.Description>Отправим приглашение на рабочую почту.</Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <Input.Root label="Рабочая почта">
            <Input.Wrapper>
              <Input.Field type="email" placeholder="name@company.ru" autoFocus />
            </Input.Wrapper>
          </Input.Root>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button.Root variant="outline" tone="neutral">
              Отмена
            </Button.Root>
          </Modal.Close>
          <Modal.Confirm>
            <Button.Root>Пригласить</Button.Root>
          </Modal.Confirm>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
