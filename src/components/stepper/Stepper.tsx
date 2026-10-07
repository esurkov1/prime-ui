import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { IconChevronRight } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize } from "@/internal/states";

import styles from "./Stepper.module.css";

/** Step state: derived from the Root `value` (before → `completed`, equal → `active`, after → `pending`) unless set on the step. */
export type StepperStepStatus = "pending" | "active" | "completed" | "error";

type StepperRootContextValue = {
  orientation: "horizontal" | "vertical";
  value: number;
  select: (index: number) => void;
};

const [StepperRootProvider, useStepperRootContext] =
  createComponentContext<StepperRootContextValue>("Stepper");

type StepperStepContextValue = { index: number; status: StepperStepStatus };

const [StepperStepProvider, useStepperStepContext] =
  createComponentContext<StepperStepContextValue>("Stepper.Step");

/** Index of a step, assigned by `Stepper.Root` from the order of its direct `Stepper.Step` children. */
const StepperIndexContext = React.createContext<number | null>(null);

function deriveStatus(index: number, current: number): StepperStepStatus {
  if (index < current) return "completed";
  if (index === current) return "active";
  return "pending";
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export type StepperRootProps = {
  /** Default `vertical`. A horizontal stepper stacks vertically in containers narrower than 480px. */
  orientation?: "horizontal" | "vertical";
  /** Current step (0-based), controlled. */
  value?: number;
  /** Initial step when uncontrolled. Default `0`. */
  defaultValue?: number;
  /** Called with the step index when a step is clicked. */
  onValueChange?: (index: number) => void;
  size?: ControlSize;
  /** `Stepper.Step` elements as direct children (an array from `map` is fine). */
  children: React.ReactNode;
  className?: string;
} & Omit<React.OlHTMLAttributes<HTMLOListElement>, "children" | "defaultValue" | "onChange">;

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
  const contextValue = React.useMemo(
    () => ({ orientation, value, select: setValue }),
    [orientation, value, setValue],
  );

  let nextIndex = 0;
  const items: React.ReactNode[] = [];
  for (const child of React.Children.toArray(children)) {
    if (!React.isValidElement(child) || child.type !== StepperStep) {
      items.push(child);
      continue;
    }
    const index = nextIndex;
    nextIndex += 1;
    if (orientation === "horizontal" && index > 0) {
      items.push(
        <li key={`separator-${child.key}`} className={styles.separator} aria-hidden="true">
          <IconChevronRight className={styles.separatorIcon} strokeWidth={2} />
        </li>,
      );
    }
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

// ─── Step ─────────────────────────────────────────────────────────────────────

export type StepperStepProps = {
  /** Overrides the status derived from the Root `value` (e.g. `error`). */
  status?: StepperStepStatus;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children">;

const StepperStep = React.forwardRef<HTMLButtonElement, StepperStepProps>(function StepperStep(
  { status: statusProp, children, className, disabled, onClick, ...rest },
  ref,
) {
  const { value, select } = useStepperRootContext();
  const index = React.useContext(StepperIndexContext);
  if (index === null) {
    throw new Error("Stepper.Step must be a direct child of Stepper.Root");
  }
  const status = statusProp ?? deriveStatus(index, value);
  const stepContext = React.useMemo(() => ({ index, status }), [index, status]);

  return (
    <StepperStepProvider value={stepContext}>
      <li className={styles.item}>
        <button
          {...rest}
          ref={ref}
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
    </StepperStepProvider>
  );
});
StepperStep.displayName = "Stepper.Step";

// ─── Parts ────────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg
      className={styles.check}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5.5 12.5l4.25 4.25L18.5 8"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type StepperIndicatorProps = {
  /** Replaces the default content (step number, or a check when completed). */
  children?: React.ReactNode;
  className?: string;
};

function StepperIndicator({ children, className }: StepperIndicatorProps) {
  const { status, index } = useStepperStepContext();
  return (
    <span className={cx(styles.indicator, className)} data-status={status} aria-hidden="true">
      {children ?? (status === "completed" ? <CheckIcon /> : index + 1)}
    </span>
  );
}
StepperIndicator.displayName = "Stepper.Indicator";

export type StepperContentProps = {
  children: React.ReactNode;
  className?: string;
};

/** Text column: `Stepper.Title` and optional `Stepper.Description`. */
function StepperContent({ children, className }: StepperContentProps) {
  return <span className={cx(styles.content, className)}>{children}</span>;
}
StepperContent.displayName = "Stepper.Content";

export type StepperTitleProps = {
  children: React.ReactNode;
  className?: string;
};

function StepperTitle({ children, className }: StepperTitleProps) {
  return <span className={cx(styles.title, className)}>{children}</span>;
}
StepperTitle.displayName = "Stepper.Title";

export type StepperDescriptionProps = {
  children: React.ReactNode;
  className?: string;
};

function StepperDescription({ children, className }: StepperDescriptionProps) {
  return <span className={cx(styles.description, className)}>{children}</span>;
}
StepperDescription.displayName = "Stepper.Description";

export type StepperArrowProps = {
  className?: string;
};

/** Trailing chevron for vertical steps that open a page or panel. */
function StepperArrow({ className }: StepperArrowProps) {
  return <IconChevronRight className={cx(styles.arrow, className)} strokeWidth={2} aria-hidden />;
}
StepperArrow.displayName = "Stepper.Arrow";

export const Stepper = {
  Root: StepperRoot,
  Step: StepperStep,
  Indicator: StepperIndicator,
  Content: StepperContent,
  Title: StepperTitle,
  Description: StepperDescription,
  Arrow: StepperArrow,
};
