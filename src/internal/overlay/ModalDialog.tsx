import type * as React from "react";

import { type ControlSize, OVERLAY_CONTENT_SIZE } from "@/internal/states";

import {
  type DialogLabels,
  DialogPanel,
  type DialogRootOptions,
  DialogRootProvider,
  useDialogRoot,
} from "./DialogParts";
import styles from "./ModalDialog.module.css";

/*
 * Root and Content of Modal, apart from the public `Modal` object (components/modal/Modal.tsx):
 * ConfirmDialog is built from them, and `Modal.Guard` is built from ConfirmDialog.
 */

export type ModalLabels = DialogLabels;

// ─── Root ─────────────────────────────────────────────────────────────────────

export type ModalRootProps = Omit<DialogRootOptions, "labels" | "confirmOnEnter"> & {
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  confirmOnEnter?: boolean;
  onEnterConfirm?: (event: KeyboardEvent) => void;
  labels?: Partial<ModalLabels>;
  children?: React.ReactNode;
};

export function ModalRoot({ confirmOnEnter = true, children, ...options }: ModalRootProps) {
  const state = useDialogRoot({ ...options, confirmOnEnter });
  return <DialogRootProvider value={state}>{children}</DialogRootProvider>;
}
ModalRoot.displayName = "Modal.Root";

// ─── Content ──────────────────────────────────────────────────────────────────

/** Where the dialog stands: centred, or near the top (a palette whose list grows downward). */
export type ModalPlacement = "center" | "top";

export type ModalContentProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: ControlSize;
  placement?: ModalPlacement;
  container?: HTMLElement | null;
  overlayClassName?: string;
  ref?: React.Ref<HTMLDivElement>;
};

export function ModalContent({
  size = OVERLAY_CONTENT_SIZE,
  placement = "center",
  ...props
}: ModalContentProps) {
  return (
    <DialogPanel
      {...props}
      kind="modal"
      panelClassName={styles.content}
      swipe={placement === "center" ? "compact" : "never"}
      footerLayout={size === "xs" || size === "s" || size === "m" ? "fill" : "end"}
      enterConfirm
      controlSize="m"
      data-size={size}
      data-placement={placement}
    />
  );
}
ModalContent.displayName = "Modal.Content";
