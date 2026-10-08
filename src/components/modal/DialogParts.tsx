/**
 * Shared header / body / footer parts of Modal, Drawer and Sheet. Not exported from the package
 * root: consumers use them as `Modal.*`, `Drawer.*` and `Sheet.*`. The owning content component
 * provides the shell context (ids, close handler, labels, default footer layout).
 */
import * as React from "react";

import { Button } from "@/components/button/Button";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { useControllableState } from "@/hooks/useControllableState";
import { useModalLayer } from "@/hooks/useModalLayer";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import type { DismissReason } from "@/internal/overlay/layerStack";
import { Slot } from "@/internal/slot";
import type { Tone } from "@/internal/states";

import styles from "./DialogParts.module.css";

// ─── Root state (shared by Modal.Root and Drawer.Root) ───────────────────────

/** System strings of the built-in «discard changes?» confirm (`Modal.Guard` / `Drawer.Guard dirty`). */
export type DialogDiscardLabels = {
  /** Title of the confirm a dismiss of a `dirty` dialog opens. */
  discardTitle: string;
  /** Its description. */
  discardDescription: string;
  /** Its confirm button: close and lose the changes. */
  discardConfirm: string;
  /** Its cancel button: back to the form. */
  discardCancel: string;
};

export const DIALOG_DISCARD_LABELS: DialogDiscardLabels = {
  discardTitle: "Не сохранять изменения?",
  discardDescription: "Изменения в форме пропадут.",
  discardConfirm: "Не сохранять",
  discardCancel: "Продолжить",
};

export type DialogRootOptions = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  closeLabel: string;
  discardLabels: DialogDiscardLabels;
  /** Modal only: Enter clicks `Modal.Confirm`. */
  confirmOnEnter?: boolean;
  onEnterConfirm?: (event: KeyboardEvent) => void;
};

/** What a `Guard` inside the content holds the dialog to. */
export type DialogGuardState = {
  /** A request runs: no way to dismiss; the close button is disabled. */
  busy: boolean;
  /** Unsaved changes: a dismiss asks first. */
  dirty: boolean;
};

const NO_GUARD: DialogGuardState = { busy: false, dirty: false };

export type DialogRootState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  /**
   * A person dismisses the dialog (Escape, scrim, swipe, the close button, `Close`): ignored while
   * `busy`, asks «discard changes?» while `dirty`, else closes. `setOpen(false)` from code is never
   * guarded.
   */
  requestClose: () => void;
  busy: boolean;
  dirty: boolean;
  setGuard: (guard: DialogGuardState) => void;
  /** The «discard changes?» confirm is open. */
  confirmingClose: boolean;
  setConfirmingClose: (open: boolean) => void;
  closeOnEscape: boolean;
  closeOnOutsideClick: boolean;
  closeLabel: string;
  discardLabels: DialogDiscardLabels;
  confirmOnEnter: boolean;
  onEnterConfirm?: (event: KeyboardEvent) => void;
};

const [DialogRootProvider, useDialogRootContext] =
  createComponentContext<DialogRootState>("Modal / Drawer / Sheet");

export { DialogRootProvider, useDialogRootContext };

/** State of Modal.Root / Drawer.Root: open (controlled or not), the dismiss policy and the guard. */
export function useDialogRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  closeLabel,
  discardLabels,
  confirmOnEnter = false,
  onEnterConfirm,
}: DialogRootOptions): DialogRootState {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [guard, setGuardState] = React.useState<DialogGuardState>(NO_GUARD);
  const [confirmingClose, setConfirmingClose] = React.useState(false);
  // A closed dialog has no pending question.
  if (!isOpen && confirmingClose) setConfirmingClose(false);

  const guardRef = React.useRef(guard);
  guardRef.current = guard;
  const setGuard = React.useCallback((next: DialogGuardState) => {
    setGuardState((current) =>
      current.busy === next.busy && current.dirty === next.dirty ? current : next,
    );
  }, []);
  const requestClose = React.useCallback(() => {
    if (guardRef.current.busy) return;
    if (guardRef.current.dirty) setConfirmingClose(true);
    else setOpen(false);
  }, [setOpen]);

  return React.useMemo(
    () => ({
      open: isOpen,
      setOpen,
      requestClose,
      busy: guard.busy,
      dirty: guard.dirty,
      setGuard,
      confirmingClose,
      setConfirmingClose,
      closeOnEscape,
      closeOnOutsideClick,
      closeLabel,
      discardLabels,
      confirmOnEnter,
      onEnterConfirm,
    }),
    [
      isOpen,
      setOpen,
      requestClose,
      guard,
      setGuard,
      confirmingClose,
      closeOnEscape,
      closeOnOutsideClick,
      closeLabel,
      discardLabels,
      confirmOnEnter,
      onEnterConfirm,
    ],
  );
}

/**
 * Registers a guard from inside the content (`Modal.Guard`, `Drawer.Guard`, ConfirmDialog while it
 * runs); it is lifted when the part unmounts.
 */
