import { DialogGuard } from "./DialogGuard";
import {
  DialogActions,
  DialogBody,
  DialogClose,
  DialogConfirm,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogIcon,
  DialogMeta,
  DialogTitle,
  DialogTrigger,
} from "./DialogParts";
import { ModalContent, ModalRoot } from "./ModalDialog";

export type { DialogGuardProps as ModalGuardProps } from "./DialogGuard";
export type {
  DialogActionsProps as ModalActionsProps,
  DialogBodyProps as ModalBodyProps,
  DialogCloseProps as ModalCloseProps,
  DialogConfirmProps as ModalConfirmProps,
  DialogDescriptionProps as ModalDescriptionProps,
  DialogFooterProps as ModalFooterProps,
  DialogHeaderProps as ModalHeaderProps,
  DialogIconProps as ModalIconProps,
  DialogMetaProps as ModalMetaProps,
  DialogTitleProps as ModalTitleProps,
  DialogTriggerProps as ModalTriggerProps,
} from "./DialogParts";
export type {
  ModalContentProps,
  ModalLabels,
  ModalPlacement,
  ModalRootProps,
} from "./ModalDialog";

export const Modal = {
  Root: ModalRoot,
  Trigger: DialogTrigger,
  Content: ModalContent,
  Header: DialogHeader,
  Icon: DialogIcon,
  Title: DialogTitle,
  Description: DialogDescription,
  Actions: DialogActions,
  Body: DialogBody,
  Footer: DialogFooter,
  Meta: DialogMeta,
  Close: DialogClose,
  Confirm: DialogConfirm,
  Guard: DialogGuard,
};
