import type * as React from "react";

import {
  DialogBody,
  DialogClose,
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
} from "@/components/modal/DialogParts";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { type PresenceState, usePresence } from "@/hooks/usePresence";
import { cx } from "@/internal/cx";
import {
  OverlayPortalLayerProvider,
  useOverlayPortalLayer,
} from "@/internal/OverlayPortalLayerContext";
import { LayerProvider } from "@/internal/overlay/layerStack";
import overlayMotion from "@/internal/overlayMotion.module.css";
import { Portal } from "@/internal/Portal";
import type { ControlSize } from "@/internal/states";

import styles from "./Drawer.module.css";

export type {
  DialogBodyProps as DrawerBodyProps,
  DialogCloseProps as DrawerCloseProps,
  DialogDescriptionProps as DrawerDescriptionProps,
  DialogFooterProps as DrawerFooterProps,
  DialogHeaderProps as DrawerHeaderProps,
  DialogIconProps as DrawerIconProps,
  DialogTitleProps as DrawerTitleProps,
  DialogTriggerProps as DrawerTriggerProps,
} from "@/components/modal/DialogParts";

export type DrawerSide = "left" | "right";

export type DrawerLabels = {
  /** `aria-label` of the header close button. */
  close: string;
};

const DRAWER_LABELS: DrawerLabels = {
  close: "Закрыть",
};

// ─── Root ─────────────────────────────────────────────────────────────────────

export type DrawerRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Escape closes the drawer. Default `true`. */
  closeOnEscape?: boolean;
  /** A click on the scrim closes the drawer. Default `true`. */
  closeOnOutsideClick?: boolean;
  labels?: Partial<DrawerLabels>;
  children?: React.ReactNode;
};

function DrawerRoot({ labels, children, ...options }: DrawerRootProps) {
  const state = useDialogRoot({ ...options, closeLabel: labels?.close ?? DRAWER_LABELS.close });
  return <DialogRootProvider value={state}>{children}</DialogRootProvider>;
}
DrawerRoot.displayName = "Drawer.Root";

// ─── Content ──────────────────────────────────────────────────────────────────

export type DrawerContentProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Edge the panel slides from. Default `right`. */
  side?: DrawerSide;
  /** Panel width: `s` 360 · `m` 480 · `l` 640 · `xl` 800. Full width below 640px of viewport. */
  size?: Exclude<ControlSize, "xs">;
  /** Class on the full-screen scrim. */
  overlayClassName?: string;
  /** The `role="dialog"` panel. */
  ref?: React.Ref<HTMLDivElement>;
};

function DrawerContent(props: DrawerContentProps) {
  const { open } = useDialogRootContext();
  // Stays mounted with `data-state="closed"` for the slide-out.
  const presence = usePresence(open, { exitDuration: "base" });
  if (!presence.mounted) return null;
  return (
    <Portal>
      <DrawerDialog {...props} state={presence.state} onExitEnd={presence.onExitEnd} />
    </Portal>
  );
}

type DrawerDialogProps = DrawerContentProps & {
  state: PresenceState;
  onExitEnd: (event: React.SyntheticEvent<Element>) => void;
};

/** Mounted inside the portal so focus trap and inert siblings see the attached node. */
function DrawerDialog({
  side = "right",
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
}: DrawerDialogProps) {
  const root = useDialogRootContext();
  const { ref: layerRef, layer, onClose } = useDialogLayer<HTMLDivElement>(root);
  const panelRef = useMergedRefs(layerRef, ref);

  const shell = useDialogShellValue({
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    onClose,
    closeLabel: root.closeLabel,
    footerLayout: "end",
  });

  const parentLayer = useOverlayPortalLayer();
  // A drawer opened from a Modal (or from a drawer above a Modal) stays above it.
  const nestedInModal = parentLayer === "modal" || parentLayer === "drawerInModal";

  return (
    // One portal root for scrim + panel, so `useInertSiblings` never makes the scrim inert.
    <div className={styles.root}>
      <div
        role="presentation"
        className={cx(styles.overlay, overlayMotion.scrim, overlayClassName)}
        data-state={state}
        data-nested-in-modal={nestedInModal ? "true" : undefined}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cx(dialogShellClassName, styles.panel, overlayMotion.drawer, className)}
        data-side={side}
        data-size={size}
        data-state={state}
        data-nested-in-modal={nestedInModal ? "true" : undefined}
        onAnimationEnd={onExitEnd}
        {...shell.aria}
        {...rest}
      >
        <DialogShellProvider value={shell.value}>
          <LayerProvider value={layer}>
            <OverlayPortalLayerProvider value={nestedInModal ? "drawerInModal" : "drawer"}>
              {children}
            </OverlayPortalLayerProvider>
          </LayerProvider>
        </DialogShellProvider>
      </div>
    </div>
  );
}

DrawerContent.displayName = "Drawer.Content";

// ─── Public API ───────────────────────────────────────────────────────────────

export const Drawer = {
  Root: DrawerRoot,
  Trigger: DialogTrigger,
  Content: DrawerContent,
  Header: DialogHeader,
  Icon: DialogIcon,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
  Close: DialogClose,
};
