/** Enter in a dialog: deleting a workspace takes a click, never Enter in its field; in the tags dialog Enter adds the typed tag instead of saving — `confirmOnEnter`, `onEnterConfirm`. */
import { Badge, Button, Input, Modal } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const WORKSPACE = "Отдел продаж";
const INITIAL_TAGS = ["VIP", "Опт"];

export default function ModalEnterKeyExample() {
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [typed, setTyped] = React.useState("");
  const [tags, setTags] = React.useState(INITIAL_TAGS);
  const [draft, setDraft] = React.useState("");

  const addTag = () => {
    const tag = draft.trim();
    if (tag && !tags.includes(tag)) setTags([...tags, tag]);
    setDraft("");
  };

  return (
    <>
      <Modal.Root
        open={deleteOpen}
        onOpenChange={(next) => {
          setDeleteOpen(next);
          setTyped("");
        }}
        confirmOnEnter={false}
        closeOnOutsideClick={false}
      >
        <Modal.Trigger>
          <Button.Root variant="outline" tone="danger">
            Удалить пространство
          </Button.Root>
        </Modal.Trigger>
        <Modal.Content size="s">
          <Modal.Header>
            <Modal.Title>Удалить «{WORKSPACE}»?</Modal.Title>
            <Modal.Description>
              Сделки, клиенты и счета пространства удалятся без возможности восстановления.
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <Input.Root label={`Введите «${WORKSPACE}», чтобы подтвердить`}>
              <Input.Wrapper>
                <Input.Field value={typed} onValueChange={setTyped} autoComplete="off" />
              </Input.Wrapper>
            </Input.Root>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>
              <Button.Root variant="outline" tone="neutral">
                Отмена
              </Button.Root>
            </Modal.Close>
            {/* The confirm button is a click target only: `confirmOnEnter={false}` keeps Enter off it. */}
            <Modal.Confirm>
              <Button.Root
                tone="danger"
                disabled={typed !== WORKSPACE}
                onClick={() => setDeleteOpen(false)}
              >
                Удалить
              </Button.Root>
            </Modal.Confirm>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>

      <Modal.Root
        onOpenChange={() => setDraft("")}
        onEnterConfirm={(event) => {
          event.preventDefault();
          addTag();
        }}
      >
        <Modal.Trigger>
          <Button.Root variant="soft" tone="neutral">
            Теги клиента
          </Button.Root>
        </Modal.Trigger>
        <Modal.Content size="s">
          <Modal.Header>
            <Modal.Title>Теги клиента</Modal.Title>
            <Modal.Description>ООО «Северный ветер»</Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <div className={styles.tags}>
              {tags.map((tag) => (
                <Badge.Root key={tag} color="blue">
                  {tag}
                </Badge.Root>
              ))}
            </div>
            <Input.Root label="Новый тег" hint="Enter добавляет тег">
              <Input.Wrapper>
                <Input.Field value={draft} onValueChange={setDraft} placeholder="Партнёр" />
              </Input.Wrapper>
            </Input.Root>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>
              <Button.Root variant="outline" tone="neutral">
                Отмена
              </Button.Root>
            </Modal.Close>
            <Modal.Close>
              <Button.Root>Сохранить</Button.Root>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
