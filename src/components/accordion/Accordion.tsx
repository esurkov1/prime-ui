import * as React from "react";

import { Icon } from "@/icons";
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
  multiple?: false;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** When `false`, the open item cannot be closed by clicking it. Default `true`. */
  collapsible?: boolean;
};

/** Any number of open items; `value` lists them. */
export type AccordionMultipleProps = AccordionBaseProps & {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type AccordionRootProps = AccordionSingleProps | AccordionMultipleProps;

type AccordionContextValue = {
  openValues: string[];
  toggleItem: (value: string) => void;
};

const [AccordionProvider, useAccordionContext] =
  createComponentContext<AccordionContextValue>("Accordion");

type AccordionItemContextValue = {
  value: string;
  disabled: boolean;
  open: boolean;
  triggerId: string;
  contentId: string;
};

const [AccordionItemProvider, useAccordionItem] =
  createComponentContext<AccordionItemContextValue>("Accordion");

const toOpenValues = (value: string | string[] | undefined): string[] | undefined =>
  value === undefined ? undefined : [...new Set([value].flat().filter((entry) => entry !== ""))];

const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionRootProps>(
  function AccordionRoot(props, ref) {
    const {
      multiple = false,
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
    const controlledValues = React.useMemo(() => toOpenValues(value), [value]);
    const [uncontrolledValues, setUncontrolledValues] = React.useState<string[]>(
      () => toOpenValues(defaultValue) ?? [],
    );
    const openValues = controlledValues ?? uncontrolledValues;

    const toggleItem = React.useCallback(
      (itemValue: string) => {
        const isOpen = openValues.includes(itemValue);
        if (!multiple && isOpen && !collapsible) return;
        const next = multiple
          ? isOpen
            ? openValues.filter((entry) => entry !== itemValue)
            : [...openValues, itemValue]
          : isOpen
            ? []
            : [itemValue];
        if (controlledValues === undefined) setUncontrolledValues(next);
        if (multiple) (onValueChange as ((next: string[]) => void) | undefined)?.(next);
        else (onValueChange as ((next: string) => void) | undefined)?.(next[0] ?? "");
      },
      [collapsible, controlledValues, multiple, onValueChange, openValues],
    );

    const contextValue = React.useMemo<AccordionContextValue>(
      () => ({ openValues, toggleItem }),
      [openValues, toggleItem],
    );

    return (
      <AccordionProvider value={contextValue}>
        <div
          ref={ref}
          {...rest}
          className={cx(styles.root, className)}
          {...toDataAttributes({ size, layout })}
        >
          <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
        </div>
      </AccordionProvider>
    );
  },
);
AccordionRoot.displayName = "Accordion.Root";

export type AccordionItemProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
  disabled?: boolean;
};

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { className, value, disabled = false, children, ...rest },
  ref,
) {
  const { openValues } = useAccordionContext();
  const open = openValues.includes(value);
  const reactId = React.useId();

  const itemContextValue = React.useMemo<AccordionItemContextValue>(
    () => ({
      value,
      disabled,
      open,
      triggerId: `prime-accordion-trigger-${reactId}`,
      contentId: `prime-accordion-content-${reactId}`,
    }),
    [disabled, open, reactId, value],
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

export type AccordionHeaderProps = React.HTMLAttributes<HTMLHeadingElement>;

const AccordionHeader = React.forwardRef<HTMLHeadingElement, AccordionHeaderProps>(
  function AccordionHeader({ className, ...rest }, ref) {
    return <h3 ref={ref} className={cx(styles.header, className)} {...rest} />;
  },
);
AccordionHeader.displayName = "Accordion.Header";

export type AccordionTriggerProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">;

/** The item's button: its children, then the chevron that turns when the item opens. */
const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ className, children, onClick, ...rest }, ref) {
    const { toggleItem } = useAccordionContext();
    const item = useAccordionItem();

    return (
      <button
        ref={ref}
        type="button"
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
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) toggleItem(item.value);
        }}
      >
        {children}
        <Icon name="nav.chevronDown" className={styles.chevron} />
      </button>
    );
  },
);
AccordionTrigger.displayName = "Accordion.Trigger";

export type AccordionIconProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/** Decorative leading icon of a trigger; the content lines up with the label after it. */
function AccordionIcon({ className, children, ...rest }: AccordionIconProps) {
  return (
    <span className={cx(styles.icon, className)} aria-hidden="true" {...rest}>
      {children}
    </span>
  );
}
AccordionIcon.displayName = "Accordion.Icon";

export type AccordionContentProps = React.HTMLAttributes<HTMLElement>;

const AccordionContent = React.forwardRef<HTMLElement, AccordionContentProps>(
  function AccordionContent({ className, children, ...rest }, ref) {
    const item = useAccordionItem();

    return (
      <section
        ref={ref}
        id={item.contentId}
        aria-labelledby={item.triggerId}
        aria-hidden={!item.open}
        inert={!item.open}
        data-state={item.open ? "open" : "closed"}
        className={styles.content}
        {...rest}
      >
        {/* The clip animates the height; the padded inner block carries `className`. */}
        <div className={styles.contentClip}>
          <div className={cx(styles.contentInner, className)}>{children}</div>
        </div>
      </section>
    );
  },
);
AccordionContent.displayName = "Accordion.Content";

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Icon: AccordionIcon,
  Content: AccordionContent,
};
