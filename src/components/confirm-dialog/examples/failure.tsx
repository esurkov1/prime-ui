/** The server refuses: the dialog stays open with the owner's reason under the text and the confirm ready to try again — `error`, `onConfirm`. */
import { Button, ConfirmDialog } from "prime-ui-kit";
import * as React from "react";

/** Pretends the server refuses: the tag is still in use. */
function deleteTag() {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("in use")), 900));
}

export default function ConfirmDialogFailureExample() {
  const [error, setError] = React.useState<string>();

  return (
    <ConfirmDialog.Root
      title="Удалить тег «VIP»?"
      description="Тег снимется со всех клиентов."
      confirmLabel="Удалить тег"
      error={error}
      onOpenChange={() => setError(undefined)}
      onConfirm={async () => {
        setError(undefined);
        try {
          await deleteTag();
        } catch (reason) {
          setError("Тег используется в 12 активных сделках — сначала снимите его с них.");
          throw reason;
        }
      }}
    >
      <ConfirmDialog.Trigger>
        <Button.Root variant="soft" tone="danger">
          Удалить тег
        </Button.Root>
      </ConfirmDialog.Trigger>
    </ConfirmDialog.Root>
  );
}
