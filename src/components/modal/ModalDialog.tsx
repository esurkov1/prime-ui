import * as React from "react";
import { COMPACT_QUERY } from "@/hooks/breakpoints";
import { useEnterConfirm } from "@/hooks/useEnterConfirm";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { type PresenceState, usePresence } from "@/hooks/usePresence";
import { useSwipeDismiss } from "@/hooks/useSwipeDismiss";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { LayerProvider } from "@/internal/overlay/layerStack";
import overlayMotion from "@/internal/overlayMotion.module.css";
import { Portal } from "@/internal/Portal";
import sheet from "@/internal/sheet.module.css";
import type { ControlSize } from "@/internal/states";
import { SurfaceDepthProvider } from "@/internal/surfaceDepth";
import {
  DIALOG_DISCARD_LABELS,
  type DialogDiscardLabels,
  DialogRootProvider,
  DialogShellProvider,
  dialogShellClassName,
  useDialogLayer,
  useDialogRoot,
  useDialogRootContext,
  useDialogShellValue,
  useExitSnapshot,
} from "./DialogParts";
import styles from "./Modal.module.css";

/*
 * Root and Content of Modal, apart from the public `Modal` object (Modal.tsx): ConfirmDialog is
 * built from them, and `Modal.Guard` is built from ConfirmDialog.
 */

export type ModalLabels = DialogDiscardLabels & {
  /** `aria-label` of the header close button. */
  close: string;
};

const MODAL_LABELS: ModalLabels = {
  close: "Закрыть",
  ...DIALOG_DISCARD_LABELS,
};

// ─── Root ─────────────────────────────────────────────────────────────────────

export type ModalRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Escape closes the dialog. Default `true`. */
  closeOnEscape?: boolean;
  /**
   * A click on the scrim (or, on a narrow viewport, a swipe down) closes the dialog. Default
   * `true`; turn it off for destructive confirms.
   */
  closeOnOutsideClick?: boolean;
  /** Enter clicks the action wrapped in `Modal.Confirm`. Default `true`. */
  confirmOnEnter?: boolean;
  /** Replaces the default Enter confirm (the `Modal.Confirm` click). */
  onEnterConfirm?: (event: KeyboardEvent) => void;
  labels?: Partial<ModalLabels>;
  children?: React.ReactNode;
};

export function ModalRoot({ confirmOnEnter = true, labels, children, ...options }: ModalRootProps) {
  const { close, discardTitle, discardDescription, discardConfirm, discardCancel } = {
    ...MODAL_LABELS,
    ...labels,
  };
  const discardLabels = React.useMemo(
    () => ({ discardTitle, discardDescription, discardConfirm, discardCancel }),
    [discardTitle, discardDescription, discardConfirm, discardCancel],
  );
  const state = useDialogRoot({
    ...options,
    confirmOnEnter,
    closeLabel: close,
    discardLabels,
  });
  return <DialogRootProvider value={state}>{children}</DialogRootProvider>;
}
ModalRoot.displayName = "Modal.Root";

// ─── Content ──────────────────────────────────────────────────────────────────

export type ModalContentProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Dialog width: `xs` 360 · `s` 440 · `m` 560 · `l` 720 · `xl` 960. Below 640px of viewport the
   * dialog is always a full-width bottom sheet with a grab handle.
   */
  size?: ControlSize;
  /** Portal target. Default `document.body`. */
  container?: HTMLElement | null;
  /** Class on the full-screen scrim. */
  overlayClassName?: string;
  /** The `role="dialog"` panel. */
  ref?: React.Ref<HTMLDivElement>;
};

export function ModalContent({ container, children, ...props }: ModalContentProps) {
  const { open } = useDialogRootContext();
  // Stays mounted with `data-state="closed"` while the exit animation plays, showing what it
  // showed open.
  const presence = usePresence(open, { exitDuration: "base" });
  const shown = useExitSnapshot(open, children);
  if (!presence.mounted) return null;
  return (
    <Portal container={container}>
      <ModalDialog {...props} state={presence.state} onExitEnd={presence.onExitEnd}>
        {shown}
      </ModalDialog>
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
  onPointerDown,
  ref,
  ...rest
}: ModalDialogProps) {
  const root = useDialogRootContext();
  const confirmRef = React.useRef<HTMLElement | null>(null);
  const { ref: layerRef, layer, onClose } = useDialogLayer<HTMLDivElement>(root);
  const panelRef = useMergedRefs(layerRef, ref);
  // Below 640px the dialog is a bottom sheet: it gets a handle and closes with a swipe down,
  // a dismiss from outside the content like a scrim click.
  const compact = useMediaQuery(COMPACT_QUERY);
  const swipe = useSwipeDismiss({
    // A guarded dialog does not slide away: busy ignores the dismiss, dirty asks first.
    enabled: compact && root.closeOnOutsideClick && state === "open" && !root.busy && !root.dirty,
    onDismiss: onClose,
    handle: "[data-swipe-handle], header",
  });

  const shell = useDialogShellValue({
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    onClose,
    closeLabel: root.closeLabel,
    busy: root.busy,
    footerLayout: size === "xs" || size === "s" || size === "m" ? "fill" : "end",
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
        className={cx(
          dialogShellClassName,
          styles.content,
          overlayMotion.dialog,
          sheet.swipeY,
          className,
        )}
        data-size={size}
        data-state={state}
        data-depth="floating"
        {...shell.aria}
        {...rest}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          swipe.onPointerDown(event);
        }}
      >
        {compact ? <div className={sheet.handle} data-swipe-handle="" aria-hidden="true" /> : null}
        <DialogShellProvider value={shell.value}>
          <LayerProvider value={layer}>
            <SurfaceDepthProvider value="floating">
              <ControlSizeProvider value="m">{children}</ControlSizeProvider>
            </SurfaceDepthProvider>
          </LayerProvider>
        </DialogShellProvider>
      </div>
    </div>
  );
}
