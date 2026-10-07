import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useModalKeyboard } from "@/hooks/useModalKeyboard";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { type PresenceState, usePresence } from "@/hooks/usePresence";
import { useScrollLock } from "@/hooks/useScrollLock";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { OverlayPortalLayerProvider } from "@/internal/OverlayPortalLayerContext";
import overlayMotion from "@/internal/overlayMotion.module.css";
import { Portal } from "@/internal/Portal";
import type { ControlSize } from "@/internal/states";
import {
  DialogBody,
  DialogClose,
  DialogConfirm,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogIcon,
  DialogShellProvider,
  DialogTitle,
  DialogTrigger,
  type DialogTriggerProps,
  dialogShellClassName,
  useDialogShellValue,
} from "./DialogParts";
import styles from "./Modal.module.css";
import { useInertSiblings } from "./useInertSiblings";

export type {
  DialogBodyProps as ModalBodyProps,
  DialogCloseProps as ModalCloseProps,
  DialogConfirmProps as ModalConfirmProps,
  DialogDescriptionProps as ModalDescriptionProps,
  DialogFooterProps as ModalFooterProps,
  DialogHeaderProps as ModalHeaderProps,
  DialogIconProps as ModalIconProps,
  DialogTitleProps as ModalTitleProps,
  DialogTriggerProps as ModalTriggerProps,
} from "./DialogParts";

export type ModalLabels = {
  /** `aria-label` of the header close button. */
  close: string;
};

const MODAL_LABELS: ModalLabels = {
  close: "Закрыть",
};

type ModalContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  closeOnEscape: boolean;
  closeOnOutsideClick: boolean;
  confirmOnEnter: boolean;
  onEnterConfirm?: (event: KeyboardEvent) => void;
  labels: ModalLabels;
};

const [ModalProvider, useModalContext] = createComponentContext<ModalContextValue>("Modal");

// ─── Root ─────────────────────────────────────────────────────────────────────

export type ModalRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Escape closes the dialog. Default `true`. */
  closeOnEscape?: boolean;
  /**
   * A click on the scrim (any pointerdown outside the dialog) closes it. Default `true`; turn it
   * off for destructive confirms.
   */
  closeOnOutsideClick?: boolean;
  /** Enter clicks the action wrapped in `Modal.Confirm`. Default `true`. */
  confirmOnEnter?: boolean;
  /** Replaces the default Enter confirm (the `Modal.Confirm` click). */
  onEnterConfirm?: (event: KeyboardEvent) => void;
  labels?: Partial<ModalLabels>;
  children?: React.ReactNode;
};

function ModalRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  confirmOnEnter = true,
  onEnterConfirm,
  labels,
  children,
}: ModalRootProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const closeLabel = labels?.close ?? MODAL_LABELS.close;
  const value = React.useMemo<ModalContextValue>(
    () => ({
      open: isOpen,
      setOpen,
      closeOnEscape,
      closeOnOutsideClick,
      confirmOnEnter,
      onEnterConfirm,
      labels: { close: closeLabel },
    }),
    [
      isOpen,
      setOpen,
      closeOnEscape,
      closeOnOutsideClick,
      confirmOnEnter,
      onEnterConfirm,
      closeLabel,
    ],
  );

  return <ModalProvider value={value}>{children}</ModalProvider>;
}
ModalRoot.displayName = "Modal.Root";

// ─── Trigger ──────────────────────────────────────────────────────────────────

/** Opens the dialog on the child's click (unless the child prevents default). */
function ModalTrigger(props: DialogTriggerProps) {
  const { setOpen } = useModalContext();
  return <DialogTrigger {...props} onOpen={() => setOpen(true)} />;
}
ModalTrigger.displayName = "Modal.Trigger";

// ─── Content ──────────────────────────────────────────────────────────────────

export type ModalContentProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Dialog width: `s` 440 · `m` 560 · `l` 720 · `xl` 960. Below 640px of viewport the dialog is
   * always a full-width bottom sheet.
   */
  size?: Exclude<ControlSize, "xs">;
  /** Portal target. Default `document.body`. */
  container?: HTMLElement | null;
  /** Class on the full-screen scrim. */
  overlayClassName?: string;
};

function ModalContent({ container, ...props }: ModalContentProps) {
  const { open } = useModalContext();
  // Stays mounted with `data-state="closed"` while the exit animation plays.
  const presence = usePresence(open, { exitDuration: "base" });
  if (!presence.mounted) return null;
  return (
    <Portal container={container}>
      <ModalDialog {...props} state={presence.state} onExitEnd={presence.onExitEnd} />
    </Portal>
  );
}

type ModalDialogProps = Omit<ModalContentProps, "container"> & {
  state: PresenceState;
  onExitEnd: (event: React.SyntheticEvent<Element>) => void;
};

/** Mounted inside the portal so focus trap and inert siblings see the attached node. */
function ModalDialog({
  size = "m",
  overlayClassName,
  className,
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  state,
  onExitEnd,
  ...rest
}: ModalDialogProps) {
  const {
    open,
    setOpen,
    closeOnEscape,
    closeOnOutsideClick,
    confirmOnEnter,
    onEnterConfirm,
    labels,
  } = useModalContext();

  const confirmRef = React.useRef<HTMLElement | null>(null);
  const onClose = React.useCallback(() => setOpen(false), [setOpen]);

  const shell = useDialogShellValue({
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    onClose,
    closeLabel: labels.close,
    footerLayout: size === "s" || size === "m" ? "fill" : "end",
    confirmRef,
  });

  const trapRef = useFocusTrap<HTMLDivElement>({ enabled: open });
  useScrollLock(open);
  useInertSiblings(open, trapRef);
  // Scrim layer: the press must start and end outside the panel (no drag-to-close, no click-through).
  useOutsideClick({
    refs: [trapRef],
    enabled: open,
    trigger: "click",
    onOutsideClick: () => {
      if (closeOnOutsideClick) onClose();
    },
  });
  useModalKeyboard({
    open,
    trapRef,
    closeOnEscape,
    onClose,
    confirmOnEnter,
    onEnterConfirm,
    primaryRef: confirmRef,
  });

  return (
    // Scrim dismiss is a pointerdown outside the dialog (useOutsideClick), Escape via useModalKeyboard.
    <div
      role="presentation"
      className={cx(styles.overlay, overlayMotion.scrim, overlayClassName)}
      data-testid="modal-overlay"
      data-state={state}
      onAnimationEnd={onExitEnd}
    >
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cx(dialogShellClassName, styles.content, overlayMotion.dialog, className)}
        data-size={size}
        data-state={state}
        {...shell.aria}
        {...rest}
      >
        <DialogShellProvider value={shell.value}>
          <OverlayPortalLayerProvider value="modal">
            <ControlSizeProvider value="m">{children}</ControlSizeProvider>
          </OverlayPortalLayerProvider>
        </DialogShellProvider>
      </div>
    </div>
  );
}

ModalContent.displayName = "Modal.Content";

// ─── Public API ───────────────────────────────────────────────────────────────

export const Modal = {
  Root: ModalRoot,
  Trigger: ModalTrigger,
  Content: ModalContent,
  Header: DialogHeader,
  Icon: DialogIcon,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
  Close: DialogClose,
  Confirm: DialogConfirm,
};
