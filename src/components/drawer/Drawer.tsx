import * as React from "react";

import {
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogIcon,
  DialogShellProvider,
  DialogTitle,
  dialogShellClassName,
  useDialogShellValue,
} from "@/components/modal/DialogParts";
import { useInertSiblings } from "@/components/modal/useInertSiblings";
import { useControllableState } from "@/hooks/useControllableState";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { type PresenceState, usePresence } from "@/hooks/usePresence";
import { useScrollLock } from "@/hooks/useScrollLock";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import {
  OverlayPortalLayerProvider,
  useOverlayPortalLayer,
} from "@/internal/OverlayPortalLayerContext";
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
} from "@/components/modal/DialogParts";

export type DrawerSide = "left" | "right";

export type DrawerLabels = {
  /** `aria-label` of the header close button. */
  close: string;
};

const DRAWER_LABELS: DrawerLabels = {
  close: "Закрыть",
};

type DrawerContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  closeOnEscape: boolean;
  closeOnOutsideClick: boolean;
  labels: DrawerLabels;
};

const [DrawerProvider, useDrawerContext] = createComponentContext<DrawerContextValue>("Drawer");

// ─── Root ─────────────────────────────────────────────────────────────────────

export type DrawerRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Escape closes the drawer. Default `true`. */
  closeOnEscape?: boolean;
  /** A click on the scrim (any pointerdown outside the panel) closes the drawer. Default `true`. */
  closeOnOutsideClick?: boolean;
  labels?: Partial<DrawerLabels>;
  children?: React.ReactNode;
};

function DrawerRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  labels,
  children,
}: DrawerRootProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const closeLabel = labels?.close ?? DRAWER_LABELS.close;
  const value = React.useMemo<DrawerContextValue>(
    () => ({
      open: isOpen,
      setOpen,
      closeOnEscape,
      closeOnOutsideClick,
      labels: { close: closeLabel },
    }),
    [isOpen, setOpen, closeOnEscape, closeOnOutsideClick, closeLabel],
  );

  return <DrawerProvider value={value}>{children}</DrawerProvider>;
}
DrawerRoot.displayName = "Drawer.Root";

// ─── Trigger ──────────────────────────────────────────────────────────────────

export type DrawerTriggerProps = {
  children: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
};

/** Opens the drawer on the child's click (unless the child prevents default). */
function DrawerTrigger({ children }: DrawerTriggerProps) {
  const { setOpen } = useDrawerContext();
  const child = React.Children.only(children);
  return React.cloneElement(child, {
    onClick: (event: React.MouseEvent) => {
      child.props.onClick?.(event);
      if (!event.defaultPrevented) setOpen(true);
    },
  });
}
DrawerTrigger.displayName = "Drawer.Trigger";

// ─── Content ──────────────────────────────────────────────────────────────────

export type DrawerContentProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Edge the panel slides from. Default `right`. */
  side?: DrawerSide;
  /** Panel width: `s` 360 · `m` 480 · `l` 640 · `xl` 800. Full width below 640px of viewport. */
  size?: Exclude<ControlSize, "xs">;
  /** Class on the full-screen scrim. */
  overlayClassName?: string;
};

function DrawerContent(props: DrawerContentProps) {
  const { open } = useDrawerContext();
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
  ...rest
}: DrawerDialogProps) {
  const { open, setOpen, closeOnEscape, closeOnOutsideClick, labels } = useDrawerContext();
  const onClose = React.useCallback(() => setOpen(false), [setOpen]);

  const shell = useDialogShellValue({
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    onClose,
    closeLabel: labels.close,
    footerLayout: "end",
  });

  const parentLayer = useOverlayPortalLayer();
  // A drawer opened from a Modal (or from a drawer above a Modal) stays above it.
  const nestedInModal = parentLayer === "modal" || parentLayer === "drawerInModal";

  const trapRef = useFocusTrap<HTMLDivElement>({ enabled: open });
  useScrollLock(open);
  useInertSiblings(open, trapRef);
  useEscapeKey({ enabled: open && closeOnEscape, onEscape: onClose });
  // Scrim layer: the press must start and end outside the panel (no drag-to-close, no click-through).
  useOutsideClick({
    refs: [trapRef],
    enabled: open,
    trigger: "click",
    onOutsideClick: () => {
      if (closeOnOutsideClick) onClose();
    },
  });

  return (
    // One portal root for scrim + panel, so `useInertSiblings` never makes the scrim inert.
    <div className={styles.root}>
      <div
        role="presentation"
        className={cx(styles.overlay, overlayMotion.scrim, overlayClassName)}
        data-testid="drawer-overlay"
        data-state={state}
        data-nested-in-modal={nestedInModal ? "true" : undefined}
      />
      <div
        ref={trapRef}
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
          <OverlayPortalLayerProvider value={nestedInModal ? "drawerInModal" : "drawer"}>
            {children}
          </OverlayPortalLayerProvider>
        </DialogShellProvider>
      </div>
    </div>
  );
}

DrawerContent.displayName = "Drawer.Content";

// ─── Public API ───────────────────────────────────────────────────────────────

export const Drawer = {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Header: DialogHeader,
  Icon: DialogIcon,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
  Close: DialogClose,
};
