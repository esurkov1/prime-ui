import * as React from "react";

import { Button } from "@/components/button/Button";
import { useControllableState } from "@/hooks/useControllableState";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useModalKeyboard } from "@/hooks/useModalKeyboard";
import { useScrollLock } from "@/hooks/useScrollLock";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { mergeRefs } from "@/internal/mergeRefs";
import { OverlayPortalLayerProvider } from "@/internal/OverlayPortalLayerContext";
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
  confirmOnEnter: boolean;
  onEnterConfirm?: (event: KeyboardEvent) => void;
  primaryActionRef: React.MutableRefObject<HTMLElement | null>;
};

const [ModalProvider, useModalContext] = createComponentContext<ModalContextValue>("Modal");

/** Внутренняя связка контента панели ↔ шапки: id для `h2`/`p` и регистрация для `aria-*` на `role="dialog"`. */
type ModalContentShellContextValue = {
  titleId: string;
  descId: string;
  registerHeader: (state: { hasDescription: boolean } | null) => void;
};

const ModalContentShellContext = React.createContext<ModalContentShellContextValue | null>(null);

function useModalContentShell(): ModalContentShellContextValue {
  const value = React.useContext(ModalContentShellContext);
  if (value === null) {
    throw new Error(
      "[prime-ui-kit] Modal header block must be used inside the dialog panel (internal).",
    );
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
  /**
   * Если `true`, Enter вызывает `click()` по кнопке из `Modal.Footer` **`primary`** (или **`onEnterConfirm`**).
   */
  confirmOnEnter?: boolean;
  /**
   * Заменяет стандартное подтверждение по Enter: вызывается вместо программного `click()` по **`primary`**.
   * При необходимости подавить нативное поведение элемента под фокусом вызовите `event.preventDefault()`.
   */
  onEnterConfirm?: (event: KeyboardEvent) => void;
  children?: React.ReactNode;
};

function ModalRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  confirmOnEnter = true,
  onEnterConfirm,
  children,
}: ModalRootProps) {
  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const primaryActionRef = React.useRef<HTMLElement | null>(null);

  const onOpen = React.useCallback(() => setIsOpen(true), [setIsOpen]);
  const onClose = React.useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <ModalProvider
      value={{
        open: isOpen,
        onOpen,
        onClose,
        closeOnEscape,
        closeOnOverlayClick,
        confirmOnEnter,
        onEnterConfirm,
        primaryActionRef,
      }}
    >
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
    ref?: React.Ref<HTMLElement>;
  }>;
};

const ModalClose = React.forwardRef<HTMLElement, ModalCloseProps>(function ModalClose(
  { children },
  forwardedRef,
) {
  const { onClose } = useModalContext();
  const child = React.Children.only(children);
  const childRef = (child as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref;
  const mergedRef = mergeRefs(childRef, forwardedRef);

  return React.cloneElement(child, {
    ref: mergedRef,
    onClick: (event: React.MouseEvent) => {
      child.props.onClick?.(event);
      if (!event.defaultPrevented) {
        onClose();
      }
    },
  });
});

// ─── Footer (публичный слот: secondary → extra → primary) ────────────────────

export type ModalFooterProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  /** Основное действие (Enter при `confirmOnEnter`); один элемент, например `Button.Root`. */
  primary?: React.ReactElement<{
    ref?: React.Ref<HTMLElement>;
    onClick?: React.MouseEventHandler;
    className?: string;
    size?: ButtonSize;
  }>;
  /** Обычно отмена / закрытие (`Modal.Close` + кнопка). */
  secondary?: React.ReactNode;
  /** Дополнительные кнопки между `secondary` и `primary` (несколько кнопок — фрагмент). */
  extra?: React.ReactNode;
};

function FooterPrimarySlot({
  children,
}: {
  children: React.ReactElement<{
    ref?: React.Ref<HTMLElement>;
    onClick?: React.MouseEventHandler;
    className?: string;
    size?: ButtonSize;
  }>;
}) {
  const { primaryActionRef } = useModalContext();
  const child = React.Children.only(children);
  const childRef = (child as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref;
  const mergedRef = mergeRefs(childRef, (node: HTMLElement | null) => {
    primaryActionRef.current = node;
  });

  return React.cloneElement(child, { ref: mergedRef });
}

function ModalFooter({ primary, secondary, extra, className, ...rest }: ModalFooterProps) {
  return (
    <footer className={cx(styles.footer, className)} data-prime-modal-footer="" {...rest}>
      {secondary}
      {extra}
      {primary != null ? <FooterPrimarySlot>{primary}</FooterPrimarySlot> : null}
    </footer>
  );
}

// ─── Portal ───────────────────────────────────────────────────────────────────

type ModalPortalProps = {
  children: React.ReactNode;
  container?: HTMLElement | null;
};

function ModalPortal({ children, container }: ModalPortalProps) {
  const { open } = useModalContext();
  if (!open) return null;
  return <Portal container={container}>{children}</Portal>;
}

// ─── Overlay ──────────────────────────────────────────────────────────────────

type ModalOverlayProps = React.HTMLAttributes<HTMLDivElement>;

function ModalOverlay({ className, onClick, children, ...rest }: ModalOverlayProps) {
  const { onClose, closeOnOverlayClick } = useModalContext();

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented && closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop overlay; keyboard handled by useModalKeyboard in ModalContent
    <div
      role="presentation"
      className={cx(styles.overlay, className)}
      onClick={handleClick}
      data-testid="modal-overlay"
      {...rest}
    >
      {children}
    </div>
  );
}

