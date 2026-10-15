import type * as React from "react";

import { DialogGuard } from "@/internal/overlay/DialogGuard";
import {
  DialogActions,
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogIcon,
  type DialogLabels,
  DialogMeta,
  DialogPanel,
  DialogRootProvider,
  DialogSection,
  DialogTitle,
  DialogTrigger,
  useDialogRoot,
} from "@/internal/overlay/DialogParts";
import { type ControlSize, OVERLAY_CONTENT_SIZE } from "@/internal/states";

import styles from "./Drawer.module.css";

export type { DialogGuardProps as DrawerGuardProps } from "@/internal/overlay/DialogGuard";
export type {
  DialogActionsProps as DrawerActionsProps,
  DialogBodyProps as DrawerBodyProps,
  DialogCloseProps as DrawerCloseProps,
  DialogDescriptionProps as DrawerDescriptionProps,
  DialogFooterProps as DrawerFooterProps,
  DialogHeaderProps as DrawerHeaderProps,
  DialogIconProps as DrawerIconProps,
  DialogMetaProps as DrawerMetaProps,
  DialogSectionProps as DrawerSectionProps,
  DialogTitleProps as DrawerTitleProps,
  DialogTriggerProps as DrawerTriggerProps,
} from "@/internal/overlay/DialogParts";

export type DrawerSide = "left" | "right";

export type DrawerLabels = DialogLabels;

// ─── Root ─────────────────────────────────────────────────────────────────────

export type DrawerRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  labels?: Partial<DrawerLabels>;
  children?: React.ReactNode;
};

function DrawerRoot({ children, ...options }: DrawerRootProps) {
  const state = useDialogRoot(options);
  return <DialogRootProvider value={state}>{children}</DialogRootProvider>;
}
DrawerRoot.displayName = "Drawer.Root";

// ─── Content ──────────────────────────────────────────────────────────────────

export type DrawerContentProps = React.HTMLAttributes<HTMLDivElement> & {
  side?: DrawerSide;
  size?: Exclude<ControlSize, "xs">;
  overlayClassName?: string;
  ref?: React.Ref<HTMLDivElement>;
};

function DrawerContent({
  side = "right",
  size = OVERLAY_CONTENT_SIZE,
  ...props
}: DrawerContentProps) {
  return (
    <DialogPanel
      {...props}
      kind="drawer"
      panelClassName={styles.panel}
      swipe="never"
      footerLayout="end"
      data-side={side}
      data-size={size}
    />
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
  Actions: DialogActions,
  Body: DialogBody,
  Section: DialogSection,
  Footer: DialogFooter,
  Meta: DialogMeta,
  Close: DialogClose,
  Guard: DialogGuard,
};
