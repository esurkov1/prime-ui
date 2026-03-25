import { ChevronDown } from "lucide-react";
import * as React from "react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import type { AccordionSize } from "@/internal/states";

import styles from "./Accordion.module.css";

export type AccordionType = "single" | "multiple";

export type { AccordionSize };

export type AccordionRootProps = React.HTMLAttributes<HTMLDivElement> & {
  type?: AccordionType;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  /** Только для `type="single"`. Если `false`, в одиночном режиме нельзя закрыть открытый пункт. По умолчанию `true`. */
  collapsible?: boolean;
  /** Размер триггера, иконок и отступов контента. По умолчанию `m`. */
  size?: AccordionSize;
  /** Групповой список без зазоров (`grouped`) или отдельные карточки (`separate`). */
  layout?: "grouped" | "separate";
};

type AccordionContextValue = { size: AccordionSize };

const [AccordionProvider, useAccordionContext] =
  createComponentContext<AccordionContextValue>("Accordion");

type AccordionStateContextValue = {
  type: AccordionType;
  collapsible: boolean;
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

export type AccordionArrowProps = React.HTMLAttributes<HTMLSpanElement> & {
  openIcon?: React.ElementType<{ className?: string; strokeWidth?: number | string }>;
  closeIcon?: React.ElementType<{ className?: string; strokeWidth?: number | string }>;
};

function singleControlledValue(value: string | string[] | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return value[0] ?? "";
  return value;
}

function singleDefaultValue(defaultValue: string | string[] | undefined): string | undefined {
  if (defaultValue === undefined) return undefined;
  if (Array.isArray(defaultValue)) return defaultValue[0] ?? "";
  return defaultValue;
}

function multipleControlledValue(value: string | string[] | undefined): string[] | undefined {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return value;
  return value === "" ? [] : [value];
}

function multipleDefaultValue(defaultValue: string | string[] | undefined): string[] | undefined {
  if (defaultValue === undefined) return undefined;
  if (Array.isArray(defaultValue)) return defaultValue;
  return defaultValue === "" ? [] : [defaultValue];
}

function normalizeValues(values: string[]): string[] {
  return Array.from(new Set(values.filter((value) => value !== "")));
}

const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionRootProps>(function AccordionRoot(
  {
    type = "single",
    value,
    defaultValue,
    onValueChange,
    collapsible = true,
    size = "m",
    layout = "grouped",
    className,
    children,
    ...rest
  },
  ref,
) {
  const contextValue = React.useMemo(() => ({ size }), [size]);
  const isMultiple = type === "multiple";
  const isControlled = value !== undefined;

  const initialUncontrolledValues = React.useMemo(() => {
    if (isMultiple) return normalizeValues(multipleDefaultValue(defaultValue) ?? []);
    const initialSingle = singleDefaultValue(defaultValue);
    return initialSingle ? [initialSingle] : [];
  }, [defaultValue, isMultiple]);

  const [uncontrolledValues, setUncontrolledValues] =
    React.useState<string[]>(initialUncontrolledValues);

  const controlledValues = React.useMemo(() => {
    if (!isControlled) return undefined;
    if (isMultiple) return normalizeValues(multipleControlledValue(value) ?? []);
    const singleValue = singleControlledValue(value);
    return singleValue ? [singleValue] : [];
  }, [isControlled, isMultiple, value]);

  const openValues = controlledValues ?? uncontrolledValues;

  const updateValues = React.useCallback(
    (nextValues: string[]) => {
      if (!isControlled) {
        setUncontrolledValues(nextValues);
      }

      if (isMultiple) {
        onValueChange?.(nextValues);
      } else {
        onValueChange?.(nextValues[0] ?? "");
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
    () => ({
      type,
      collapsible,
      openValues,
      toggleItem,
    }),
    [collapsible, openValues, toggleItem, type],
  );

  return (
    <AccordionStateProvider value={stateContextValue}>
      <AccordionProvider value={contextValue}>
        <div
          ref={ref}
          className={cx(styles.root, className)}
          data-size={size}
          data-type={type}
          data-layout={layout}
          {...rest}
        >
          {children}
        </div>
      </AccordionProvider>
    </AccordionStateProvider>
  );
});
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
        className={cx(styles.item, className)}
        data-state={open ? "open" : "closed"}
        data-disabled={disabled ? "" : undefined}
        {...rest}
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
        data-state={item.open ? "open" : "closed"}
        data-disabled={item.disabled ? "" : undefined}
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
  openIcon: OpenIcon = ChevronDown,
  closeIcon: CloseIcon,
  ...rest
}: AccordionArrowProps) {
  const isRotatingChevron = CloseIcon == null || CloseIcon === OpenIcon;

  if (isRotatingChevron) {
    return (
      <span className={cx(styles.arrow, className)} {...rest}>
        <OpenIcon
          aria-hidden
          className={cx(styles.arrowIcon, styles.arrowIconRotate)}
          strokeWidth={1.75}
        />
      </span>
    );
  }

  return (
    <span className={cx(styles.arrow, className)} {...rest}>
      <OpenIcon
        aria-hidden
        className={cx(styles.arrowIcon, styles.arrowIconClosed)}
        strokeWidth={1.75}
      />
      <CloseIcon
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
