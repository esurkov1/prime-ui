import * as React from "react";

import { IconChevronRight } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import type { StepperSize } from "@/internal/states";
import alignStyles from "./StepperAlign.module.css";
import {
  StepperAlignCheckIcon,
  StepperAlignItemProvider,
  type StepperAlignItemState,
  useStepperAlignItemState,
} from "./stepperAlignContext";

export type HorizontalStepperRootProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: StepperSize;
};

function HorizontalStepperRoot({
  className,
  size = "m",
  children,
  ...rest
}: HorizontalStepperRootProps) {
  return (
    <ControlSizeProvider value={size}>
      <div className={cx(alignStyles.hRoot, className)} data-size={size} {...rest}>
        {children}
      </div>
    </ControlSizeProvider>
  );
}

HorizontalStepperRoot.displayName = "HorizontalStepper.Root";

export type HorizontalStepperSeparatorIconProps<
  T extends React.ElementType = typeof IconChevronRight,
> = {
  as?: T;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">;

function HorizontalStepperSeparatorIcon<T extends React.ElementType = typeof IconChevronRight>({
  as,
  className,
  ...rest
}: HorizontalStepperSeparatorIconProps<T>) {
  const Component = (as ?? IconChevronRight) as React.ElementType;

  return (
    <span className={alignStyles.hSeparator} aria-hidden="true">
      <Component className={cx(alignStyles.hSeparatorIcon, className)} strokeWidth={2} {...rest} />
    </span>
  );
}

HorizontalStepperSeparatorIcon.displayName = "HorizontalStepper.SeparatorIcon";

export type HorizontalStepperItemProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> & {
  state?: StepperAlignItemState;
  type?: "button" | "submit" | "reset";
};

const HorizontalStepperItem = React.forwardRef<HTMLButtonElement, HorizontalStepperItemProps>(
  function HorizontalStepperItem(
    { state = "default", className, type = "button", children, ...rest },
    ref,
  ) {
    return (
      <StepperAlignItemProvider value={{ state }}>
        <button
          ref={ref}
          type={type}
          className={cx(alignStyles.hItem, className)}
          data-state={state}
          {...rest}
        >
          {children}
        </button>
      </StepperAlignItemProvider>
    );
  },
);

HorizontalStepperItem.displayName = "HorizontalStepper.Item";

export type HorizontalStepperItemIndicatorProps = React.HTMLAttributes<HTMLDivElement> & {
  state?: StepperAlignItemState;
};

function HorizontalStepperItemIndicator({
  state: stateProp,
  className,
  children,
  ...rest
}: HorizontalStepperItemIndicatorProps) {
  const { state: ctxState } = useStepperAlignItemState();
  const state = stateProp ?? ctxState;

  if (state === "completed") {
    return (
      <div className={cx(alignStyles.hIndicator, className)} data-state={state} {...rest}>
        <StepperAlignCheckIcon className={alignStyles.hCheck} />
      </div>
    );
  }

  return (
    <div className={cx(alignStyles.hIndicator, className)} data-state={state} {...rest}>
      {children}
    </div>
  );
}

HorizontalStepperItemIndicator.displayName = "HorizontalStepper.ItemIndicator";

export const HorizontalStepper = {
  Root: HorizontalStepperRoot,
  SeparatorIcon: HorizontalStepperSeparatorIcon,
  Item: HorizontalStepperItem,
  ItemIndicator: HorizontalStepperItemIndicator,
};
