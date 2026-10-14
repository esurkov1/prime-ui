import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { Icon } from "@/icons";
import { useHostTier } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { useDisclosure } from "@/internal/Disclosure";
import { toDataAttributes } from "@/internal/data-attributes";
import { iconSlotClass } from "@/internal/iconBox";
import type { ControlSize } from "@/internal/states";
import { SurfaceDepthProvider, useNestedSurfaceDepth } from "@/internal/surfaceDepth";
import { touchTargetRowClass } from "@/internal/touchTarget";

import styles from "./Accordion.module.css";

type AccordionBaseProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> & {
  size?: ControlSize;
  layout?: "grouped" | "separate";
  ref?: React.Ref<HTMLDivElement>;
};

/** One open item at a time; `value` is the open item (`""` when all are closed). */
export type AccordionSingleProps = AccordionBaseProps & {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  collapsible?: boolean;
};

/** Any number of open items; `value` lists them. */
export type AccordionMultipleProps = AccordionBaseProps & {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  collapsible?: never;
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

function AccordionRoot(props: AccordionRootProps) {
  const controlled = React.useMemo(() => toOpenValues(props.value), [props.value]);
  const [openValues, setOpenValues] = useControllableState<string[]>({
    value: controlled,
    defaultValue: toOpenValues(props.defaultValue) ?? [],
    onChange: (next) => {
      if (props.multiple) props.onValueChange?.(next);
      else props.onValueChange?.(next[0] ?? "");
    },
  });
  const collapsible = props.multiple || (props.collapsible ?? true);

  const toggleItem = React.useCallback(
    (itemValue: string) => {
      const isOpen = openValues.includes(itemValue);
      if (!props.multiple && isOpen && !collapsible) return;
      if (props.multiple) {
        setOpenValues(
          isOpen ? openValues.filter((entry) => entry !== itemValue) : [...openValues, itemValue],
        );
      } else {
        setOpenValues(isOpen ? [] : [itemValue]);
      }
    },
    [collapsible, openValues, props.multiple, setOpenValues],
  );

  const contextValue = React.useMemo<AccordionContextValue>(
    () => ({ openValues, toggleItem }),
    [openValues, toggleItem],
  );

  const {
    multiple: _multiple,
    value: _value,
    defaultValue: _defaultValue,
    onValueChange: _onValueChange,
    collapsible: _collapsible,
    size: sizeProp,
    layout = "grouped",
    className,
    children,
    ...rest
  } = props;
  const depth = useNestedSurfaceDepth();
  const tier = useHostTier(sizeProp);

  return (
    <AccordionProvider value={contextValue}>
      <div
        {...rest}
        className={cx(styles.root, className)}
        data-depth={depth}
        {...toDataAttributes({ size: tier.size, layout })}
      >
        <SurfaceDepthProvider value={depth}>{tier.provide(children)}</SurfaceDepthProvider>
      </div>
    </AccordionProvider>
  );
}
AccordionRoot.displayName = "Accordion.Root";

export type AccordionItemProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
  disabled?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

function AccordionItem({
  className,
  value,
  disabled = false,
  children,
  ...rest
}: AccordionItemProps) {
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
        {...rest}
        className={cx(styles.item, className)}
        {...toDataAttributes({ state: open ? "open" : "closed", disabled: disabled || undefined })}
      >
        {children}
      </div>
    </AccordionItemProvider>
  );
}
AccordionItem.displayName = "Accordion.Item";

/** The level of an item's heading in the page outline. */
export type AccordionHeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6";

export type AccordionHeaderProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: AccordionHeadingLevel;
  ref?: React.Ref<HTMLHeadingElement>;
};

function AccordionHeader({ as: Heading = "h3", className, ...rest }: AccordionHeaderProps) {
  return <Heading {...rest} className={cx(styles.header, className)} />;
}
AccordionHeader.displayName = "Accordion.Header";

export type AccordionTriggerProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  ref?: React.Ref<HTMLButtonElement>;
};

/** The item's button: its children, then the chevron that turns when the item opens. */
function AccordionTrigger({ className, children, onClick, ...rest }: AccordionTriggerProps) {
  const { toggleItem } = useAccordionContext();
  const item = useAccordionItem();

  return (
    <button
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
      className={cx(styles.trigger, touchTargetRowClass, className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggleItem(item.value);
      }}
    >
      {children}
      <Icon name="nav.chevronDown" className={styles.chevron} />
    </button>
  );
}
AccordionTrigger.displayName = "Accordion.Trigger";

export type AccordionIconProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/** Decorative leading icon of a trigger; the content lines up with the label after it. */
function AccordionIcon({ className, children, ...rest }: AccordionIconProps) {
  return (
    <span {...rest} className={cx(styles.icon, iconSlotClass, className)} aria-hidden="true">
      {children}
    </span>
  );
}
AccordionIcon.displayName = "Accordion.Icon";

export type AccordionContentProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<HTMLElement>;
};

function AccordionContent({ className, children, ...rest }: AccordionContentProps) {
  const item = useAccordionItem();
  // The kit fold: the height glides and the body fades in place; `.content` sets its clocks. Its
  // ref only serves `appear`, so the section keeps the consumer's ref.
  const fold = useDisclosure({ open: item.open });

  return (
    <section
      {...rest}
      id={item.contentId}
      aria-labelledby={item.triggerId}
      // `inert` takes closed content out of the tab order and the accessibility tree.
      inert={!item.open}
      data-state={fold.root["data-state"]}
      data-mounted={fold.root["data-mounted"]}
      className={cx(fold.root.className, styles.content)}
    >
      {/* The padded inner block carries `className`. */}
      <div className={fold.clip.className}>
        <div className={cx(styles.contentInner, className)}>{children}</div>
      </div>
    </section>
  );
}
AccordionContent.displayName = "Accordion.Content";

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Icon: AccordionIcon,
  Content: AccordionContent,
};
