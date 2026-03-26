import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useOverlayPortalLayer } from "@/internal/OverlayPortalLayerContext";
import { Portal } from "@/internal/Portal";

import styles from "./Tooltip.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TooltipSize = "s" | "m" | "l" | "xl";
export type TooltipSide = "top" | "bottom" | "left" | "right";

// ─── Provider Context ─────────────────────────────────────────────────────────

type TooltipProviderContextValue = {
  delayDuration: number;
};

const TooltipProviderContext = React.createContext<TooltipProviderContextValue>({
  delayDuration: 400,
});

// ─── Root Context ─────────────────────────────────────────────────────────────

type TooltipRootContextValue = {
  isOpen: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentId: string;
  handleOpen: () => void;
  handleClose: () => void;
};

const [TooltipRootProvider, useTooltipRootContext] =
  createComponentContext<TooltipRootContextValue>("Tooltip");

// ─── Provider ─────────────────────────────────────────────────────────────────

export type TooltipProviderProps = {
  delayDuration?: number;
  children: React.ReactNode;
};

function TooltipProvider({ delayDuration = 400, children }: TooltipProviderProps) {
  const value = React.useMemo(() => ({ delayDuration }), [delayDuration]);
  return (
    <TooltipProviderContext.Provider value={value}>{children}</TooltipProviderContext.Provider>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export type TooltipRootProps = {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function TooltipRoot({ children, open, defaultOpen, onOpenChange }: TooltipRootProps) {
  const { delayDuration } = React.useContext(TooltipProviderContext);

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen ?? false,
    onChange: onOpenChange,
  });

  const triggerRef = React.useRef<HTMLElement | null>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const contentId = React.useId();

  const handleOpen = React.useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsOpen(true), delayDuration);
  }, [delayDuration, setIsOpen]);

  const handleClose = React.useCallback(() => {
    clearTimeout(timeoutRef.current);
    setIsOpen(false);
  }, [setIsOpen]);

  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <TooltipRootProvider value={{ isOpen, triggerRef, contentId, handleOpen, handleClose }}>
      {children}
    </TooltipRootProvider>
  );
}

// ─── Trigger ─────────────────────────────────────────────────────────────────

export type TooltipTriggerProps = {
  children: React.ReactElement;
  className?: string;
};

function TooltipTrigger({ children, className }: TooltipTriggerProps) {
  const { triggerRef, contentId, handleOpen, handleClose } = useTooltipRootContext();
  const props = children.props as React.HTMLAttributes<HTMLElement> & {
    ref?: React.Ref<HTMLElement>;
  };

  return React.cloneElement(
    children as React.ReactElement<
      React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>
    >,
    {
      ref: triggerRef,
      className: cx(props.className, className) || undefined,
      "aria-describedby": contentId,
      onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
        props.onMouseEnter?.(e);
        handleOpen();
      },
      onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
        props.onMouseLeave?.(e);
        handleClose();
      },
      onFocus: (e: React.FocusEvent<HTMLElement>) => {
        props.onFocus?.(e);
        handleOpen();
      },
      onBlur: (e: React.FocusEvent<HTMLElement>) => {
        props.onBlur?.(e);
        handleClose();
      },
    },
  );
}

// ─── Positioning ──────────────────────────────────────────────────────────────

const TOOLTIP_OFFSET = 6;

type TooltipCoords = { top: number; left: number };

function computePosition(
  anchor: HTMLElement,
  content: HTMLElement,
  side: TooltipSide,
): TooltipCoords {
  const ar = anchor.getBoundingClientRect();
  const cr = content.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let top: number;
  let left: number;

  switch (side) {
    case "top":
      top = ar.top - cr.height - TOOLTIP_OFFSET;
      left = ar.left + ar.width / 2 - cr.width / 2;
      break;
    case "bottom":
      top = ar.bottom + TOOLTIP_OFFSET;
      left = ar.left + ar.width / 2 - cr.width / 2;
      break;
    case "left":
      top = ar.top + ar.height / 2 - cr.height / 2;
      left = ar.left - cr.width - TOOLTIP_OFFSET;
      break;
    case "right":
      top = ar.top + ar.height / 2 - cr.height / 2;
      left = ar.right + TOOLTIP_OFFSET;
      break;
  }

  return {
    top: Math.round(Math.max(8, Math.min(top, vh - cr.height - 8))),
    left: Math.round(Math.max(8, Math.min(left, vw - cr.width - 8))),
  };
}

// ─── Content ─────────────────────────────────────────────────────────────────

export type TooltipContentProps = {
  children: React.ReactNode;
  size?: TooltipSize;
  side?: TooltipSide;
  className?: string;
};

function TooltipContent({ children, size = "m", side = "top", className }: TooltipContentProps) {
  const { isOpen, triggerRef, contentId } = useTooltipRootContext();
  const overlayPortalLayer = useOverlayPortalLayer();
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = React.useState<TooltipCoords | null>(null);

  React.useEffect(() => {
    if (!isOpen) {
      setCoords(null);
      return;
    }

    const update = () => {
      const anchor = triggerRef.current;
      const content = contentRef.current;
      if (!anchor || !content) return;
      setCoords(computePosition(anchor, content, side));
    };

    const frameId = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [isOpen, triggerRef, side]);

  if (!isOpen) return null;

  const positionStyle: React.CSSProperties = {
    position: "fixed",
    top: coords?.top ?? 0,
    left: coords?.left ?? 0,
  };

  return (
    <Portal>
      <div
        ref={contentRef}
        id={contentId}
        role="tooltip"
        data-overlay-portal-layer={overlayPortalLayer}
        className={cx(styles.content, className)}
        style={positionStyle}
        {...toDataAttributes({ size, side })}
      >
        <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
      </div>
    </Portal>
  );
}

// ─── Exports ──────────────────────────────────────────────────────────────────

TooltipProvider.displayName = "Tooltip.Provider";
TooltipRoot.displayName = "Tooltip.Root";
TooltipTrigger.displayName = "Tooltip.Trigger";
TooltipContent.displayName = "Tooltip.Content";

export const Tooltip = {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
};
