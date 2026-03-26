import * as React from "react";

import { Button } from "@/components/button/Button";
import { useControllableState } from "@/hooks/useControllableState";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { Icon } from "@/icons";
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

/** Связка `Modal.Content` ↔ `Modal.Header`: id для `h2`/`p` и регистрация шапки для `aria-*` на панели. */
type ModalContentShellContextValue = {
  titleId: string;
  descId: string;
  registerHeader: (state: { hasDescription: boolean } | null) => void;
};

const ModalContentShellContext = React.createContext<ModalContentShellContextValue | null>(null);

function useModalContentShell(): ModalContentShellContextValue {
  const value = React.useContext(ModalContentShellContext);
  if (value === null) {
    throw new Error("[prime-ui-kit] `Modal.Header` must be used inside `Modal.Content`.");
  }
  return value;
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
  const child = React.Children.only(children);

  return React.cloneElement(child, {
    onClick: (event: React.MouseEvent) => {
      child.props.onClick?.(event);
      if (!event.defaultPrevented) {
        onClose();
      }
    },
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
  "aria-labelledby": ariaLabelledByProp,
  "aria-describedby": ariaDescribedByProp,
  ...rest
}: ModalContentProps) {
  const { open, onClose, closeOnEscape } = useModalContext();

  const internalTitleId = React.useId();
  const internalDescId = React.useId();
  const titleId = ariaLabelledByProp ?? internalTitleId;
  const descId = ariaDescribedByProp ?? internalDescId;

  const [headerState, setHeaderState] = React.useState<{ hasDescription: boolean } | null>(null);
  const registerHeader = React.useCallback((state: { hasDescription: boolean } | null) => {
    setHeaderState(state);
  }, []);

  const shellValue = React.useMemo<ModalContentShellContextValue>(
    () => ({ titleId, descId, registerHeader }),
    [titleId, descId, registerHeader],
  );

  const ariaLabelledByResolved =
    ariaLabelledByProp ?? (ariaLabel ? undefined : headerState != null ? titleId : undefined);
  const ariaDescribedByResolved =
    ariaDescribedByProp ?? (headerState?.hasDescription ? descId : undefined);

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
    <ModalContentShellContext.Provider value={shellValue}>
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledByResolved}
        aria-describedby={ariaDescribedByResolved}
        tabIndex={-1}
        className={cx(styles.content, className)}
        {...rest}
      >
        <ControlSizeProvider value={MODAL_SHELL_SIZE}>{children}</ControlSizeProvider>
      </div>
    </ModalContentShellContext.Provider>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

export type ModalHeaderProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  icon?: React.ReactNode;
  /** Текст заголовка (рендерится как `h2`). */
  title: React.ReactNode;
  /** Подзаголовок под заголовком (рендерится как `p`). */
  description?: React.ReactNode;
  /** Показать встроенную кнопку закрытия в шапке (иконка). */
  showClose?: boolean;
  /** Подпись для встроенной кнопки закрытия (`aria-label`). */
  closeAriaLabel?: string;
};

function ModalHeader({
  icon,
  title,
  description,
  showClose = true,
  closeAriaLabel = "Close",
  className,
  ...rest
}: ModalHeaderProps) {
  const { onClose } = useModalContext();
  const { titleId, descId, registerHeader } = useModalContentShell();

  React.useLayoutEffect(() => {
    registerHeader({
      hasDescription: description != null && description !== "",
    });
    return () => {
      registerHeader(null);
    };
  }, [description, registerHeader]);

  return (
    <header className={cx(styles.header, className)} {...rest}>
      {icon && <div className={styles.headerIcon}>{icon}</div>}
      <div className={styles.headText}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        {description != null && description !== "" ? (
          <p id={descId} className={styles.description}>
            {description}
          </p>
        ) : null}
        {showClose ? (
          <Button.Root
            type="button"
            variant="neutral"
            mode="ghost"
            size={MODAL_SHELL_SIZE}
            aria-label={closeAriaLabel}
            className={styles.closeBtn}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              if (!event.defaultPrevented) {
                onClose();
              }
            }}
          >
            <Button.Icon>
              <Icon name="action.close" tone="subtle" />
            </Button.Icon>
          </Button.Root>
        ) : null}
      </div>
    </header>
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
  Body: ModalBody,
  Footer: ModalFooter,
};
