import * as React from "react";

import { Button } from "@/components/button/Button";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { ControlSizeProvider, useOptionalControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { type ControlSize, stepDown } from "@/internal/states";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./DescriptionList.module.css";

export type DescriptionListLabels = {
  /** Visible mark of an empty value (muted, hidden from assistive tech). */
  empty: string;
  /** What assistive tech reads for an empty value. */
  emptyText: string;
};

const DEFAULT_LABELS: DescriptionListLabels = { empty: "—", emptyText: "Не указано" };

/**
 * `horizontal` — the label beside its value, stacking when the list is narrower than 24rem;
 * `vertical` — the label above its value at any width.
 */
export type DescriptionListOrientation = "horizontal" | "vertical";

type Ctx = { size: ControlSize; labels: DescriptionListLabels };

const DescriptionListContext = React.createContext<Ctx>({ size: "m", labels: DEFAULT_LABELS });

export type DescriptionListRootProps = React.HTMLAttributes<HTMLDListElement> & {
  /** Text and spacing tier. Default: the host tier (a Card, a Drawer form), else `m`. */
  size?: ControlSize;
  /** Default `horizontal`. */
  orientation?: DescriptionListOrientation;
  labels?: Partial<DescriptionListLabels>;
  ref?: React.Ref<HTMLDListElement>;
};

/** A read-only list of «label — value» pairs: a `<dl>` that adapts to its own width. */
function DescriptionListRoot({
  size: sizeProp,
  orientation = "horizontal",
  labels,
  className,
  children,
  ...rest
}: DescriptionListRootProps) {
  const hostSize = useOptionalControlSize();
  const size = sizeProp ?? hostSize ?? "m";
  return (
    <dl
      {...rest}
      className={cx(styles.root, className)}
      {...toDataAttributes({ size, orientation })}
    >
      <DescriptionListContext.Provider value={{ size, labels: { ...DEFAULT_LABELS, ...labels } }}>
        <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
      </DescriptionListContext.Provider>
    </dl>
  );
}
DescriptionListRoot.displayName = "DescriptionList.Root";

export type DescriptionListItemProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** The visible name of the value (`<dt>`). */
  label: React.ReactNode;
  /**
   * The value (`<dd>`) and an optional `DescriptionList.ItemAction`. No value (`null`, `""`,
   * `false`) shows `labels.empty`.
   */
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

const isEmptyValue = (node: React.ReactNode) =>
  node === null || node === undefined || node === false || node === "";

/** One pair: a `<div>` holding the `<dt>` and the `<dd>`; the row action sits at the end of the value. */
function DescriptionListItem({ label, children, className, ...rest }: DescriptionListItemProps) {
  const { labels } = React.useContext(DescriptionListContext);
  const parts = React.Children.toArray(children);
  const action = parts.find(
    (child) => React.isValidElement(child) && child.type === DescriptionListItemAction,
  );
  const value = parts.filter((child) => child !== action);
  const empty = value.length === 0 || value.every(isEmptyValue);

  return (
    <div {...rest} className={cx(styles.item, className)}>
      <dt className={styles.label}>{label}</dt>
      <dd className={styles.value} data-empty={empty || undefined}>
        <span className={styles.text}>
          {empty ? (
            <>
              <span aria-hidden="true">{labels.empty}</span>
              <VisuallyHidden>{labels.emptyText}</VisuallyHidden>
            </>
          ) : (
            value
          )}
        </span>
        {action}
      </dd>
    </div>
  );
}
DescriptionListItem.displayName = "DescriptionList.Item";

export type DescriptionListItemActionProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  /** Accessible name and tooltip of the action («Копировать», «Позвонить»). */
  label: string;
  /** The icon (`<Icon name="…" />`). */
  children: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
};

/** A ghost icon Button one tier below the list, with its `label` as the tooltip. */
function DescriptionListItemAction({
  label,
  children,
  className,
  ...rest
}: DescriptionListItemActionProps) {
  const { size } = React.useContext(DescriptionListContext);
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button.Root
          {...rest}
          variant="ghost"
          tone="neutral"
          size={stepDown(size)}
          className={cx(styles.action, className)}
          aria-label={label}
        >
          <Button.Icon>{children}</Button.Icon>
        </Button.Root>
      </Tooltip.Trigger>
      <Tooltip.Content>{label}</Tooltip.Content>
    </Tooltip.Root>
  );
}
DescriptionListItemAction.displayName = "DescriptionList.ItemAction";

export const DescriptionList = {
  Root: DescriptionListRoot,
  Item: DescriptionListItem,
  ItemAction: DescriptionListItemAction,
};
