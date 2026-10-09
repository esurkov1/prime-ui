import * as React from "react";

import { Banner } from "@/components/banner/Banner";
import { Button } from "@/components/button/Button";
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
} from "@/components/modal/DialogParts";
import { ModalContent, ModalRoot } from "@/components/modal/ModalDialog";
import { useControllableState } from "@/hooks/useControllableState";
import { Icon } from "@/icons";
import enterMotion from "@/internal/enterMotion.module.css";

export type ConfirmDialogLabels = {
  /** The cancel button. */
  cancel: string;
  /** `aria-label` of the header close button. */
  close: string;
  /** The message when `onConfirm` rejects and there is no `error`. */
  error: string;
};

const CONFIRM_DIALOG_LABELS: ConfirmDialogLabels = {
  cancel: "Отмена",
  close: "Закрыть",
  error: "Не получилось. Попробуйте ещё раз.",
};

export type ConfirmDialogRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The question, as a heading («Удалить проект?»). */
  title: React.ReactNode;
  /** What happens and what cannot be undone. */
  description?: React.ReactNode;
  /** The confirm button: the action as a verb («Удалить»), never «Да» / «ОК». */
  confirmLabel: React.ReactNode;
  /**
   * `danger` (default) — a destructive action, solid danger confirm; `accent` — a weighty but safe
   * one (send, publish), solid accent confirm.
   */
  tone?: "danger" | "accent";
  /**
   * The action. May return a Promise: while it runs the confirm button shows `loading`, Cancel,
   * the close button and Escape are off. Resolve — the dialog closes; reject — it stays open with
   * `error` (else `labels.error`) under the text, ready to try again.
   */
  onConfirm: () => unknown;
  /** Why the action failed, from the owner; shown while set. */
  error?: React.ReactNode;
  labels?: Partial<ConfirmDialogLabels>;
  /** `ConfirmDialog.Trigger`, or nothing when `open` is driven from code. */
  children?: React.ReactNode;
};

/**
 * The confirm of a destructive or weighty action in one piece: a small dialog (Modal `s`) with the
 * question, the consequence, Cancel and the confirm; no dismiss by a press outside; while the
 * action runs nothing closes it; a failure keeps it open with the reason.
 */
function ConfirmDialogRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  description,
  confirmLabel,
  tone = "danger",
  onConfirm,
  error,
  labels,
  children,
}: ConfirmDialogRootProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [pending, setPending] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  // Every opening starts clean.
  if (!isOpen && failed && !pending) setFailed(false);
  const text = { ...CONFIRM_DIALOG_LABELS, ...labels };

  const run = async () => {
    if (pending) return;
    setFailed(false);
    setPending(true);
    try {
      await onConfirm();
      setPending(false);
      setOpen(false);
    } catch {
      setPending(false);
      setFailed(true);
    }
  };

  const message = error ?? (failed ? text.error : null);

  return (
    <ModalRoot
      open={isOpen}
      onOpenChange={setOpen}
      closeOnOutsideClick={false}
      labels={{ close: text.close }}
    >
      {children}
      <ModalContent size="s" role="alertdialog">
        <ConfirmDialogBusy pending={pending} />
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        {message ? (
          <DialogBody>
            <Banner.Root tone="danger" size="s" role="alert" className={enterMotion.enter}>
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
              {text.cancel}
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
