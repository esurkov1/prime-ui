import { DialogGuard } from "@/internal/overlay/DialogGuard";
import {
  DialogActions,
  DialogBadges,
  DialogBody,
  DialogClose,
  DialogConfirm,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogIcon,
  DialogMeta,
  DialogSection,
  DialogTitle,
  DialogTrigger,
} from "@/internal/overlay/DialogParts";
import { ModalContent, ModalRoot } from "@/internal/overlay/ModalDialog";

export type { DialogGuardProps as ModalGuardProps } from "@/internal/overlay/DialogGuard";
export type {
  DialogActionsProps as ModalActionsProps,
  DialogBadgesProps as ModalBadgesProps,
  DialogBodyProps as ModalBodyProps,
  DialogCloseProps as ModalCloseProps,
  DialogConfirmProps as ModalConfirmProps,
  DialogDescriptionProps as ModalDescriptionProps,
  DialogFooterProps as ModalFooterProps,
  DialogHeaderProps as ModalHeaderProps,
  DialogIconProps as ModalIconProps,
  DialogMetaProps as ModalMetaProps,
  DialogSectionProps as ModalSectionProps,
  DialogTitleProps as ModalTitleProps,
  DialogTriggerProps as ModalTriggerProps,
} from "@/internal/overlay/DialogParts";
export type {
  ModalContentProps,
  ModalLabels,
  ModalPlacement,
  ModalRootProps,
} from "@/internal/overlay/ModalDialog";

export const Modal = {
  Root: ModalRoot,
  Trigger: DialogTrigger,
  Content: ModalContent,
  Header: DialogHeader,
  Icon: DialogIcon,
  Title: DialogTitle,
  Badges: DialogBadges,
  Description: DialogDescription,
  Actions: DialogActions,
  Body: DialogBody,
  Section: DialogSection,
  Footer: DialogFooter,
  Meta: DialogMeta,
  Close: DialogClose,
  Confirm: DialogConfirm,
  Guard: DialogGuard,
};
