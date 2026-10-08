import * as React from "react";

import { DialogGuard } from "@/components/modal/DialogGuard";
import {
  DIALOG_DISCARD_LABELS,
  DialogActions,
  DialogBody,
  DialogClose,
  DialogDescription,
  type DialogDiscardLabels,
  DialogFooter,
  DialogHeader,
  DialogIcon,
  DialogMeta,
  DialogRootProvider,
  DialogShellProvider,
  DialogTitle,
  DialogTrigger,
  dialogShellClassName,
  useDialogLayer,
  useDialogRoot,
  useDialogRootContext,
  useDialogShellValue,
  useExitSnapshot,
} from "@/components/modal/DialogParts";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { type PresenceState, usePresence } from "@/hooks/usePresence";
import { useSwipeDismiss } from "@/hooks/useSwipeDismiss";
import { cx } from "@/internal/cx";
import { LayerProvider } from "@/internal/overlay/layerStack";
import overlayMotion from "@/internal/overlayMotion.module.css";
import { Portal } from "@/internal/Portal";
import sheet from "@/internal/sheet.module.css";
import { SurfaceDepthProvider } from "@/internal/surfaceDepth";

import styles from "./Sheet.module.css";

export type { DialogGuardProps as SheetGuardProps } from "@/components/modal/DialogGuard";
export type {
  DialogActionsProps as SheetActionsProps,
  DialogBodyProps as SheetBodyProps,
  DialogCloseProps as SheetCloseProps,
  DialogDescriptionProps as SheetDescriptionProps,
  DialogFooterProps as SheetFooterProps,
  DialogHeaderProps as SheetHeaderProps,
  DialogIconProps as SheetIconProps,
  DialogMetaProps as SheetMetaProps,
  DialogTitleProps as SheetTitleProps,
  DialogTriggerProps as SheetTriggerProps,
} from "@/components/modal/DialogParts";

export type SheetLabels = DialogDiscardLabels & {
  /** `aria-label` of the header close button. */
  close: string;
};

const SHEET_LABELS: SheetLabels = {
  close: "Закрыть",
  ...DIALOG_DISCARD_LABELS,
};

// ─── Root ─────────────────────────────────────────────────────────────────────

export type SheetRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Escape closes the sheet. Default `true`. */
  closeOnEscape?: boolean;
  /** A click on the scrim or a swipe down closes the sheet. Default `true`. */
  closeOnOutsideClick?: boolean;
  labels?: Partial<SheetLabels>;
  children?: React.ReactNode;
};

function SheetRoot({ labels, children, ...options }: SheetRootProps) {
  const { close, discardTitle, discardDescription, discardConfirm, discardCancel } = {
    ...SHEET_LABELS,
    ...labels,
  };
  const discardLabels = React.useMemo(
    () => ({ discardTitle, discardDescription, discardConfirm, discardCancel }),
    [discardTitle, discardDescription, discardConfirm, discardCancel],
  );
  const state = useDialogRoot({ ...options, closeLabel: close, discardLabels });
  return <DialogRootProvider value={state}>{children}</DialogRootProvider>;
}
SheetRoot.displayName = "Sheet.Root";

// ─── Content ──────────────────────────────────────────────────────────────────

export type SheetContentProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Class on the full-screen scrim. */
  overlayClassName?: string;
  /** The `role="dialog"` panel. */
  ref?: React.Ref<HTMLDivElement>;
};

function SheetContent({ children, ...props }: SheetContentProps) {
  const { open } = useDialogRootContext();
  // Stays mounted with `data-state="closed"` for the slide-down, showing what it showed open.
  const presence = usePresence(open, { exitDuration: "base" });
  const shown = useExitSnapshot(open, children);
  if (!presence.mounted) return null;
  return (
    <Portal>
      <SheetDialog {...props} state={presence.state} onExitEnd={presence.onExitEnd}>
        {shown}
      </SheetDialog>
    </Portal>
  );
}

type SheetDialogProps = SheetContentProps & {
  state: PresenceState;
  onExitEnd: (event: React.SyntheticEvent<Element>) => void;
};

/** Mounted inside the portal so the modal layer sees the attached node. */
function SheetDialog({
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
}: SheetDialogProps) {
  const root = useDialogRootContext();
  const { ref: layerRef, layer, onClose } = useDialogLayer<HTMLDivElement>(root);
  const panelRef = useMergedRefs(layerRef, ref);
  const scrimRef = React.useRef<HTMLDivElement>(null);
  // Swiping down is a dismiss from outside the content, like a scrim click.
  const swipe = useSwipeDismiss({
    // A guarded sheet does not slide away: busy ignores the dismiss, dirty asks first.
    enabled: root.closeOnOutsideClick && state === "open" && !root.busy && !root.dirty,
    onDismiss: onClose,
    handle: "[data-swipe-handle], header",
    // The scrim fades with the sheet: half way down, half as dark.
    onProgress: (progress) =>
      scrimRef.current?.style.setProperty("--swipe-progress", `${progress}`),
  });

  const shell = useDialogShellValue({
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    onClose,
    closeLabel: root.closeLabel,
    busy: root.busy,
    footerLayout: "end",
  });

  return (
    // One portal root for scrim + sheet, so `useInertSiblings` never makes the scrim inert.
    <div className={styles.root}>
      <div
        ref={scrimRef}
        role="presentation"
        className={cx(styles.overlay, overlayMotion.scrim, overlayClassName)}
        data-state={state}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cx(
          dialogShellClassName,
          styles.panel,
          overlayMotion.sheet,
          sheet.swipeY,
          className,
        )}
        data-state={state}
        data-depth="floating"
        onAnimationEnd={onExitEnd}
        {...shell.aria}
        {...rest}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          swipe.onPointerDown(event);
        }}
      >
        <div className={sheet.handle} data-swipe-handle="" aria-hidden="true" />
        <DialogShellProvider value={shell.value}>
          <LayerProvider value={layer}>
            <SurfaceDepthProvider value="floating">{children}</SurfaceDepthProvider>
          </LayerProvider>
        </DialogShellProvider>
      </div>
    </div>
  );
}

SheetContent.displayName = "Sheet.Content";

// ─── Public API ───────────────────────────────────────────────────────────────

export const Sheet = {
  Root: SheetRoot,
  Trigger: DialogTrigger,
  Content: SheetContent,
  Header: DialogHeader,
  Icon: DialogIcon,
  Title: DialogTitle,
  Description: DialogDescription,
  Actions: DialogActions,
  Body: DialogBody,
  Footer: DialogFooter,
  Meta: DialogMeta,
  Close: DialogClose,
  Guard: DialogGuard,
};
