import * as React from "react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { StepperSize } from "@/internal/states";
import { HorizontalStepper } from "./HorizontalStepper";
import styles from "./Stepper.module.css";
import alignStyles from "./StepperAlign.module.css";
import {
  StepperAlignCheckIcon,
  StepperAlignItemProvider,
  type StepperAlignItemState,
} from "./stepperAlignContext";
import { VerticalStepper } from "./VerticalStepper";

export { HorizontalStepper } from "./HorizontalStepper";
export { VerticalStepper } from "./VerticalStepper";

export type { StepperSize };

export type StepperOrientation = "horizontal" | "vertical";
export type StepStatus = "pending" | "active" | "completed" | "error";

type StepperRootContextValue = {
  orientation: StepperOrientation;
  currentStep: number;
  getNextStepIndex: () => number;
};

type StepperStepContextValue = {
  status: StepStatus;
  index: number;
};

const [StepperRootProvider, useStepperRootContext] =
  createComponentContext<StepperRootContextValue>("Stepper");

const [StepperStepProvider, useStepperStepContext] =
  createComponentContext<StepperStepContextValue>("Stepper.Step");

function toAlignState(status: StepStatus): StepperAlignItemState {
  if (status === "completed") return "completed";
  if (status === "active") return "active";
  return "default";
}

function computeStepStatus(index: number, currentStep: number): StepStatus {
  if (index < currentStep) return "completed";
  if (index === currentStep) return "active";
  return "pending";
}

export type StepperRootProps = {
  orientation?: StepperOrientation;
  currentStep?: number;
  size?: StepperSize;
  children: React.ReactNode;
  className?: string;
};

function StepperRoot({
  orientation = "vertical",
  currentStep = 0,
  size = "m",
  children,
  className,
}: StepperRootProps) {
  const indexRef = React.useRef(0);
  indexRef.current = 0;
  const getNextStepIndex = React.useCallback(() => {
    const idx = indexRef.current;
    indexRef.current += 1;
    return idx;
  }, []);

  const value = React.useMemo(
    () => ({ orientation, currentStep, getNextStepIndex }),
    [orientation, currentStep, getNextStepIndex],
  );

  return (
    <StepperRootProvider value={value}>
      <ControlSizeProvider value={size}>
        <ol
          className={cx(
            styles.root,
            orientation === "horizontal" ? alignStyles.hRoot : alignStyles.vRoot,
            className,
          )}
          {...toDataAttributes({ orientation, size })}
        >
          {children}
        </ol>
      </ControlSizeProvider>
    </StepperRootProvider>
  );
}

StepperRoot.displayName = "Stepper.Root";

export type StepperSeparatorIconProps = {
  className?: string;
};

function StepperSeparatorIcon({ className }: StepperSeparatorIconProps) {
  return (
    <li className={styles.separatorLi} aria-hidden="true">
      <HorizontalStepper.SeparatorIcon className={className} />
    </li>
  );
}

StepperSeparatorIcon.displayName = "Stepper.SeparatorIcon";

export type StepperArrowProps = {
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<typeof VerticalStepper.Arrow>, "className">;

function StepperArrow({ className, ...rest }: StepperArrowProps) {
  return <VerticalStepper.Arrow className={className} {...rest} />;
}

StepperArrow.displayName = "Stepper.Arrow";

export type StepperIndicatorProps = {
  children?: React.ReactNode;
  className?: string;
};

function StepperIndicator({ children, className }: StepperIndicatorProps) {
  const { status, index } = useStepperStepContext();
  const { orientation } = useStepperRootContext();
  const alignState = toAlignState(status);
  const indClass = orientation === "horizontal" ? alignStyles.hIndicator : alignStyles.vIndicator;
  const checkClass = orientation === "horizontal" ? alignStyles.hCheck : alignStyles.vCheck;

  const defaultChild =
    status === "completed" ? <StepperAlignCheckIcon className={checkClass} /> : String(index + 1);

  return (
    <span
      className={cx(indClass, className)}
      data-state={alignState}
      data-legacy-status={status === "error" ? "error" : undefined}
      aria-hidden="true"
    >
      {children ?? defaultChild}
    </span>
  );
}

StepperIndicator.displayName = "Stepper.Indicator";

export type StepperContentProps = {
  title: string;
  description?: string;
  className?: string;
};

function StepperContent({ title, description, className }: StepperContentProps) {
  return (
    <div className={cx(styles.content, className)}>
      <div className={styles.title}>{title}</div>
      {description ? <p className={styles.description}>{description}</p> : null}
    </div>
  );
}

StepperContent.displayName = "Stepper.Content";

export type StepperStepProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  index?: number;
  status?: StepStatus;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
};

const StepperStep = React.forwardRef<HTMLButtonElement, StepperStepProps>(function StepperStep(
  { index: indexProp, status: statusProp, children, className, disabled, type = "button", ...rest },
  ref,
) {
  const { currentStep, orientation, getNextStepIndex } = useStepperRootContext();
  const index = indexProp ?? getNextStepIndex();
  const status = statusProp ?? computeStepStatus(index, currentStep);
  const alignState = toAlignState(status);
  const itemClass = orientation === "horizontal" ? alignStyles.hItem : alignStyles.vItem;

  return (
    <StepperStepProvider value={{ status, index }}>
      <StepperAlignItemProvider value={{ state: alignState }}>
        <li className={styles.stepLi} data-status={status}>
          <button
            ref={ref}
            type={type}
            disabled={disabled}
            className={cx(itemClass, className)}
            data-state={alignState}
            data-legacy-status={status === "error" ? "error" : undefined}
            aria-current={status === "active" ? "step" : undefined}
            {...rest}
          >
            {children}
          </button>
        </li>
      </StepperAlignItemProvider>
    </StepperStepProvider>
  );
});

StepperStep.displayName = "Stepper.Step";

export const Stepper = {
  Root: StepperRoot,
  Step: StepperStep,
  Item: StepperStep,
  Indicator: StepperIndicator,
  ItemIndicator: StepperIndicator,
  Content: StepperContent,
  SeparatorIcon: StepperSeparatorIcon,
  Arrow: StepperArrow,
};
