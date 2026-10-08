import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize } from "@/internal/states";

import styles from "./Stepper.module.css";

/** Item state: derived from the Root `value` (before → `completed`, equal → `active`, after → `pending`) unless set on the item. */
export type StepperItemStatus = "pending" | "active" | "completed" | "danger";

type StepperRootContextValue = {
  value: number;
  select: (index: number) => void;
};

const [StepperRootProvider, useStepperRootContext] =
  createComponentContext<StepperRootContextValue>("Stepper");

type StepperItemContextValue = { index: number; status: StepperItemStatus };

const [StepperItemProvider, useStepperItemContext] =
  createComponentContext<StepperItemContextValue>("Stepper.Item");

/** Index of an item, assigned by `Stepper.Root` from the order of its direct `Stepper.Item` children. */
const StepperIndexContext = React.createContext<number | null>(null);

function deriveStatus(index: number, current: number): StepperItemStatus {
  if (index < current) return "completed";
  if (index === current) return "active";
  return "pending";
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export type StepperRootProps = Omit<
  React.OlHTMLAttributes<HTMLOListElement>,
  "defaultValue" | "onChange"
> & {
  /** Default `vertical`. A horizontal stepper stacks vertically in containers narrower than 480px. */
  orientation?: "horizontal" | "vertical";
  /** Current step (0-based), controlled. */
  value?: number;
  /** Initial step when uncontrolled. Default `0`. */
  defaultValue?: number;
  /** Called with the item index when an item is clicked. */
  onValueChange?: (index: number) => void;
  size?: ControlSize;
  ref?: React.Ref<HTMLOListElement>;
};

function StepperRoot({
  orientation = "vertical",
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  size = "m",
  children,
  className,
  ...rest
}: StepperRootProps) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const contextValue = React.useMemo(() => ({ value, select: setValue }), [value, setValue]);

  let nextIndex = 0;
  const items: React.ReactNode[] = [];
  for (const child of React.Children.toArray(children)) {
    if (!React.isValidElement(child) || child.type !== StepperItem) {
      items.push(child);
      continue;
    }
    const index = nextIndex;
    nextIndex += 1;
    items.push(
      <StepperIndexContext.Provider key={child.key} value={index}>
        {child}
      </StepperIndexContext.Provider>,
    );
  }

  return (
    <StepperRootProvider value={contextValue}>
      <ControlSizeProvider value={size}>
        <ol
          {...rest}
          className={cx(styles.root, className)}
          {...toDataAttributes({ orientation, size })}
        >
          {items}
        </ol>
      </ControlSizeProvider>
    </StepperRootProvider>
  );
}
StepperRoot.displayName = "Stepper.Root";

// ─── Item ─────────────────────────────────────────────────────────────────────

export type StepperItemProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  /** Overrides the status derived from the Root `value` (e.g. `danger`). */
  status?: StepperItemStatus;
  ref?: React.Ref<HTMLButtonElement>;
};

function StepperItem({
  status: statusProp,
  children,
  className,
  disabled,
  onClick,
  ...rest
}: StepperItemProps) {
  const { value, select } = useStepperRootContext();
  const index = React.useContext(StepperIndexContext);
  if (index === null) {
    throw new Error("Stepper.Item must be a direct child of Stepper.Root");
  }
  const status = statusProp ?? deriveStatus(index, value);
  const itemContext = React.useMemo(() => ({ index, status }), [index, status]);

  return (
    <StepperItemProvider value={itemContext}>
      <li className={styles.item}>
        {/* Decorative chevron in front of the step; CSS shows it only between horizontal steps. */}
        <span className={styles.separator} aria-hidden="true">
          <Icon name="nav.chevronRight" className={styles.separatorIcon} strokeWidth={2} />
        </span>
        <button
          {...rest}
          type="button"
          disabled={disabled}
          className={cx(styles.step, className)}
          {...toDataAttributes({ status, disabled: disabled || undefined })}
          aria-current={status === "active" ? "step" : undefined}
          onClick={(event) => {
            onClick?.(event);
            if (!event.defaultPrevented) select(index);
          }}
        >
          {children}
        </button>
      </li>
    </StepperItemProvider>
  );
}
StepperItem.displayName = "Stepper.Item";

// ─── Parts ────────────────────────────────────────────────────────────────────

type SpanProps = React.HTMLAttributes<HTMLSpanElement> & { ref?: React.Ref<HTMLSpanElement> };

export type StepperIndicatorProps = SpanProps & {
  /** Replaces the default content (the item number, or a check when completed). */
  children?: React.ReactNode;
};

function StepperIndicator({ children, className, ...rest }: StepperIndicatorProps) {
  const { status, index } = useStepperItemContext();
  return (
    <span
      {...rest}
      className={cx(styles.indicator, className)}
      data-status={status}
      aria-hidden="true"
    >
      {children ??
        (status === "completed" ? (
          <Icon name="action.check" className={styles.check} strokeWidth={2} />
        ) : (
          index + 1
        ))}
    </span>
  );
}
StepperIndicator.displayName = "Stepper.Indicator";

export type StepperContentProps = SpanProps;

/** Text column: `Stepper.Title` and optional `Stepper.Description`. */
function StepperContent({ className, ...rest }: StepperContentProps) {
  return <span {...rest} className={cx(styles.content, className)} />;
}
StepperContent.displayName = "Stepper.Content";

export type StepperTitleProps = SpanProps;

function StepperTitle({ className, ...rest }: StepperTitleProps) {
  return <span {...rest} className={cx(styles.title, className)} />;
}
StepperTitle.displayName = "Stepper.Title";

export type StepperDescriptionProps = SpanProps;

function StepperDescription({ className, ...rest }: StepperDescriptionProps) {
  return <span {...rest} className={cx(styles.description, className)} />;
}
StepperDescription.displayName = "Stepper.Description";

export type StepperArrowProps = Omit<React.SVGAttributes<SVGSVGElement>, "children"> & {
  ref?: React.Ref<SVGSVGElement>;
};

/** Trailing chevron for vertical items that open a page or panel. */
function StepperArrow({ className, ...rest }: StepperArrowProps) {
  return (
    <Icon
      {...rest}
      name="nav.chevronRight"
      className={cx(styles.arrow, className)}
      strokeWidth={2}
    />
  );
}
StepperArrow.displayName = "Stepper.Arrow";

export const Stepper = {
  Root: StepperRoot,
  Item: StepperItem,
  Indicator: StepperIndicator,
  Content: StepperContent,
  Title: StepperTitle,
  Description: StepperDescription,
  Arrow: StepperArrow,
};
