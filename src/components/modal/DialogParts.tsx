/**
 * Shared header / body / footer parts of Modal and Drawer. Not exported from the package root:
 * consumers use them as `Modal.*` and `Drawer.*`. The owning content component provides the
 * shell context (ids, close handler, labels, default footer layout).
 */
import * as React from "react";

import { Button } from "@/components/button/Button";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { mergeRefs } from "@/internal/mergeRefs";
import type { Tone } from "@/internal/states";

import styles from "./DialogParts.module.css";

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

export type DialogIconProps = {
  /** Soft fill + text color of the role. Default `neutral`. */
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
};

export function DialogIcon({ tone = "neutral", children, className }: DialogIconProps) {
  return (
    <span className={cx(styles.icon, className)} data-tone={tone} aria-hidden="true">
      {children}
    </span>
  );
}
DialogIcon.displayName = "Dialog.Icon";

// ─── Title / Description ──────────────────────────────────────────────────────

export type DialogTitleProps = Omit<React.HTMLAttributes<HTMLHeadingElement>, "id">;

export function DialogTitle({ className, ...rest }: DialogTitleProps) {
  const { titleId, registerTitle } = useDialogShell("Title");
  React.useLayoutEffect(() => {
    registerTitle(true);
    return () => registerTitle(false);
  }, [registerTitle]);
  return <h2 id={titleId} className={cx(styles.title, className)} {...rest} />;
}
DialogTitle.displayName = "Dialog.Title";

export type DialogDescriptionProps = Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">;

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

export type DialogBodyProps = React.HTMLAttributes<HTMLDivElement>;

/** The only scrolling zone; header and footer stay put. */
export function DialogBody({ className, ...rest }: DialogBodyProps) {
  return <ScrollContainer className={cx(styles.body, className)} {...rest} />;
}
DialogBody.displayName = "Dialog.Body";

// ─── Footer ───────────────────────────────────────────────────────────────────

export type DialogFooterProps = React.HTMLAttributes<HTMLElement> & {
  /** `fill` — equal-width buttons; `end` — auto width, right-aligned. Default depends on the container. */
  layout?: DialogFooterLayout;
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

// ─── Close / Confirm (wrap one child) ─────────────────────────────────────────

type SlotChild = React.ReactElement<{
  onClick?: React.MouseEventHandler;
  ref?: React.Ref<HTMLElement>;
}>;

export type DialogCloseProps = { children: SlotChild };

/** Adds "close the dialog" to the child's click (unless the child prevents default). */
export function DialogClose({ children }: DialogCloseProps) {
  const { onClose } = useDialogShell("Close");
  const child = React.Children.only(children);
  return React.cloneElement(child, {
    onClick: (event: React.MouseEvent) => {
      child.props.onClick?.(event);
      if (!event.defaultPrevented) onClose();
    },
  });
}
DialogClose.displayName = "Dialog.Close";

export type DialogConfirmProps = { children: SlotChild };

/** Marks the primary action: Enter inside the dialog clicks it (`confirmOnEnter`). */
export function DialogConfirm({ children }: DialogConfirmProps) {
  const { confirmRef } = useDialogShell("Confirm");
  const child = React.Children.only(children);
  const childRef = child.props.ref;
  const ref = React.useMemo(
    () =>
      mergeRefs(childRef, (node: HTMLElement | null) => {
        if (confirmRef) confirmRef.current = node;
      }),
    [childRef, confirmRef],
  );
  return React.cloneElement(child, { ref });
}
DialogConfirm.displayName = "Dialog.Confirm";
