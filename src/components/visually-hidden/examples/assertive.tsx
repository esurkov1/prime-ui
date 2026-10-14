/** A failed save shown by a badge on screen and announced at once, interrupting the screen reader — `live`. */
import { Badge, Button, VisuallyHidden } from "prime-ui-kit";
import * as React from "react";

/** The server refusing the save a beat later. */
const saveInvoice = () =>
  new Promise<void>((_, reject) => setTimeout(() => reject(new Error("offline")), 700));

export default function VisuallyHiddenAssertiveExample() {
  const [saving, setSaving] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  const save = async () => {
    setSaving(true);
    setFailed(false);
    try {
      await saveInvoice();
    } catch {
      setFailed(true);
    }
    setSaving(false);
  };

  return (
    <>
      <Button.Root loading={saving} onClick={save}>
        Сохранить счёт
      </Button.Root>
      {failed ? (
        <Badge.Root color="red" aria-hidden="true">
          Не сохранено
        </Badge.Root>
      ) : null}
      <VisuallyHidden live="assertive">
        {failed ? "Счёт не сохранён: нет связи с сервером. Повторите попытку." : ""}
      </VisuallyHidden>
    </>
  );
}
