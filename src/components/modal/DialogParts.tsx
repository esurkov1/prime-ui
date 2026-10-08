/**
 * Shared header / body / footer parts of Modal and Drawer. Not exported from the package root:
 * consumers use them as `Modal.*` and `Drawer.*`. The owning content component provides the
 * shell context (ids, close handler, labels, default footer layout).
 */
import * as React from "react";

import { Button } from "@/components/button/Button";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { useControllableState } from "@/hooks/useControllableState";
import { useModalLayer } from "@/hooks/useModalLayer";
import { Icon } from "@/icons";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import type { DismissReason } from "@/internal/overlay/layerStack";
import { Slot } from "@/internal/slot";
import type { Tone } from "@/internal/states";

import styles from "./DialogParts.module.css";

// ─── Root state (shared by Modal.Root and Drawer.Root) ───────────────────────

export type DialogRootOptions = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  closeLabel: string;
  /** Modal only: Enter clicks `Modal.Confirm`. */
  confirmOnEnter?: boolean;
  onEnterConfirm?: (event: KeyboardEvent) => void;
};

export type DialogRootState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  closeOnEscape: boolean;
  closeOnOutsideClick: boolean;
  closeLabel: string;
  confirmOnEnter: boolean;
  onEnterConfirm?: (event: KeyboardEvent) => void;
};

const [DialogRootProvider, useDialogRootContext] =
  createComponentContext<DialogRootState>("Modal / Drawer");

export { DialogRootProvider, useDialogRootContext };

/** State of Modal.Root / Drawer.Root: open (controlled or not) and the dismiss policy. */
export function useDialogRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  closeLabel,
  confirmOnEnter = false,
  onEnterConfirm,
}: DialogRootOptions): DialogRootState {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  return React.useMemo(
    () => ({
      open: isOpen,
      setOpen,
      closeOnEscape,
      closeOnOutsideClick,
      closeLabel,
      confirmOnEnter,
      onEnterConfirm,
    }),
    [
      isOpen,
      setOpen,
      closeOnEscape,
      closeOnOutsideClick,
      closeLabel,
      confirmOnEnter,
      onEnterConfirm,
    ],
  );
}

/**
 * The modal layer of a Modal / Drawer panel: Escape and scrim clicks close it per the Root's
 * `closeOnEscape` / `closeOnOutsideClick`; focus returns to the opener (foundation §8).
 */
export function useDialogLayer<T extends HTMLElement>({
  open,
  setOpen,
  closeOnEscape,
  closeOnOutsideClick,
}: DialogRootState) {
  const onClose = React.useCallback(() => setOpen(false), [setOpen]);
  const onDismiss = (reason: DismissReason) => {
    if (reason === "escape" ? closeOnEscape : closeOnOutsideClick) onClose();
  };
  return { ...useModalLayer<T>({ open, onDismiss }), onClose };
}

/** Class for the `role="dialog"` element: hairline tokens and the `prime-dialog` container. */
export const dialogShellClassName = styles.shell;

/** Footer actions: `fill` — equal-width buttons in one row; `end` — auto-width, right-aligned. */
export type DialogFooterLayout = "fill" | "end";

type DialogShellContextValue = {
  titleId: string;
  descriptionId: string;
  hasDescription: boolean;
  registerTitle: (present: boolean) => void;
  registerDescription: (present: boolean) => void;
  onClose: () => void;
  closeLabel: string;
  footerLayout: DialogFooterLayout;
  /** Enter-confirm target (Modal only). */
  confirmRef?: React.MutableRefObject<HTMLElement | null>;
};

const DialogShellContext = React.createContext<DialogShellContextValue | null>(null);

function useDialogShell(part: string): DialogShellContextValue {
  const value = React.useContext(DialogShellContext);
  if (value === null) {
    throw new Error(`[prime-ui-kit] ${part} must be used inside Modal.Content or Drawer.Content.`);
  }
  return value;
}

type UseDialogShellOptions = {
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  onClose: () => void;
  closeLabel: string;
  footerLayout: DialogFooterLayout;
  confirmRef?: React.MutableRefObject<HTMLElement | null>;
};

/** Builds the shell context and the resolved `aria-*` for the `role="dialog"` element. */
export function useDialogShellValue({
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  onClose,
  closeLabel,
  footerLayout,
  confirmRef,
}: UseDialogShellOptions) {
  const internalTitleId = React.useId();
  const internalDescriptionId = React.useId();
  const titleId = ariaLabelledBy ?? internalTitleId;
  const descriptionId = ariaDescribedBy ?? internalDescriptionId;

  const [hasTitle, setHasTitle] = React.useState(false);
  const [hasDescription, setHasDescription] = React.useState(false);

  const value = React.useMemo<DialogShellContextValue>(
    () => ({
      titleId,
      descriptionId,
      hasDescription,
      registerTitle: setHasTitle,
      registerDescription: setHasDescription,
      onClose,
      closeLabel,
      footerLayout,
      confirmRef,
    }),
    [titleId, descriptionId, hasDescription, onClose, closeLabel, footerLayout, confirmRef],
  );

  const aria = {
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy ?? (hasTitle && !ariaLabel ? titleId : undefined),
    "aria-describedby": ariaDescribedBy ?? (hasDescription ? descriptionId : undefined),
  };

  return { value, aria };
}

export function DialogShellProvider({
  value,
  children,
}: {
  value: DialogShellContextValue;
  children: React.ReactNode;
}) {
  return <DialogShellContext.Provider value={value}>{children}</DialogShellContext.Provider>;
}

