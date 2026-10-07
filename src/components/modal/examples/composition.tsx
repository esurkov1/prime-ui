/** Settings form in a dialog: fields with an inline error that does not shift layout, a labelled Select and a Switch; Enter saves through Modal.Confirm. Use for short edit forms. */
import { Settings } from "lucide-react";
import { Button, Input, Label, Modal, Select, Switch } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function ModalCompositionExample() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("Сайт компании");
  const [touched, setTouched] = React.useState(false);
  const ownerId = React.useId();
  const error = touched && name.trim() === "" ? "Введите название проекта" : undefined;

  const save = () => {
    setTouched(true);
    if (name.trim() !== "") setOpen(false);
  };

  return (
    <Modal.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setTouched(false);
      }}
    >
      <Modal.Trigger>
        <Button.Root variant="soft" tone="neutral">
          <Button.Icon>
            <Settings />
          </Button.Icon>
          Настройки проекта
        </Button.Root>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Icon>
            <Settings />
          </Modal.Icon>
          <Modal.Title>Настройки проекта</Modal.Title>
          <Modal.Description>Изменения увидят все участники команды.</Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.form}>
            <Input.Root label="Название" required error={error} reserveSupportRow>
              <Input.Wrapper>
                <Input.Field
                  autoFocus
                  placeholder="Например, «Мобильное приложение»"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </Input.Wrapper>
            </Input.Root>
            <div className={styles.field}>
              <Label.Root id={ownerId}>Ответственный</Label.Root>
              <Select.Root defaultValue="anna">
                <Select.Trigger aria-labelledby={ownerId}>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="anna">Анна Смирнова</Select.Item>
                  <Select.Item value="igor">Игорь Петров</Select.Item>
                  <Select.Item value="olga">Ольга Ким</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
            <Switch.Root defaultChecked>
              <Switch.Label>Уведомлять участников об изменениях</Switch.Label>
            </Switch.Root>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button.Root variant="outline" tone="neutral">
              Отмена
            </Button.Root>
          </Modal.Close>
          <Modal.Confirm>
            <Button.Root onClick={save}>Сохранить</Button.Root>
          </Modal.Confirm>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
