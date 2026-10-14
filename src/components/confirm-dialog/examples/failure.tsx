/** The server refuses: the dialog stays open with the reason of the rejection under the text and the confirm ready to try again — `onConfirm`. */
import { Button, ConfirmDialog } from "prime-ui-kit";

/** Pretends the server refuses: the tag is still in use. */
function deleteTag() {
  return new Promise((_, reject) =>
    setTimeout(
      () =>
        reject(new Error("Тег используется в 12 активных сделках — сначала снимите его с них.")),
      900,
    ),
  );
}

export default function ConfirmDialogFailureExample() {
  return (
    <ConfirmDialog.Root
      title="Удалить тег «VIP»?"
      description="Тег снимется со всех клиентов."
      confirmLabel="Удалить тег"
      onConfirm={deleteTag}
    >
      <ConfirmDialog.Trigger>
        <Button.Root variant="soft" tone="danger">
          Удалить тег
        </Button.Root>
      </ConfirmDialog.Trigger>
    </ConfirmDialog.Root>
  );
}
