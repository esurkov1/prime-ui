import * as React from "react";

import { Banner } from "@/components/banner/Banner";
import { Button } from "@/components/button/Button";
import { Icon } from "@/icons";
import { useLabels } from "@/internal/labels";
import {
  DialogBody,
  DialogClose,
  DialogConfirm,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type DialogTriggerProps,
  useDialogGuard,
} from "@/internal/overlay/DialogParts";
import { ModalContent, ModalRoot } from "@/internal/overlay/ModalDialog";
import { useOpenState } from "@/internal/overlay/useOpenState";
import { usePartPresence } from "@/internal/partPresence";

export type ConfirmDialogLabels = {
  /** The cancel button. */
  cancel: string;
  /** `aria-label` of the header close button. */
  close: string;
  /** The message when `onConfirm` rejects without a reason of its own. */
  error: string;
};

export const CONFIRM_DIALOG_LABELS: ConfirmDialogLabels = {
  cancel: "Отмена",
  close: "Закрыть",
  error: "Не получилось. Попробуйте ещё раз.",
};

export type ConfirmDialogRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel: React.ReactNode;
  tone?: "danger" | "accent";
  onConfirm: () => unknown;
  labels?: Partial<ConfirmDialogLabels>;
  children?: React.ReactNode;
};

/** What a rejection says: an `Error`'s message or a string; nothing else is shown to a person. */
function reasonOf(rejection: unknown): string | null {
  if (rejection instanceof Error && rejection.message) return rejection.message;
  if (typeof rejection === "string" && rejection) return rejection;
  return null;
}

/**
 * The confirm of a destructive or weighty action in one piece: a small dialog (Modal `s`) with the
 * question, the consequence, Cancel and the confirm; no dismiss by a press outside unless asked;
 * while the action runs nothing closes it; a failure keeps it open with the reason.
 */
function ConfirmDialogRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnEscape = true,
  closeOnOutsideClick = false,
  title,
  description,
  confirmLabel,
  tone = "danger",
  onConfirm,
  labels: labelsProp,
  children,
}: ConfirmDialogRootProps) {
  const [isOpen, setOpen] = useOpenState({ open, defaultOpen, onOpenChange });
  const labels = useLabels(CONFIRM_DIALOG_LABELS, labelsProp);
  const [pending, setPending] = React.useState(false);
  /** Why the last try failed; `""` — it failed without a reason of its own. */
  const [failure, setFailure] = React.useState<string | null>(null);
  // Every opening starts clean.
  if (!isOpen && failure !== null && !pending) setFailure(null);

  const run = async () => {
    if (pending) return;
    setFailure(null);
    setPending(true);
    try {
      await onConfirm();
      setPending(false);
      setOpen(false);
    } catch (rejection) {
      setPending(false);
      setFailure(reasonOf(rejection) ?? "");
    }
  };

  const message = failure === null ? null : failure || labels.error;
  // The failure zone rises in when a try fails and closes up in place when the next one starts.
  const errorZone = usePartPresence<HTMLDivElement>({ present: message !== null, axis: "block" });

  return (
    <ModalRoot
      open={isOpen}
      onOpenChange={setOpen}
      closeOnEscape={closeOnEscape}
      closeOnOutsideClick={closeOnOutsideClick}
      labels={{ close: labels.close }}
    >
      {children}
      <ModalContent size="s" role="alertdialog">
        <ConfirmDialogBusy pending={pending} />
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        {message ? (
          <DialogBody ref={errorZone.ref} className={errorZone.className}>
            <Banner.Root tone="danger" size="s" role="alert">
              <Banner.Content>
                <Banner.Icon>
                  <Icon name="status.danger" />
                </Banner.Icon>
                <Banner.Description>{message}</Banner.Description>
              </Banner.Content>
            </Banner.Root>
          </DialogBody>
        ) : null}
        <DialogFooter>
          <DialogClose>
            {/* The least destructive choice takes focus first. */}
            <Button.Root variant="soft" tone="neutral" data-autofocus="">
              {labels.cancel}
            </Button.Root>
          </DialogClose>
          <DialogConfirm>
            <Button.Root tone={tone} loading={pending} onClick={run}>
              {confirmLabel}
            </Button.Root>
          </DialogConfirm>
        </DialogFooter>
      </ModalContent>
    </ModalRoot>
  );
}
ConfirmDialogRoot.displayName = "ConfirmDialog.Root";

/** Holds the dialog open while the action runs (the dialog guard from inside the content). */
function ConfirmDialogBusy({ pending }: { pending: boolean }) {
  useDialogGuard({ busy: pending, dirty: false });
  return null;
}

export type ConfirmDialogTriggerProps = DialogTriggerProps;

/** Wraps one element (the action's button); its click opens the dialog. */
function ConfirmDialogTrigger(props: ConfirmDialogTriggerProps) {
  return <DialogTrigger {...props} />;
}
ConfirmDialogTrigger.displayName = "ConfirmDialog.Trigger";

export const ConfirmDialog = {
  Root: ConfirmDialogRoot,
  Trigger: ConfirmDialogTrigger,
};
