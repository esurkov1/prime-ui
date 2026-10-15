import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { useUnloadGuard } from "@/internal/leaveGuard";

import { useDialogGuard } from "./DialogParts";

export type DialogGuardProps = {
  busy?: boolean;
  dirty?: boolean;
};

/**
 * Holds a Modal, Drawer or Sheet from inside its content, where the form state lives: put it anywhere in
 * `Content`. Renders nothing but the «discard changes?» confirm when it is asked. While `busy` or
 * `dirty` the browser also asks before the tab closes or reloads, as `Page.Guard` does. Closing from
 * code (`open={false}`) is never held.
 */
export function DialogGuard({ busy = false, dirty = false }: DialogGuardProps) {
  const { confirmingClose, setConfirmingClose, setOpen, labels } = useDialogGuard({
    busy,
    dirty,
  });
  useUnloadGuard(busy || dirty);
  return (
    <ConfirmDialog.Root
      open={confirmingClose}
      onOpenChange={setConfirmingClose}
      title={labels.discardTitle}
      description={labels.discardDescription}
      confirmLabel={labels.discardConfirm}
      labels={{ cancel: labels.discardCancel }}
      onConfirm={() => setOpen(false)}
    />
  );
}
DialogGuard.displayName = "Dialog.Guard";