// ─── Layer (Portal + Overlay) ────────────────────────────────────────────────

type ModalLayerProps = ModalPortalProps & Omit<ModalOverlayProps, "children">;

function ModalLayer({ children, container, ...overlayProps }: ModalLayerProps) {
  return (
    <ModalPortal container={container}>
      <ModalOverlay {...overlayProps}>{children}</ModalOverlay>
    </ModalPortal>
  );
}

// ─── Content ──────────────────────────────────────────────────────────────────

type ModalContentProps = React.HTMLAttributes<HTMLDivElement> & {
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
  const { open, onClose, closeOnEscape, confirmOnEnter, onEnterConfirm, primaryActionRef } =
    useModalContext();

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

  useModalKeyboard({
    open,
    trapRef,
    closeOnEscape,
    onClose,
    confirmOnEnter,
    onEnterConfirm,
    primaryRef: primaryActionRef,
  });

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
        <OverlayPortalLayerProvider value="modal">
          <ControlSizeProvider value={MODAL_SHELL_SIZE}>{children}</ControlSizeProvider>
        </OverlayPortalLayerProvider>
      </div>
    </ModalContentShellContext.Provider>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

type ModalHeaderProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
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

  const hasDescription = description != null && description !== "";

  React.useLayoutEffect(() => {
    registerHeader({
      hasDescription,
    });
    return () => {
      registerHeader(null);
    };
  }, [hasDescription, registerHeader]);

  return (
    <header
      className={cx(styles.header, !hasDescription && styles.headerNoDescription, className)}
      {...rest}
    >
      {icon && <div className={styles.headerIcon}>{icon}</div>}
      <div className={styles.headText}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        {hasDescription ? (
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

type ModalBodyProps = React.HTMLAttributes<HTMLDivElement>;

function ModalBody({ children, className, ...rest }: ModalBodyProps) {
  return (
    <div className={cx(styles.body, className)} {...rest}>
      {children}
    </div>
  );
}

// ─── Panel (публичная оболочка: Layer + Content + шапка/тело/подвал) ───────────

export type ModalPanelProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  /** Узел для `createPortal` (по умолчанию `document.body`). */
  container?: HTMLElement | null;
  /** Класс на полноэкранной подложке. */
  overlayClassName?: string;
  /** Заголовок; если задан, рендерится шапка с `h2` и опционально телом с разделителем. */
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  showClose?: boolean;
  closeAriaLabel?: string;
  /** При `title` оборачивается в зону тела; без `title` — рендерится сразу в панели (например headless-диалог). */
  children?: React.ReactNode;
  /** Предпочтительно `Modal.Footer` со слотами `secondary` / `extra` / `primary` для явного действия по Enter. */
  footer?: React.ReactNode;
  footerClassName?: string;
  bodyClassName?: string;
  bodyStyle?: React.CSSProperties;
};

function ModalPanel({
  container,
  overlayClassName,
  className,
  style,
  title,
  description,
  icon,
  showClose = true,
  closeAriaLabel = "Close",
  children,
  footer,
  footerClassName,
  bodyClassName,
  bodyStyle,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: ModalPanelProps) {
  const hasHeader = title != null && title !== "";

  const footerNode =
    footer != null ? (
      React.isValidElement(footer) && footer.type === ModalFooter ? (
        React.cloneElement(footer as React.ReactElement<ModalFooterProps>, {
          className: cx((footer.props as ModalFooterProps).className, footerClassName),
        })
      ) : (
        <footer className={cx(styles.footer, footerClassName)}>{footer}</footer>
      )
    ) : null;

  return (
    <ModalLayer className={overlayClassName} container={container}>
      <ModalContent
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={className}
        style={style}
        {...rest}
      >
        {hasHeader ? (
          <ModalHeader
            closeAriaLabel={closeAriaLabel}
            description={description}
            icon={icon}
            showClose={showClose}
            title={title}
          />
        ) : null}
        {children != null ? (
          hasHeader ? (
            <ModalBody className={bodyClassName} style={bodyStyle}>
              {children}
            </ModalBody>
          ) : (
            children
          )
        ) : null}
        {footerNode}
      </ModalContent>
    </ModalLayer>
  );
}

// ─── Публичный API ────────────────────────────────────────────────────────────

export const Modal = {
  Root: ModalRoot,
  Trigger: ModalTrigger,
  Close: ModalClose,
  Footer: ModalFooter,
  Panel: ModalPanel,
};
