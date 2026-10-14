/** Answering a client's message and correcting your own: the bar above the field quotes the message, Escape or the cross cancels, ↑ in an empty field opens your last message, send becomes save and hands over the message id — `Composer.Context`, `mode`, `messageId`, `onDismiss`, `onEditLast`. */
import { Button, Composer, type ComposerMessage, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const CLIENT_MESSAGE = "Пришлите, пожалуйста, акт сверки за третий квартал";
const LAST_OWN_MESSAGE = "Акт будет готов к пятнице";
const CLIENT_MESSAGE_ID = "msg-2041";
const LAST_OWN_MESSAGE_ID = "msg-2044";

type Mode = { kind: "reply" } | { kind: "edit" } | null;

export default function ComposerReplyEditExample() {
  const [mode, setMode] = React.useState<Mode>({ kind: "reply" });
  const [text, setText] = React.useState("");
  const [sent, setSent] = React.useState("");

  const dismiss = () => {
    if (mode?.kind === "edit") setText("");
    setMode(null);
  };

  const send = ({ replyTo, editOf }: ComposerMessage) => {
    if (editOf) setSent(`Сообщение ${editOf} сохранено`);
    else if (replyTo) setSent(`Ответ на ${replyTo} отправлен`);
    else setSent("Сообщение отправлено");
  };

  return (
    <div className={styles.chat}>
      {mode === null ? (
        <div>
          <Button.Root variant="soft" tone="neutral" onClick={() => setMode({ kind: "reply" })}>
            Ответить Анне
          </Button.Root>
        </div>
      ) : null}
      <Composer.Root
        value={text}
        onValueChange={setText}
        onSend={send}
        onEditLast={() => {
          setMode({ kind: "edit" });
          setText(LAST_OWN_MESSAGE);
        }}
      >
        {mode?.kind === "reply" ? (
          <Composer.Context messageId={CLIENT_MESSAGE_ID} onDismiss={dismiss}>
            <Composer.Title>Ответ Анне Соколовой</Composer.Title>
            <Composer.Description>{CLIENT_MESSAGE}</Composer.Description>
          </Composer.Context>
        ) : null}
        {mode?.kind === "edit" ? (
          <Composer.Context mode="edit" messageId={LAST_OWN_MESSAGE_ID} onDismiss={dismiss}>
            <Composer.Title>Редактирование</Composer.Title>
            <Composer.Description>{LAST_OWN_MESSAGE}</Composer.Description>
          </Composer.Context>
        ) : null}
      </Composer.Root>
      {sent ? (
        <Typography as="p" variant="body-s" tone="secondary" role="status">
          {sent}
        </Typography>
      ) : null}
    </div>
  );
}
