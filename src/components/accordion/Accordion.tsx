import { ChevronDown } from "lucide-react";
import * as React from "react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize } from "@/internal/states";

import styles from "./Accordion.module.css";

type AccordionBaseProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> & {
  /** Trigger, icon and content spacing tier. Default `m`. */
  size?: ControlSize;
  /** `grouped` — one frame without gaps (default); `separate` — every item is its own card. */
  layout?: "grouped" | "separate";
};

/** One open item at a time; `value` is the open item (`""` when all are closed). */
export type AccordionSingleProps = AccordionBaseProps & {
  type?: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** When `false`, the open item cannot be closed by clicking it. Default `true`. */
  collapsible?: boolean;
};

/** Any number of open items; `value` lists them. */
export type AccordionMultipleProps = AccordionBaseProps & {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type AccordionRootProps = AccordionSingleProps | AccordionMultipleProps;

type AccordionContextValue = { size: ControlSize };

const [AccordionProvider, useAccordionContext] =
  createComponentContext<AccordionContextValue>("Accordion");

type AccordionStateContextValue = {
  openValues: string[];
  toggleItem: (value: string, disabled: boolean) => void;
};

const [AccordionStateProvider, useAccordionState] =
  createComponentContext<AccordionStateContextValue>("Accordion");

type AccordionItemContextValue = {
  value: string;
  disabled: boolean;
  open: boolean;
  triggerId: string;
  contentId: string;
};

const [AccordionItemProvider, useAccordionItem] =
  createComponentContext<AccordionItemContextValue>("Accordion");

export type AccordionItemProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
  disabled?: boolean;
};

export type AccordionHeaderProps = React.HTMLAttributes<HTMLHeadingElement>;

export type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

export type AccordionIconProps<T extends React.ElementType = "div"> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">;

type ArrowIcon = React.ElementType<{ className?: string; strokeWidth?: number | string }>;

export type AccordionArrowProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** Glyph; rotates 180° when the item opens. Default `ChevronDown`. */
  icon?: ArrowIcon;
  /** Glyph shown instead of `icon` while open (e.g. `Plus` → `Minus`); disables the rotation. */
  openIcon?: ArrowIcon;
};

function toOpenValues(value: string | string[] | undefined): string[] | undefined {
  if (value === undefined) return undefined;
  const list = Array.isArray(value) ? value : [value];
  return Array.from(new Set(list.filter((entry) => entry !== "")));
}

const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionRootProps>(
  function AccordionRoot(props, ref) {
    const {
      type = "single",
      value,
      defaultValue,
      onValueChange,
      size = "m",
      layout = "grouped",
      className,
      children,
      ...restWithCollapsible
    } = props;
    const { collapsible = true, ...rest } = restWithCollapsible as typeof restWithCollapsible & {
      collapsible?: boolean;
    };
    const contextValue = React.useMemo(() => ({ size }), [size]);
    const isMultiple = type === "multiple";
    const controlledValues = React.useMemo(() => toOpenValues(value), [value]);

    const [uncontrolledValues, setUncontrolledValues] = React.useState<string[]>(
      () => toOpenValues(defaultValue) ?? [],
    );

    const openValues = controlledValues ?? uncontrolledValues;
    const isControlled = controlledValues !== undefined;

    const updateValues = React.useCallback(
      (nextValues: string[]) => {
        if (!isControlled) {
          setUncontrolledValues(nextValues);
        }
        if (isMultiple) {
          (onValueChange as ((next: string[]) => void) | undefined)?.(nextValues);
        } else {
          (onValueChange as ((next: string) => void) | undefined)?.(nextValues[0] ?? "");
        }
      },
      [isControlled, isMultiple, onValueChange],
    );

    const toggleItem = React.useCallback(
      (itemValue: string, disabledItem: boolean) => {
        if (disabledItem) return;

        if (isMultiple) {
          if (openValues.includes(itemValue)) {
            updateValues(openValues.filter((valueEntry) => valueEntry !== itemValue));
            return;
          }

          updateValues([...openValues, itemValue]);
          return;
        }

        const currentValue = openValues[0];
        if (currentValue === itemValue) {
          if (!collapsible) return;
          updateValues([]);
          return;
        }

        updateValues([itemValue]);
      },
      [collapsible, isMultiple, openValues, updateValues],
    );

    const stateContextValue = React.useMemo<AccordionStateContextValue>(
      () => ({ openValues, toggleItem }),
      [openValues, toggleItem],
    );

    return (
      <AccordionStateProvider value={stateContextValue}>
        <AccordionProvider value={contextValue}>
          <div
            ref={ref}
            {...rest}
            className={cx(styles.root, className)}
            {...toDataAttributes({ size, layout })}
          >
            {children}
          </div>
        </AccordionProvider>
      </AccordionStateProvider>
    );
  },
);
AccordionRoot.displayName = "Accordion.Root";

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { className, value, disabled = false, children, ...rest },
  ref,
) {
  const state = useAccordionState();
  const open = state.openValues.includes(value);
  const reactId = React.useId();
  const triggerId = `prime-accordion-trigger-${reactId}`;
  const contentId = `prime-accordion-content-${reactId}`;

  const itemContextValue = React.useMemo<AccordionItemContextValue>(
    () => ({
      value,
      disabled,
      open,
      triggerId,
      contentId,
    }),
    [contentId, disabled, open, triggerId, value],
  );

  return (
    <AccordionItemProvider value={itemContextValue}>
      <div
        ref={ref}
        {...rest}
        className={cx(styles.item, className)}
        {...toDataAttributes({ state: open ? "open" : "closed", disabled: disabled || undefined })}
      >
        {children}
      </div>
    </AccordionItemProvider>
  );
});
AccordionItem.displayName = "Accordion.Item";

