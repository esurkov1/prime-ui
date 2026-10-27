/** A setting that applies on the server at once: the picked option stands while the save runs, and a refused save puts the previous one back and says why — `onValueChange`, `error`. */
import { Radio } from "prime-ui-kit";
import * as React from "react";

/** The server's answer a beat later: invoices through EDI need a connected operator. */
function saveInvoiceDelivery(channel: string) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (channel === "edi") reject(new Error("Сначала подключите оператора ЭДО в «Интеграциях»"));
      else resolve();
    }, 900);
  });
}

export default function RadioSavingExample() {
  const [channel, setChannel] = React.useState("email");
  const [error, setError] = React.useState<string>();

  return (
    <Radio.Group
      label="Отправка счетов клиентам"
      value={channel}
      error={error}
      onValueChange={async (next) => {
        setError(undefined);
        try {
          await saveInvoiceDelivery(next);
        } catch (failure) {
          setError(failure instanceof Error ? failure.message : String(failure));
          throw failure;
        }
        setChannel(next);
      }}
    >
      <Radio.Root value="email" hint="PDF на адрес из карточки клиента">
        <Radio.Label>Электронная почта</Radio.Label>
      </Radio.Root>
      <Radio.Root value="edi" hint="Юридически значимый документооборот">
        <Radio.Label>ЭДО</Radio.Label>
      </Radio.Root>
      <Radio.Root value="manual">
        <Radio.Label>Вручную</Radio.Label>
      </Radio.Root>
    </Radio.Group>
  );
}
