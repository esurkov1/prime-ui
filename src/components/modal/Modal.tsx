import * as React from "react";

import { useEnterConfirm } from "@/hooks/useEnterConfirm";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { type PresenceState, usePresence } from "@/hooks/usePresence";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { OverlayPortalLayerProvider } from "@/internal/OverlayPortalLayerContext";
import { LayerProvider } from "@/internal/overlay/layerStack";
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
  DialogRootProvider,
  DialogShellProvider,
  DialogTitle,
  DialogTrigger,
  dialogShellClassName,
  useDialogLayer,
  useDialogRoot,
  useDialogRootContext,
  useDialogShellValue,
} from "./DialogParts";
import styles from "./Modal.module.css";

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

// ─── Root ─────────────────────────────────────────────────────────────────────

export type ModalRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Escape closes the dialog. Default `true`. */
  closeOnEscape?: boolean;
  /** A click on the scrim closes the dialog. Default `true`; turn it off for destructive confirms. */
  closeOnOutsideClick?: boolean;
  /** Enter clicks the action wrapped in `Modal.Confirm`. Default `true`. */
  confirmOnEnter?: boolean;
  /** Replaces the default Enter confirm (the `Modal.Confirm` click). */
  onEnterConfirm?: (event: KeyboardEvent) => void;
  labels?: Partial<ModalLabels>;
  children?: React.ReactNode;
};

function ModalRoot({ confirmOnEnter = true, labels, children, ...options }: ModalRootProps) {
  const state = useDialogRoot({
    ...options,
    confirmOnEnter,
    closeLabel: labels?.close ?? MODAL_LABELS.close,
  });
  return <DialogRootProvider value={state}>{children}</DialogRootProvider>;
}
ModalRoot.displayName = "Modal.Root";

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
  /** The `role="dialog"` panel. */
  ref?: React.Ref<HTMLDivElement>;
};

function ModalContent({ container, ...props }: ModalContentProps) {
  const { open } = useDialogRootContext();
  // Stays mounted with `data-state="closed"` while the exit animation plays.
  const presence = usePresence(open, { exitDuration: "base" });
  if (!presence.mounted) return null;
  return (
    <Portal container={container}>
      <ModalDialog {...props} state={presence.state} onExitEnd={presence.onExitEnd} />
    </Portal>
  );
}
ModalContent.displayName = "Modal.Content";

type ModalDialogProps = Omit<ModalContentProps, "container"> & {
  state: PresenceState;
  onExitEnd: (event: React.SyntheticEvent<Element>) => void;
};

/** Mounted inside the portal so the modal layer sees the attached node. */
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
  ref,
  ...rest
}: ModalDialogProps) {
  const root = useDialogRootContext();
  const confirmRef = React.useRef<HTMLElement | null>(null);
  const { ref: layerRef, layer, onClose } = useDialogLayer<HTMLDivElement>(root);
  const panelRef = useMergedRefs(layerRef, ref);

  const shell = useDialogShellValue({
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    onClose,
    closeLabel: root.closeLabel,
    footerLayout: size === "s" || size === "m" ? "fill" : "end",
    confirmRef,
  });

  useEnterConfirm({
    enabled: root.open && root.confirmOnEnter,
    containerRef: layerRef,
    onEnterConfirm: root.onEnterConfirm,
    confirmRef,
  });

  return (
    <div
      role="presentation"
      className={cx(styles.overlay, overlayMotion.scrim, overlayClassName)}
      data-state={state}
      onAnimationEnd={onExitEnd}
    >
      <div
        ref={panelRef}
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
          <LayerProvider value={layer}>
            <OverlayPortalLayerProvider value="modal">
              <ControlSizeProvider value="m">{children}</ControlSizeProvider>
            </OverlayPortalLayerProvider>
          </LayerProvider>
        </DialogShellProvider>
      </div>
    </div>
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const Modal = {
  Root: ModalRoot,
  Trigger: DialogTrigger,
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
