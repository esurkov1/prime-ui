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
  DialogTitle,
  DialogTrigger,
  useDialogRoot,
} from "@/internal/overlay/DialogParts";

import styles from "./Sheet.module.css";

export type { DialogGuardProps as SheetGuardProps } from "@/internal/overlay/DialogGuard";
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
} from "@/internal/overlay/DialogParts";

export type SheetLabels = DialogLabels;

// ─── Root ─────────────────────────────────────────────────────────────────────

export type SheetRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  labels?: Partial<SheetLabels>;
  children?: React.ReactNode;
};

function SheetRoot({ children, ...options }: SheetRootProps) {
  const state = useDialogRoot(options);
  return <DialogRootProvider value={state}>{children}</DialogRootProvider>;
}
SheetRoot.displayName = "Sheet.Root";

// ─── Content ──────────────────────────────────────────────────────────────────

export type SheetContentProps = React.HTMLAttributes<HTMLDivElement> & {
  overlayClassName?: string;
  ref?: React.Ref<HTMLDivElement>;
};

function SheetContent(props: SheetContentProps) {
  return (
    <DialogPanel
      {...props}
      kind="sheet"
      panelClassName={styles.panel}
      swipe="always"
      footerLayout="end"
    />
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
