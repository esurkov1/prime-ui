import type * as React from "react";

import { DialogGuard } from "@/components/modal/DialogGuard";
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
  DialogTitle,
  DialogTrigger,
  useDialogRoot,
} from "@/components/modal/DialogParts";
import type { ControlSize } from "@/internal/states";

import styles from "./Drawer.module.css";

export type { DialogGuardProps as DrawerGuardProps } from "@/components/modal/DialogGuard";
export type {
  DialogActionsProps as DrawerActionsProps,
  DialogBodyProps as DrawerBodyProps,
  DialogCloseProps as DrawerCloseProps,
  DialogDescriptionProps as DrawerDescriptionProps,
  DialogFooterProps as DrawerFooterProps,
  DialogHeaderProps as DrawerHeaderProps,
  DialogIconProps as DrawerIconProps,
  DialogMetaProps as DrawerMetaProps,
  DialogTitleProps as DrawerTitleProps,
  DialogTriggerProps as DrawerTriggerProps,
} from "@/components/modal/DialogParts";

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
  /** The `role="dialog"` panel. */
  ref?: React.Ref<HTMLDivElement>;
};

function DrawerContent({ side = "right", size = "m", ...props }: DrawerContentProps) {
  return (
    <DialogPanel
      {...props}
      panelClassName={styles.panel}
      motion="drawer"
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
  Footer: DialogFooter,
  Meta: DialogMeta,
  Close: DialogClose,
  Guard: DialogGuard,
};
