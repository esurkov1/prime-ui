/** Enter in a dialog: handing a workspace over takes a click, never Enter in its field; in the tags dialog Enter adds the typed tag instead of closing — `confirmOnEnter`, `onEnterConfirm`. */
import { Badge, Button, Input, Modal } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const WORKSPACE = "Отдел продаж";
const INITIAL_TAGS = ["VIP", "Опт"];

export default function ModalEnterKeyExample() {
  const [transferOpen, setTransferOpen] = React.useState(false);
  const [owner, setOwner] = React.useState("");
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
        open={transferOpen}
        onOpenChange={(next) => {
          setTransferOpen(next);
          setOwner("");
        }}
        confirmOnEnter={false}
        closeOnOutsideClick={false}
      >
        <Modal.Trigger>
          <Button.Root variant="soft" tone="neutral">
            Передать пространство
          </Button.Root>
        </Modal.Trigger>
        <Modal.Content size="s">
          <Modal.Header>
            <Modal.Title>Передать «{WORKSPACE}»?</Modal.Title>
            <Modal.Description>
              Новый владелец получит сделки, клиентов и счета; вы останетесь участником.
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            <Input.Root label="Почта нового владельца">
              <Input.Wrapper>
                <Input.Field
                  type="email"
                  value={owner}
                  onValueChange={setOwner}
                  autoComplete="off"
                />
              </Input.Wrapper>
            </Input.Root>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>
              <Button.Root variant="soft" tone="neutral">
                Отмена
              </Button.Root>
            </Modal.Close>
            {/* The confirm button is a click target only: `confirmOnEnter={false}` keeps Enter off it. */}
            <Modal.Confirm>
              <Button.Root disabled={!owner.includes("@")} onClick={() => setTransferOpen(false)}>
                Передать
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
            <Input.Root label="Новый тег" hint="Enter добавляет тег сразу">
              <Input.Wrapper>
                <Input.Field value={draft} onValueChange={setDraft} placeholder="Партнёр" />
              </Input.Wrapper>
            </Input.Root>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>
              <Button.Root>Готово</Button.Root>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
