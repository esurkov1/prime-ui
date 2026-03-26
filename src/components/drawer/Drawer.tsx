import * as React from "react";

import { Button } from "@/components/button/Button";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { useControllableState } from "@/hooks/useControllableState";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { Portal } from "@/internal/Portal";
import type { DrawerSize } from "@/internal/states";

import styles from "./Drawer.module.css";

export type { DrawerSize };

// ─── Types ────────────────────────────────────────────────────────────────────

export type DrawerSide = "left" | "right" | "bottom" | "top";

// ─── Context ──────────────────────────────────────────────────────────────────

type DrawerContextValue = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  closeOnEscape: boolean;
  closeOnOverlayClick: boolean;
};

const [DrawerProvider, useDrawerContext] = createComponentContext<DrawerContextValue>("Drawer");

const DrawerChromeSizeContext = React.createContext<DrawerSize | null>(null);

function useDrawerChromeSize(): DrawerSize {
  const value = React.useContext(DrawerChromeSizeContext);
  if (value === null) {
    throw new Error(
      "[prime-ui-kit] Drawer.Header, Drawer.Title, Drawer.Body and Drawer.Footer must be used inside Drawer.Content.",
    );
  }
  return value;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export type DrawerRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  children: React.ReactNode;
};

function DrawerRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  children,
}: DrawerRootProps) {
  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const onOpen = React.useCallback(() => setIsOpen(true), [setIsOpen]);
  const onClose = React.useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <DrawerProvider value={{ open: isOpen, onOpen, onClose, closeOnEscape, closeOnOverlayClick }}>
      {children}
    </DrawerProvider>
  );
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

export type DrawerTriggerProps = {
  children: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
};

function DrawerTrigger({ children }: DrawerTriggerProps) {
  const { onOpen } = useDrawerContext();
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

export type DrawerCloseProps = {
  children: React.ReactElement<{
    onClick?: React.MouseEventHandler;
    className?: string;
  }>;
};

function DrawerClose({ children }: DrawerCloseProps) {
  const { onClose } = useDrawerContext();
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

export type DrawerPortalProps = {
  children: React.ReactNode;
  container?: HTMLElement | null;
};

function DrawerPortal({ children, container }: DrawerPortalProps) {
  const { open } = useDrawerContext();
  if (!open) return null;
  return <Portal container={container}>{children}</Portal>;
}

// ─── Overlay ──────────────────────────────────────────────────────────────────

export type DrawerOverlayProps = React.HTMLAttributes<HTMLDivElement>;

function DrawerOverlay({ className, onClick, ...rest }: DrawerOverlayProps) {
  const { onClose, closeOnOverlayClick } = useDrawerContext();

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented && closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop overlay; keyboard dismiss handled by useEscapeKey in DrawerContent
    <div
      role="presentation"
      className={cx(styles.overlay, className)}
      onClick={handleClick}
      data-testid="drawer-overlay"
      {...rest}
    />
  );
}

// ─── Content ──────────────────────────────────────────────────────────────────

export type DrawerContentProps = React.HTMLAttributes<HTMLDivElement> & {
  side?: DrawerSide;
  size?: DrawerSize;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};

function DrawerContent({
  children,
  className,
  side = "right",
  size = "m",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: DrawerContentProps) {
  const { open, onClose, closeOnEscape } = useDrawerContext();

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
    <DrawerChromeSizeContext.Provider value={size}>
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
        data-side={side}
        className={cx(styles.content, className)}
        {...toDataAttributes({ size })}
        {...rest}
      >
        {children}
      </div>
    </DrawerChromeSizeContext.Provider>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

export type DrawerHeaderProps = React.HTMLAttributes<HTMLElement> & {
  showCloseButton?: boolean;
};

function DrawerHeader({ children, className, showCloseButton = true, ...rest }: DrawerHeaderProps) {
  const { onClose } = useDrawerContext();
  const chromeSize = useDrawerChromeSize();

  return (
    <header className={cx(styles.header, className)} {...rest}>
      <ControlSizeProvider value={chromeSize}>
        <div className={styles.headerContent}>{children}</div>
      </ControlSizeProvider>
      {showCloseButton && (
        <Button.Root
          size={chromeSize}
          variant="neutral"
          mode="ghost"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close drawer"
        >
          <Button.Icon>
            <Icon name="action.close" tone="subtle" />
          </Button.Icon>
        </Button.Root>
      )}
    </header>
  );
}

// ─── Title ────────────────────────────────────────────────────────────────────

export type DrawerTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

function DrawerTitle({ children, className, ...rest }: DrawerTitleProps) {
  return (
    <h2 className={cx(styles.title, className)} {...rest}>
      {children}
    </h2>
  );
}

// ─── Body ─────────────────────────────────────────────────────────────────────

export type DrawerBodyProps = React.HTMLAttributes<HTMLDivElement>;

function DrawerBody({ children, className, ...rest }: DrawerBodyProps) {
  return (
    <ScrollContainer className={cx(styles.body, className)} {...rest}>
      {children}
    </ScrollContainer>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export type DrawerFooterProps = React.HTMLAttributes<HTMLElement>;

function DrawerFooter({ children, className, ...rest }: DrawerFooterProps) {
  const chromeSize = useDrawerChromeSize();

  return (
    <footer className={cx(styles.footer, className)} {...rest}>
      <ControlSizeProvider value={chromeSize}>{children}</ControlSizeProvider>
    </footer>
  );
}

// ─── Namespace export ─────────────────────────────────────────────────────────

export const Drawer = {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Close: DrawerClose,
  Portal: DrawerPortal,
  Overlay: DrawerOverlay,
  Content: DrawerContent,
  Header: DrawerHeader,
  Title: DrawerTitle,
  Body: DrawerBody,
  Footer: DrawerFooter,
};
