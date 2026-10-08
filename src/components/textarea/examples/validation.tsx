/** Live validation: an error shakes the field as it arrives, drops in and leaves as soon as the text is fixed; required and optional markers, a hint and a support row that does not shift — `required`, `optional`, `hint`, `error`, `reserveSupportRow`. */
import { Button, Textarea } from "prime-ui-kit";
import * as React from "react";

const MIN_REASON = 20;

export default function TextareaValidationExample() {
  const [reason, setReason] = React.useState("Нет");
  const [comment, setComment] = React.useState("Оплата частями");
  const [commentError, setCommentError] = React.useState<string>();

  const send = () => setCommentError(/\d{3,}/.test(comment) ? undefined : "Укажите номер договора");

  return (
    <>
      <Textarea.Root
        label="Описание задачи"
        required
        defaultValue="Подготовить акт сверки с поставщиком за третий квартал."
        hint="Исполнитель увидит его в карточке задачи"
      />
      <Textarea.Root
        label="Причина отказа"
        required
        value={reason}
        onValueChange={setReason}
        hint="Клиент получит её в письме"
        error={
          reason.trim().length < MIN_REASON
            ? `Опишите причину хотя бы в ${MIN_REASON} символах`
            : undefined
        }
      />
      <Textarea.Root
        label="Комментарий для бухгалтерии"
        optional
        reserveSupportRow
        value={comment}
        onValueChange={(value) => {
          setComment(value);
          setCommentError(undefined);
        }}
        error={commentError}
      />
      <Button.Root variant="soft" tone="neutral" onClick={send}>
        Отправить в бухгалтерию
      </Button.Root>
    </>
  );
}
