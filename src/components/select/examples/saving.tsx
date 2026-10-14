/** A choice that saves on the server at once: the picked value shows with a spinner on the trigger, and a refused save rolls it back and says why — `onValueChange`, `error`. */
import { Select } from "prime-ui-kit";
import * as React from "react";

/** The server's answer a beat later: an invoice cannot go back to a draft once it is sent. */
function saveStatus(status: string) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (status === "draft") reject(new Error("Отправленный счёт нельзя вернуть в черновик"));
      else resolve();
    }, 900);
  });
}

export default function SelectSavingExample() {
  const [status, setStatus] = React.useState("sent");
  const [error, setError] = React.useState<string>();

  return (
    <Select.Root
      label="Статус счёта № 2048"
      value={status}
      error={error}
      hint="Сохраняется сразу"
      onValueChange={async (next) => {
        setError(undefined);
        try {
          await saveStatus(next);
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : String(reason));
          throw reason;
        }
        setStatus(next);
      }}
    >
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="draft">Черновик</Select.Item>
        <Select.Item value="sent">Отправлен</Select.Item>
        <Select.Item value="paid">Оплачен</Select.Item>
        <Select.Item value="cancelled">Отменён</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
