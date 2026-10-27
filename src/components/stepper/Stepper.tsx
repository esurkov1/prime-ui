import * as React from "react";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useControllableState } from "@/hooks/useControllableState";
import { Check } from "@/icons/glyphs/check";
import { ChevronRight } from "@/icons/glyphs/chevron-right";
import { CircleX } from "@/icons/glyphs/circle-x";

import { useHostTier } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { fieldTierClass } from "@/internal/fieldClasses";
import { GlyphSwap } from "@/internal/glyphSwap";
import { useLabels } from "@/internal/labels";
import { press } from "@/internal/press";
import type { ControlSize } from "@/internal/states";
import { touchTargetClass, touchTargetRowClass } from "@/internal/touchTarget";

import styles from "./Stepper.module.css";

/** Item state: derived from the Root `value` (before → `completed`, equal → `current`, after → `pending`) unless set on the item. */
export type StepperItemStatus = "pending" | "current" | "completed" | "danger";

export type StepperLabels = {
  /** Spoken after the name of a completed step (the check is only seen). */
  completed: string;
  /** Spoken after the name of a step that needs attention (the colour and the glyph are only seen). */
  danger: string;
};

export const STEPPER_LABELS: StepperLabels = {
  completed: "пройден",
  danger: "требует внимания",
};

type StepperOrientation = "horizontal" | "vertical";

type StepperRootContextValue = {
  value: number;
  select: (index: number) => void;
  orientation: StepperOrientation;
  arrows: boolean;
  labels: StepperLabels;
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
  if (index === current) return "current";
  return "pending";
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export type StepperRootProps = Omit<
  React.OlHTMLAttributes<HTMLOListElement>,
  "defaultValue" | "onChange"
> & {
  orientation?: StepperOrientation;
  value?: number;
  defaultValue?: number;
  onValueChange?: (index: number) => void;
  arrows?: boolean;
  size?: ControlSize;
  labels?: Partial<StepperLabels>;
  ref?: React.Ref<HTMLOListElement>;
};

function StepperRoot({
  orientation = "vertical",
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  arrows = false,
  size: sizeProp,
  labels: labelsProp,
  children,
  className,
  ...rest
}: StepperRootProps) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const labels = useLabels(STEPPER_LABELS, labelsProp);
  const tier = useHostTier(sizeProp);
  const contextValue = React.useMemo(
    () => ({ value, select: setValue, orientation, arrows, labels }),
    [value, setValue, orientation, arrows, labels],
  );

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
      {tier.provide(
        <ol
          // biome-ignore lint/a11y/noRedundantRoles: `list-style: none` drops the list semantics in WebKit; the role keeps them
          role="list"
          {...rest}
          className={cx(fieldTierClass, styles.root, className)}
          {...toDataAttributes({ orientation, size: tier.size })}
        >
          {items}
        </ol>,
      )}
    </StepperRootProvider>
  );
}
StepperRoot.displayName = "Stepper.Root";

// ─── Item ─────────────────────────────────────────────────────────────────────

export type StepperItemProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
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
  const { value, select, orientation, arrows, labels } = useStepperRootContext();
  const index = React.useContext(StepperIndexContext);
  if (index === null) {
    throw new Error("Stepper.Item must be a direct child of Stepper.Root");
  }
  const status = statusProp ?? deriveStatus(index, value);
  const itemContext = React.useMemo(() => ({ index, status }), [index, status]);
  // The check and the danger glyph are only seen: the status is spoken with the name.
  const spokenStatus =
    status === "completed" ? labels.completed : status === "danger" ? labels.danger : null;

  return (
    <StepperItemProvider value={itemContext}>
      <li className={styles.item}>
        {/* Decorative chevron in front of the step; CSS shows it only between horizontal steps. */}
        <span className={styles.separator} aria-hidden="true">
          <ChevronRight strokeWidth={2} />
        </span>
        <button
          {...rest}
          type="button"
          disabled={disabled}
          className={cx(
            styles.step,
            press.press,
            orientation === "vertical" ? touchTargetRowClass : touchTargetClass,
            className,
          )}
          {...toDataAttributes({ status, disabled: disabled || undefined })}
          aria-current={status === "current" ? "step" : undefined}
          onClick={(event) => {
            onClick?.(event);
            if (!event.defaultPrevented) select(index);
          }}
        >
          {children}
          {spokenStatus === null ? null : <VisuallyHidden>{`, ${spokenStatus}`}</VisuallyHidden>}
          {/* A vertical row that opens a page or panel ends with a chevron (`arrows`). */}
          {arrows && orientation === "vertical" ? (
            <span className={styles.arrow} aria-hidden="true">
              <ChevronRight strokeWidth={2} />
            </span>
          ) : null}
        </button>
      </li>
    </StepperItemProvider>
  );
}
StepperItem.displayName = "Stepper.Item";

// ─── Parts ────────────────────────────────────────────────────────────────────

type SpanProps = React.HTMLAttributes<HTMLSpanElement> & { ref?: React.Ref<HTMLSpanElement> };

export type StepperIndicatorProps = SpanProps & {
  children?: React.ReactNode;
};

/** The default glyph of a status: the step number, a check, or the danger mark. */
function statusGlyph(status: StepperItemStatus, index: number): React.ReactNode {
  if (status === "completed") return <Check strokeWidth={2} />;
  if (status === "danger") return <CircleX />;
  return index + 1;
}

function StepperIndicator({ children, className, ...rest }: StepperIndicatorProps) {
  const { status, index } = useStepperItemContext();
  return (
    <span
      {...rest}
      className={cx(styles.indicator, className)}
      data-status={status}
      aria-hidden="true"
    >
      <GlyphSwap>{children ?? statusGlyph(status, index)}</GlyphSwap>
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

export const Stepper = {
  Root: StepperRoot,
  Item: StepperItem,
  Indicator: StepperIndicator,
  Content: StepperContent,
  Title: StepperTitle,
  Description: StepperDescription,
};
