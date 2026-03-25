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

export type VerticalStepperRootProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: StepperSize;
};

function VerticalStepperRoot({
  className,
  size = "m",
  children,
  ...rest
}: VerticalStepperRootProps) {
  return (
    <ControlSizeProvider value={size}>
      <div className={cx(alignStyles.vRoot, className)} data-size={size} {...rest}>
        {children}
      </div>
    </ControlSizeProvider>
  );
}

VerticalStepperRoot.displayName = "VerticalStepper.Root";

export type VerticalStepperArrowProps<T extends React.ElementType = typeof IconChevronRight> = {
  as?: T;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">;

function VerticalStepperArrow<T extends React.ElementType = typeof IconChevronRight>({
  as,
  className,
  ...rest
}: VerticalStepperArrowProps<T>) {
  const Component = (as ?? IconChevronRight) as React.ElementType;

  return <Component className={cx(alignStyles.vArrow, className)} strokeWidth={2} {...rest} />;
}

VerticalStepperArrow.displayName = "VerticalStepper.Arrow";

export type VerticalStepperItemProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> & {
  state?: StepperAlignItemState;
  type?: "button" | "submit" | "reset";
};

const VerticalStepperItem = React.forwardRef<HTMLButtonElement, VerticalStepperItemProps>(
  function VerticalStepperItem(
    { state = "default", className, type = "button", children, ...rest },
    ref,
  ) {
    return (
      <StepperAlignItemProvider value={{ state }}>
        <button
          ref={ref}
          type={type}
          className={cx(alignStyles.vItem, className)}
          data-state={state}
          {...rest}
        >
          {children}
        </button>
      </StepperAlignItemProvider>
    );
  },
);

VerticalStepperItem.displayName = "VerticalStepper.Item";

export type VerticalStepperItemIndicatorProps = React.HTMLAttributes<HTMLDivElement> & {
  state?: StepperAlignItemState;
};

function VerticalStepperItemIndicator({
  state: stateProp,
  className,
  children,
  ...rest
}: VerticalStepperItemIndicatorProps) {
  const { state: ctxState } = useStepperAlignItemState();
  const state = stateProp ?? ctxState;

  if (state === "completed") {
    return (
      <div className={cx(alignStyles.vIndicator, className)} data-state={state} {...rest}>
        <StepperAlignCheckIcon className={alignStyles.vCheck} />
      </div>
    );
  }

  return (
    <div className={cx(alignStyles.vIndicator, className)} data-state={state} {...rest}>
      {children}
    </div>
  );
}

VerticalStepperItemIndicator.displayName = "VerticalStepper.ItemIndicator";

export const VerticalStepper = {
  Root: VerticalStepperRoot,
  Arrow: VerticalStepperArrow,
  Item: VerticalStepperItem,
  ItemIndicator: VerticalStepperItemIndicator,
};