const AccordionHeader = React.forwardRef<HTMLHeadingElement, AccordionHeaderProps>(
  function AccordionHeader({ className, ...rest }, ref) {
    return <h3 ref={ref} className={cx(styles.header, className)} {...rest} />;
  },
);
AccordionHeader.displayName = "Accordion.Header";

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ className, children, ...rest }, ref) {
    const { size } = useAccordionContext();
    const state = useAccordionState();
    const item = useAccordionItem();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      rest.onClick?.(event);
      if (event.defaultPrevented) return;
      state.toggleItem(item.value, item.disabled);
    };

    return (
      <button
        ref={ref}
        type={rest.type ?? "button"}
        {...rest}
        id={item.triggerId}
        disabled={item.disabled}
        aria-controls={item.contentId}
        aria-expanded={item.open}
        {...toDataAttributes({
          state: item.open ? "open" : "closed",
          disabled: item.disabled || undefined,
        })}
        className={cx(styles.trigger, className)}
        onClick={handleClick}
      >
        <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
      </button>
    );
  },
);
AccordionTrigger.displayName = "Accordion.Trigger";

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent({ className, children, style, ...rest }, ref) {
    const { size } = useAccordionContext();
    const item = useAccordionItem();
    const innerRef = React.useRef<HTMLDivElement | null>(null);
    const [contentHeight, setContentHeight] = React.useState(0);

    React.useLayoutEffect(() => {
      if (!innerRef.current) return;
      const target = innerRef.current;
      setContentHeight(target.scrollHeight);

      if (typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(() => {
        setContentHeight(target.scrollHeight);
      });
      observer.observe(target);
      return () => observer.disconnect();
    }, []);

    const combinedStyle = React.useMemo<React.CSSProperties>(
      () => ({
        ...style,
        "--prime-accordion-content-height": `${contentHeight}px`,
      }),
      [contentHeight, style],
    );

    const setRefs = (node: HTMLDivElement | null) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    return (
      <section
        ref={setRefs}
        id={item.contentId}
        aria-labelledby={item.triggerId}
        aria-hidden={!item.open}
        data-state={item.open ? "open" : "closed"}
        className={styles.content}
        style={combinedStyle}
        {...rest}
      >
        <div ref={innerRef} className={cx(styles.contentInner, className)}>
          <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
        </div>
      </section>
    );
  },
);
AccordionContent.displayName = "Accordion.Content";

function AccordionIcon<T extends React.ElementType = "div">({
  as,
  className,
  children,
  ...rest
}: AccordionIconProps<T>) {
  const Component = (as ?? "div") as React.ElementType;

  return (
    <Component className={cx(styles.icon, className)} {...rest}>
      {children}
    </Component>
  );
}
AccordionIcon.displayName = "Accordion.Icon";

function AccordionArrow({
  className,
  icon: Icon = ChevronDown,
  openIcon: OpenIcon,
  ...rest
}: AccordionArrowProps) {
  if (OpenIcon == null) {
    return (
      <span className={cx(styles.arrow, className)} {...rest}>
        <Icon
          aria-hidden
          className={cx(styles.arrowIcon, styles.arrowIconRotate)}
          strokeWidth={1.75}
        />
      </span>
    );
  }

  return (
    <span className={cx(styles.arrow, className)} {...rest}>
      <Icon
        aria-hidden
        className={cx(styles.arrowIcon, styles.arrowIconClosed)}
        strokeWidth={1.75}
      />
      <OpenIcon
        aria-hidden
        className={cx(styles.arrowIcon, styles.arrowIconOpen)}
        strokeWidth={1.75}
      />
    </span>
  );
}
AccordionArrow.displayName = "Accordion.Arrow";

export const Accordion = {
  Root: AccordionRoot,
  Header: AccordionHeader,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Icon: AccordionIcon,
  Arrow: AccordionArrow,
  Content: AccordionContent,
};