export function useDialogGuard({ busy, dirty }: DialogGuardState): DialogRootState {
  const root = useDialogRootContext();
  const { setGuard } = root;
  React.useLayoutEffect(() => setGuard({ busy, dirty }), [busy, dirty, setGuard]);
  React.useLayoutEffect(() => () => setGuard(NO_GUARD), [setGuard]);
  return root;
}

/**
 * The modal layer of a Modal / Drawer panel: Escape and scrim clicks ask to close per the Root's
 * `closeOnEscape` / `closeOnOutsideClick` (and its guard); focus returns to the opener
 * (foundation §8).
 */
export function useDialogLayer<T extends HTMLElement>({
  open,
  requestClose,
  closeOnEscape,
  closeOnOutsideClick,
}: DialogRootState) {
  const onDismiss = (reason: DismissReason) => {
    if (reason === "escape" ? closeOnEscape : closeOnOutsideClick) requestClose();
  };
  return { ...useModalLayer<T>({ open, onDismiss }), onClose: requestClose };
}

/**
 * The content of a closing dialog: while the exit motion plays it keeps showing the last children
 * it had open, so a record cleared together with `open` does not empty the panel mid-motion.
 */
export function useExitSnapshot<T>(open: boolean, children: T): T {
  const last = React.useRef(children);
  if (open) last.current = children;
  return open ? children : last.current;
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
  /** The guard is busy: the close button stays in place, disabled. */
  busy: boolean;
  footerLayout: DialogFooterLayout;
  /** Enter-confirm target (Modal only). */
  confirmRef?: React.MutableRefObject<HTMLElement | null>;
};

const DialogShellContext = React.createContext<DialogShellContextValue | null>(null);

function useDialogShell(part: string): DialogShellContextValue {
  const value = React.useContext(DialogShellContext);
  if (value === null) {
    throw new Error(
      `[prime-ui-kit] ${part} must be used inside Modal.Content, Drawer.Content or Sheet.Content.`,
    );
  }
  return value;
}

type UseDialogShellOptions = {
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  onClose: () => void;
  closeLabel: string;
  busy: boolean;
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
  busy,
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
      busy,
      footerLayout,
      confirmRef,
    }),
    [titleId, descriptionId, hasDescription, onClose, closeLabel, busy, footerLayout, confirmRef],
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
  /**
   * Built-in close button (square ghost `s`, `labels.close`). Default `true`. While a `Guard` is
   * `busy` it stays in place, disabled.
   */
  showClose?: boolean;
  ref?: React.Ref<HTMLElement>;
};

/**
 * `[Icon] [Title + Description] [Actions] [close]` in one row. Layout is a CSS grid, so child
 * order does not matter; text children stack in the text column.
 */
export function DialogHeader({
  showClose = true,
  className,
  children,
  ...rest
}: DialogHeaderProps) {
  const { onClose, closeLabel, busy, hasDescription } = useDialogShell("Header");

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
          disabled={busy}
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

// ─── Actions (header) ─────────────────────────────────────────────────────────

export type DialogActionsProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * A row of controls at the end of the header, before the close button: a status Badge, a ⋯
 * Dropdown, an icon button. Controls inside take tier `s`, the close button's tier.
 */
export function DialogActions({ className, children, ...rest }: DialogActionsProps) {
  useDialogShell("Actions");
  return (
    <div className={cx(styles.actions, className)} {...rest}>
      <ControlSizeProvider value="s">{children}</ControlSizeProvider>
    </div>
  );
}
DialogActions.displayName = "Dialog.Actions";

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

export type DialogMetaProps = React.HTMLAttributes<HTMLParagraphElement> & {
  ref?: React.Ref<HTMLParagraphElement>;
};

/**
 * Short status text at the start of the footer («Есть несохранённые изменения», «Сохранено в
 * 14:02»): muted body-s; the buttons keep the end. Not part of the dialog's description.
 */
export function DialogMeta({ className, ...rest }: DialogMetaProps) {
  useDialogShell("Meta");
  return <p className={cx(styles.meta, className)} {...rest} />;
}
DialogMeta.displayName = "Dialog.Meta";

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

/**
 * Adds "close the dialog" to the child's click (unless the child prevents default); the close
 * goes through the guard, and the child is `disabled` while the guard is busy.
 */
export function DialogClose({ children }: DialogCloseProps) {
  const { onClose, busy } = useDialogShell("Close");
  return (
    <Slot onClick={onClose} disabled={busy || undefined}>
      {children}
    </Slot>
  );
}
DialogClose.displayName = "Dialog.Close";

export type DialogConfirmProps = { children: SlotChild };

/** Marks the primary action: Enter inside the dialog clicks it (`confirmOnEnter`). */
export function DialogConfirm({ children }: DialogConfirmProps) {
  const { confirmRef } = useDialogShell("Confirm");
  return <Slot ref={confirmRef}>{children}</Slot>;
}
DialogConfirm.displayName = "Dialog.Confirm";
