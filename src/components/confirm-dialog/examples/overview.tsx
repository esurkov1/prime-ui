/** Deleting a project: the danger confirm runs the request with a spinner and nothing closes the dialog until it ends — `ConfirmDialog.Trigger`, `onConfirm`. */
import { Button, ConfirmDialog } from "prime-ui-kit";

/** Pretends to delete the project on the server. */
function deleteProject() {
  return new Promise((resolve) => setTimeout(resolve, 1200));
}

export default function ConfirmDialogOverviewExample() {
  return (
    <ConfirmDialog.Root
      title="Удалить проект «Запуск в регионах»?"
      description="Проект, его задачи и файлы удалятся без возможности восстановления."
      confirmLabel="Удалить проект"
      onConfirm={deleteProject}
    >
      <ConfirmDialog.Trigger>
        <Button.Root variant="soft" tone="danger">
          Удалить проект
        </Button.Root>
      </ConfirmDialog.Trigger>
    </ConfirmDialog.Root>
  );
}
