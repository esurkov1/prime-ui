import * as React from "react";

import { Button } from "@/components/button/Button";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import {
  OverlayPortalLayerProvider,
  useOverlayPortalLayer,
} from "@/internal/OverlayPortalLayerContext";
import { Portal } from "@/internal/Portal";

import styles from "./Drawer.module.css";

const DRAWER_CLOSE_ANIMATION_MS = 220;

export type DrawerSide = "left" | "right";

export type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: DrawerSide;
  className?: string;
  overlayClassName?: string;
};

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  icon,
  children,
  footer,
  side = "right",
  className,
  overlayClassName,
}: DrawerProps) {
  const [isMounted, setIsMounted] = React.useState(open);
  const [isClosing, setIsClosing] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setIsMounted(true);
      setIsClosing(false);
      return;
    }

    if (!isMounted) {
      return;
    }

    setIsClosing(true);
    const timeoutId = window.setTimeout(() => {
      setIsMounted(false);
      setIsClosing(false);
    }, DRAWER_CLOSE_ANIMATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [open, isMounted]);

  const state = open && !isClosing ? "open" : "closing";
  const parentLayer = useOverlayPortalLayer();
  const nestedInModal = parentLayer === "modal";
  const portalLayer = nestedInModal ? "drawerInModal" : "drawer";

  const trapRef = useFocusTrap<HTMLDivElement>({ enabled: open });
  useScrollLock(open);
  useEscapeKey({ enabled: open, onEscape: () => onOpenChange(false) });

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

  const generatedId = React.useId();
  const titleId = `${generatedId}-title`;
  const descriptionId = `${generatedId}-description`;
  const hasDescription = description != null && description !== "";

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && open) {
      onOpenChange(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Portal>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop overlay; keyboard dismiss is handled separately */}
      <div
        role="presentation"
        className={cx(styles.overlay, overlayClassName)}
        data-testid="drawer-overlay"
        onClick={handleOverlayClick}
        {...toDataAttributes({ state })}
        data-nested-in-modal={nestedInModal ? "true" : undefined}
      />

      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={hasDescription ? descriptionId : undefined}
        tabIndex={-1}
        className={cx(styles.panel, className)}
        data-nested-in-modal={nestedInModal ? "true" : undefined}
        {...toDataAttributes({ side, state })}
      >
        <OverlayPortalLayerProvider value={portalLayer}>
          <header className={styles.header}>
            <div className={styles.headerMain}>
              {icon ? <span className={styles.icon}>{icon}</span> : null}
              <div className={styles.titleBlock}>
                <h2 id={titleId} className={styles.title}>
                  {title}
                </h2>
                {hasDescription ? (
                  <p id={descriptionId} className={styles.description}>
                    {description}
                  </p>
                ) : null}
              </div>
            </div>

            <Button.Root
              type="button"
              variant="neutral"
              mode="ghost"
              className={styles.closeButton}
              aria-label="Close drawer"
              onClick={() => onOpenChange(false)}
            >
              <Button.Icon>
                <Icon name="action.close" tone="subtle" />
              </Button.Icon>
            </Button.Root>
          </header>

          <ScrollContainer className={styles.body}>{children}</ScrollContainer>

          {footer ? <footer className={styles.footer}>{footer}</footer> : null}
        </OverlayPortalLayerProvider>
      </div>
    </Portal>
  );
}
