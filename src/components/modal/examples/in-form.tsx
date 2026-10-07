/** A settings form in a dialog: the footer button submits the form and an empty name keeps it open — `Modal.Body`, `Modal.Footer`, `error`. */
import { Button, Icon, Input, Modal, Select, Switch } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function ModalInFormExample() {
  const formId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string>();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name") ?? "").trim();
    if (!name) {
      setError("Введите название проекта");
      return;
    }
    setOpen(false);
  };

  return (
    <Modal.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setError(undefined);
      }}
    >
      <Modal.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Настройки проекта
        </Button.Root>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Icon>
            <Icon name="nav.layoutGrid" />
          </Modal.Icon>
          <Modal.Title>Настройки проекта</Modal.Title>
          <Modal.Description>Изменения увидят все участники команды.</Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <form id={formId} className={styles.form} noValidate onSubmit={submit}>
            <Input.Root label="Название" required error={error} reserveSupportRow>
              <Input.Wrapper>
                <Input.Field name="name" defaultValue="Сайт компании" autoFocus />
              </Input.Wrapper>
            </Input.Root>
            <Select.Root label="Ответственный" defaultValue="anna">
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="anna">Анна Смирнова</Select.Item>
                <Select.Item value="igor">Игорь Петров</Select.Item>
                <Select.Item value="olga">Ольга Ким</Select.Item>
              </Select.Content>
            </Select.Root>
            <Switch.Root name="notify" defaultChecked>
              <Switch.Label>Уведомлять участников об изменениях</Switch.Label>
            </Switch.Root>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button.Root variant="outline" tone="neutral">
              Отмена
            </Button.Root>
          </Modal.Close>
          <Button.Root type="submit" form={formId}>
            Сохранить
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