// ─── Icon ─────────────────────────────────────────────────────────────────────

export type DialogIconProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** Soft fill + text color of the role. Default `neutral`. */
  tone?: Tone;
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

export function DialogIcon({ tone = "neutral", children, className, ...rest }: DialogIconProps) {
  return (
    <span {...rest} className={cx(styles.icon, className)} data-tone={tone} aria-hidden="true">
      {children}
    </span>
  );
}
DialogIcon.displayName = "Dialog.Icon";

// ─── Title / Description ──────────────────────────────────────────────────────

export type DialogTitleProps = Omit<React.HTMLAttributes<HTMLHeadingElement>, "id"> & {
  ref?: React.Ref<HTMLHeadingElement>;
};

export function DialogTitle({ className, ...rest }: DialogTitleProps) {
  const { titleId, registerTitle } = useDialogShell("Title");
  React.useLayoutEffect(() => {
    registerTitle(true);
    return () => registerTitle(false);
  }, [registerTitle]);
  return <h2 id={titleId} className={cx(styles.title, className)} {...rest} />;
}
DialogTitle.displayName = "Dialog.Title";

export type DialogDescriptionProps = Omit<React.HTMLAttributes<HTMLParagraphElement>, "id"> & {
  ref?: React.Ref<HTMLParagraphElement>;
};

export function DialogDescription({ className, ...rest }: DialogDescriptionProps) {
  const { descriptionId, registerDescription } = useDialogShell("Description");
  React.useLayoutEffect(() => {
    registerDescription(true);
    return () => registerDescription(false);
  }, [registerDescription]);
  return <p id={descriptionId} className={cx(styles.description, className)} {...rest} />;
}
DialogDescription.displayName = "Dialog.Description";

// ─── Header ───────────────────────────────────────────────────────────────────

export type DialogHeaderProps = React.HTMLAttributes<HTMLElement> & {
  /** Built-in close button (square ghost `s`, `labels.close`). Default `true`. */
  showClose?: boolean;
  ref?: React.Ref<HTMLElement>;
};

/**
 * `[Icon] [Title + Description] [close]` in one row. Layout is a CSS grid, so child order
 * does not matter; text children stack in the middle column.
 */
export function DialogHeader({
  showClose = true,
  className,
  children,
  ...rest
}: DialogHeaderProps) {
  const { onClose, closeLabel, hasDescription } = useDialogShell("Header");

  return (
    <header
      className={cx(styles.header, className)}
      data-has-description={hasDescription ? "true" : undefined}
      {...rest}
    >
      {children}
      {showClose ? (
        <Button.Root
          variant="ghost"
          tone="neutral"
          type="button"
          size="s"
          aria-label={closeLabel}
          className={styles.close}
          onClick={onClose}
        >
          <Button.Icon>
            <Icon name="action.close" tone="secondary" />
          </Button.Icon>
        </Button.Root>
      ) : null}
    </header>
  );
}
DialogHeader.displayName = "Dialog.Header";

// ─── Body ─────────────────────────────────────────────────────────────────────

export type DialogBodyProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** The only scrolling zone; header and footer stay put. */
export function DialogBody({ className, ...rest }: DialogBodyProps) {
  return <ScrollContainer className={cx(styles.body, className)} {...rest} />;
}
DialogBody.displayName = "Dialog.Body";

// ─── Footer ───────────────────────────────────────────────────────────────────

export type DialogFooterProps = React.HTMLAttributes<HTMLElement> & {
  /** `fill` — equal-width buttons; `end` — auto width, right-aligned. Default depends on the container. */
  layout?: DialogFooterLayout;
  ref?: React.Ref<HTMLElement>;
};

/** Actions in DOM order, primary last. Stacks full width when the dialog is narrower than 360px. */
export function DialogFooter({ layout, className, ...rest }: DialogFooterProps) {
  const { footerLayout } = useDialogShell("Footer");
  return (
    <footer
      className={cx(styles.footer, className)}
      data-layout={layout ?? footerLayout}
      {...rest}
    />
  );
}
DialogFooter.displayName = "Dialog.Footer";

// ─── Trigger / Close / Confirm (wrap one child) ───────────────────────────────

type SlotChild = React.ReactElement<{
  onClick?: React.MouseEventHandler;
  ref?: React.Ref<HTMLElement>;
}>;

export type DialogTriggerProps = { children: SlotChild };

/** Adds "open the dialog" to the child's click (unless the child prevents default). */
export function DialogTrigger({ children }: DialogTriggerProps) {
  const { setOpen } = useDialogRootContext();
  return <Slot onClick={() => setOpen(true)}>{children}</Slot>;
}
DialogTrigger.displayName = "Dialog.Trigger";

export type DialogCloseProps = { children: SlotChild };

/** Adds "close the dialog" to the child's click (unless the child prevents default). */
export function DialogClose({ children }: DialogCloseProps) {
  const { onClose } = useDialogShell("Close");
  return <Slot onClick={onClose}>{children}</Slot>;
}
DialogClose.displayName = "Dialog.Close";

export type DialogConfirmProps = { children: SlotChild };

/** Marks the primary action: Enter inside the dialog clicks it (`confirmOnEnter`). */
export function DialogConfirm({ children }: DialogConfirmProps) {
  const { confirmRef } = useDialogShell("Confirm");
  return <Slot ref={confirmRef}>{children}</Slot>;
}
DialogConfirm.displayName = "Dialog.Confirm";
