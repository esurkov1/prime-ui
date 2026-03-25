import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { CSS_PX_SUFFIX } from "@/internal/runtimeUnits";
import type { InputSize } from "@/internal/states";

import styles from "./SegmentedControl.module.css";

/**
 * Резолвит длину в px для `width: <expression>` (токены/calc на корне).
 * block — отступ пилюли сверху/снизу от сегмента; inline — слева/справа (fallback = block).
 */
function readCssWidthPx(root: HTMLElement, widthExpression: string): number {
  const doc = root.ownerDocument;
  const win = doc.defaultView;
  if (!win) return 0;

  const probe = doc.createElement("div");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;left:0;top:0;width:${widthExpression};height:0;margin:0;padding:0;border:0;box-sizing:content-box`;

  root.appendChild(probe);
  const px = probe.offsetWidth;
  root.removeChild(probe);
  return Number.isFinite(px) ? px : 0;
}

// ─── Context ─────────────────────────────────────────────────────────────────

type SegmentedControlContextValue = {
  value: string;
  onSelect: (value: string) => void;
  rootDisabled: boolean;
};

const [SegmentedControlProvider, useSegmentedControlContext] =
  createComponentContext<SegmentedControlContextValue>("SegmentedControl");

// ─── Root ─────────────────────────────────────────────────────────────────────

export type SegmentedControlRootProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  size?: InputSize;
  children: React.ReactNode;
  className?: string;
};

function SegmentedControlRoot({
  value,
  defaultValue = "",
  onValueChange,
  disabled = false,
  size = "m",
  children,
  className,
}: SegmentedControlRootProps) {
  const [selectedValue, setSelectedValue] = useControllableState<string>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const [indicator, setIndicator] = React.useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const [animate, setAnimate] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const indicatorRef = React.useRef<HTMLDivElement>(null);

  const onSelect = React.useCallback(
    (nextValue: string) => {
      setAnimate(true);
      setSelectedValue(nextValue);
    },
    [setSelectedValue],
  );

  React.useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const update = () => {
      const active = root.querySelector<HTMLElement>('[role="radio"][aria-checked="true"]');
      if (!active) {
        setIndicator({ left: 0, top: 0, width: 0, height: 0 });
        return;
      }

      const insetBlock = readCssWidthPx(root, "var(--prime-seg-indicator-inset-block)");
      const insetInline = readCssWidthPx(
        root,
        "var(--prime-seg-indicator-inset-inline, var(--prime-seg-indicator-inset-block))",
      );
      const left = active.offsetLeft + insetInline;
      const top = active.offsetTop + insetBlock;
      const width = Math.max(2, active.offsetWidth - 2 * insetInline);
      const height = Math.max(2, active.offsetHeight - 2 * insetBlock);
      setIndicator({ left, top, width, height });
    };

    update();

    const mo = new MutationObserver(update);
    mo.observe(root, {
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-checked", "data-disabled"],
    });

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      ro.observe(root);
    }

    return () => {
      mo.disconnect();
      ro?.disconnect();
    };
  }, []);

  React.useEffect(() => {
    if (!animate) return;
    const id = window.setTimeout(() => setAnimate(false), 320);
    return () => window.clearTimeout(id);
  }, [animate]);

  React.useLayoutEffect(() => {
    const indicatorEl = indicatorRef.current;
    if (!indicatorEl) return;

    indicatorEl.style.transform = `translate3d(${indicator.left}px, ${indicator.top}px, 0)`;
    indicatorEl.style.width = indicator.width > 0 ? `${indicator.width}${CSS_PX_SUFFIX}` : "0";
    indicatorEl.style.height = indicator.height > 0 ? `${indicator.height}${CSS_PX_SUFFIX}` : "0";
  }, [indicator.height, indicator.left, indicator.top, indicator.width]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();

    const container = e.currentTarget;
    const items = Array.from(
      container.querySelectorAll<HTMLButtonElement>('[role="radio"]:not([data-disabled="true"])'),
    );
    if (!items.length) return;

    const activeEl = document.activeElement as HTMLButtonElement;
    const idx = items.indexOf(activeEl);

    if (idx === -1) {
      const target = e.key === "ArrowRight" ? items[0] : items[items.length - 1];
      target?.focus();
      const tv = target?.dataset.value;
      if (tv) onSelect(tv);
      return;
    }

    const next =
      e.key === "ArrowRight" ? (idx + 1) % items.length : (idx - 1 + items.length) % items.length;

    const nextItem = items[next];
    nextItem?.focus();
    const nextValue = nextItem?.dataset.value;
    if (nextValue) onSelect(nextValue);
  };

  const hasSelection = selectedValue !== "";

  return (
    <SegmentedControlProvider value={{ value: selectedValue, onSelect, rootDisabled: disabled }}>
      <div
        ref={containerRef}
        role="radiogroup"
        aria-disabled={disabled || undefined}
        tabIndex={!disabled && !hasSelection ? 0 : -1}
        className={cx(styles.root, className)}
        onKeyDown={handleKeyDown}
        data-disabled={disabled ? "true" : undefined}
        data-size={size}
        data-animate={animate ? "true" : undefined}
      >
        <ControlSizeProvider value={size}>{children}</ControlSizeProvider>

        <div ref={indicatorRef} className={styles.indicator} aria-hidden="true" />
      </div>
    </SegmentedControlProvider>
  );
}

SegmentedControlRoot.displayName = "SegmentedControl.Root";

// ─── Item ─────────────────────────────────────────────────────────────────────

export type SegmentedControlItemProps = {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
};

function SegmentedControlItem({
  value,
  disabled = false,
  children,
  className,
}: SegmentedControlItemProps) {
  const ctx = useSegmentedControlContext();
  const isChecked = ctx.value === value;
  const isDisabled = ctx.rootDisabled || disabled;

  return (
    // biome-ignore lint/a11y/useSemanticElements: compound component intentionally uses role="radio" with roving tabindex
    <button
      role="radio"
      type="button"
      aria-checked={isChecked}
      aria-disabled={isDisabled || undefined}
      data-disabled={isDisabled ? "true" : undefined}
      data-value={value}
      tabIndex={isChecked && !isDisabled ? 0 : -1}
      disabled={isDisabled}
      className={cx(styles.item, className)}
      onClick={() => {
        if (!isDisabled) ctx.onSelect(value);
      }}
    >
      {children}
    </button>
  );
}

SegmentedControlItem.displayName = "SegmentedControl.Item";

// ─── Icon ─────────────────────────────────────────────────────────────────────

export type SegmentedControlIconProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

function SegmentedControlIcon({ children, className, ...rest }: SegmentedControlIconProps) {
  return (
    <span className={cx(styles.icon, className)} aria-hidden="true" {...rest}>
      {children}
    </span>
  );
}

SegmentedControlIcon.displayName = "SegmentedControl.Icon";

// ─── Export ───────────────────────────────────────────────────────────────────

export const SegmentedControl = {
  Root: SegmentedControlRoot,
  Item: SegmentedControlItem,
  Icon: SegmentedControlIcon,
};
