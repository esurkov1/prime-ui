import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";

import { useDialogGuard } from "./DialogParts";

export type DialogGuardProps = {
  /**
   * A request runs: Escape, a press outside, a swipe, the close button and `Close` do nothing; the
   * close button and the `Close` child stay in place, disabled.
   */
  busy?: boolean;
  /**
   * Unsaved changes: any of those dismisses first asks «Не сохранять изменения?» (a ConfirmDialog
   * with the Root's `labels.discard*`); confirming closes the dialog.
   */
  dirty?: boolean;
};

/**
 * Holds a Modal or Drawer from inside its content, where the form state lives: put it anywhere in
 * `Content`. Renders nothing but the «discard changes?» confirm when it is asked. Closing from code
 * (`open={false}`) is never held.
 */
export function DialogGuard({ busy = false, dirty = false }: DialogGuardProps) {
  const { confirmingClose, setConfirmingClose, setOpen, discardLabels } = useDialogGuard({
    busy,
    dirty,
  });
  return (
    <ConfirmDialog.Root
      open={confirmingClose}
      onOpenChange={setConfirmingClose}
      title={discardLabels.discardTitle}
      description={discardLabels.discardDescription}
      confirmLabel={discardLabels.discardConfirm}
      labels={{ cancel: discardLabels.discardCancel }}
      onConfirm={() => setOpen(false)}
    />
  );
}
DialogGuard.displayName = "Dialog.Guard";
