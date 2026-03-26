import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { Portal } from "@/internal/Portal";
import type { ButtonSize } from "@/internal/states";

import styles from "./Modal.module.css";

// ─── Context ─────────────────────────────────────────────────────────────────

/** Единый масштаб оболочки модалки и каскада `ControlSizeProvider` (кнопка закрытия в шапке без своего `size`). */
const MODAL_SHELL_SIZE = "m" as const satisfies ButtonSize;

type ModalContextValue = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  closeOnEscape: boolean;
  closeOnOverlayClick: boolean;
};

const [ModalProvider, useModalContext] = createComponentContext<ModalContextValue>("Modal");

const ModalHeaderContext = React.createContext(false);

function isButtonRootElement(
  child: React.ReactElement,
): child is React.ReactElement<{ size?: ButtonSize }> {
  return (
    typeof child.type === "object" &&
    child.type !== null &&
    "displayName" in child.type &&
    (child.type as { displayName?: string }).displayName === "ButtonRoot"
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export type ModalRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  children?: React.ReactNode;
};

function ModalRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  children,
}: ModalRootProps) {
  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const onOpen = React.useCallback(() => setIsOpen(true), [setIsOpen]);
  const onClose = React.useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <ModalProvider value={{ open: isOpen, onOpen, onClose, closeOnEscape, closeOnOverlayClick }}>
      {children}
    </ModalProvider>
  );
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

export type ModalTriggerProps = {
  children: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
};

function ModalTrigger({ children }: ModalTriggerProps) {
  const { onOpen } = useModalContext();
  const child = React.Children.only(children);
  return React.cloneElement(child, {
    onClick: (event: React.MouseEvent) => {
      child.props.onClick?.(event);
      if (!event.defaultPrevented) {
        onOpen();
      }
    },
  });
}

// ─── Close ────────────────────────────────────────────────────────────────────

export type ModalCloseProps = {
  children: React.ReactElement<{
    onClick?: React.MouseEventHandler;
    className?: string;
    size?: ButtonSize;
  }>;
};

function ModalClose({ children }: ModalCloseProps) {
  const { onClose } = useModalContext();
  const insideHeader = React.useContext(ModalHeaderContext);
  const child = React.Children.only(children);

  const headerCloseSize: Partial<{ size: ButtonSize }> =
    insideHeader && isButtonRootElement(child) && child.props.size === undefined
      ? { size: MODAL_SHELL_SIZE }
      : {};

  return React.cloneElement(child, {
    ...headerCloseSize,
    onClick: (event: React.MouseEvent) => {
      child.props.onClick?.(event);
      if (!event.defaultPrevented) {
        onClose();
      }
    },
    className: cx(child.props.className, insideHeader ? styles.closeBtn : undefined),
  });
}

// ─── Portal ───────────────────────────────────────────────────────────────────

export type ModalPortalProps = {
  children: React.ReactNode;
  container?: HTMLElement | null;
};

function ModalPortal({ children, container }: ModalPortalProps) {
  const { open } = useModalContext();
  if (!open) return null;
  return <Portal container={container}>{children}</Portal>;
}

// ─── Overlay ──────────────────────────────────────────────────────────────────

export type ModalOverlayProps = React.HTMLAttributes<HTMLDivElement>;

function ModalOverlay({ className, onClick, ...rest }: ModalOverlayProps) {
  const { onClose, closeOnOverlayClick } = useModalContext();

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented && closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop overlay; keyboard dismiss handled by useEscapeKey in ModalContent
    <div
      role="presentation"
      className={cx(styles.overlay, className)}
      onClick={handleClick}
      data-testid="modal-overlay"
      {...rest}
    />
  );
}

// ─── Content ──────────────────────────────────────────────────────────────────

export type ModalContentProps = React.HTMLAttributes<HTMLDivElement> & {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};

function ModalContent({
  children,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: ModalContentProps) {
  const { open, onClose, closeOnEscape } = useModalContext();

  const trapRef = useFocusTrap<HTMLDivElement>({ enabled: open });

  useScrollLock(open);

  useEscapeKey({ enabled: closeOnEscape && open, onEscape: onClose });

  React.useEffect(() => {
    if (!open) return;

    const container = trapRef.current;
    if (!container) return;

    let portalRoot: Element | null = container;
    while (portalRoot && portalRoot.parentElement !== document.body) {
      portalRoot = portalRoot.parentElement;
    }

    const siblings = Array.from(document.body.children).filter((el) => el !== portalRoot);
    const prev = siblings.map((el) => ({
      el: el as HTMLElement,
      inert: (el as HTMLElement).inert,
      ariaHidden: el.getAttribute("aria-hidden"),
    }));

    for (const { el } of prev) {
      el.inert = true;
      el.setAttribute("aria-hidden", "true");
    }

    return () => {
      for (const { el, inert, ariaHidden } of prev) {
        el.inert = inert;
        if (ariaHidden === null) {
          el.removeAttribute("aria-hidden");
        } else {
          el.setAttribute("aria-hidden", ariaHidden);
        }
      }
    };
  }, [open, trapRef]);

  return (
    <div
      ref={trapRef}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      tabIndex={-1}
      className={cx(styles.content, className)}
      {...rest}
    >
      <ControlSizeProvider value={MODAL_SHELL_SIZE}>{children}</ControlSizeProvider>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

export type ModalHeaderProps = React.HTMLAttributes<HTMLElement> & {
  icon?: React.ReactNode;
};

function ModalHeader({ children, className, icon, ...rest }: ModalHeaderProps) {
  return (
    <ModalHeaderContext.Provider value={true}>
      <header className={cx(styles.header, className)} {...rest}>
        {icon && <div className={styles.headerIcon}>{icon}</div>}
        <div className={styles.headText}>{children}</div>
      </header>
    </ModalHeaderContext.Provider>
  );
}

// ─── Title ────────────────────────────────────────────────────────────────────

export type ModalTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

function ModalTitle({ children, className, ...rest }: ModalTitleProps) {
  return (
    <h2 className={cx(styles.title, className)} {...rest}>
      {children}
    </h2>
  );
}

// ─── Description ─────────────────────────────────────────────────────────────

export type ModalDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

function ModalDescription({ children, className, ...rest }: ModalDescriptionProps) {
  return (
    <p className={cx(styles.description, className)} {...rest}>
      {children}
    </p>
  );
}

// ─── Body ─────────────────────────────────────────────────────────────────────

export type ModalBodyProps = React.HTMLAttributes<HTMLDivElement>;

function ModalBody({ children, className, ...rest }: ModalBodyProps) {
  return (
    <div className={cx(styles.body, className)} {...rest}>
      {children}
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export type ModalFooterProps = React.HTMLAttributes<HTMLElement>;

function ModalFooter({ children, className, ...rest }: ModalFooterProps) {
  return (
    <footer className={cx(styles.footer, className)} {...rest}>
      {children}
    </footer>
  );
}

// ─── Namespace export ─────────────────────────────────────────────────────────

export const Modal = {
  Root: ModalRoot,
  Trigger: ModalTrigger,
  Close: ModalClose,
  Portal: ModalPortal,
  Overlay: ModalOverlay,
  Content: ModalContent,
  Header: ModalHeader,
  Title: ModalTitle,
  Description: ModalDescription,
  Body: ModalBody,
  Footer: ModalFooter,
};
