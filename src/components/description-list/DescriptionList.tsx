import * as React from "react";

import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { fieldTierClass } from "@/internal/fieldClasses";
import { RowAction } from "@/internal/RowAction";
import type { ControlSize } from "@/internal/states";

import styles from "./DescriptionList.module.css";

export type DescriptionListLabels = {
  /** Visible mark of an empty value (muted, hidden from assistive tech). */
  empty: string;
  /** What assistive tech reads for an empty value. */
  emptyText: string;
};

export const DESCRIPTION_LIST_LABELS: DescriptionListLabels = {
  empty: "—",
  emptyText: "Не указано",
};

/**
 * `horizontal` — the label beside its value, stacking when the list is narrower than 24rem;
 * `vertical` — the label above its value at any width.
 */
export type DescriptionListOrientation = "horizontal" | "vertical";

/**
 * `start` — values in their column from its start edge; `end` — each value at the end of its row
 * in tabular figures, the label at the start (a summary of amounts).
 */
export type DescriptionListAlign = "start" | "end";

type Ctx = { size: ControlSize; labels: DescriptionListLabels };

const DescriptionListContext = React.createContext<Ctx>({
  size: "m",
  labels: DESCRIPTION_LIST_LABELS,
});

export type DescriptionListRootProps = React.HTMLAttributes<HTMLDListElement> & {
  size?: ControlSize;
  orientation?: DescriptionListOrientation;
  align?: DescriptionListAlign;
  labels?: Partial<DescriptionListLabels>;
  ref?: React.Ref<HTMLDListElement>;
};

/** A read-only list of «label — value» pairs: a `<dl>` that adapts to its own width. */
function DescriptionListRoot({
  size: sizeProp,
  orientation = "horizontal",
  align = "start",
  labels,
  className,
  children,
  ...rest
}: DescriptionListRootProps) {
  const { size, provide } = useHostTier(sizeProp);
  return (
    <dl
      {...rest}
      className={cx(fieldTierClass, styles.root, className)}
      {...toDataAttributes({ size, orientation, align: align === "end" ? align : undefined })}
    >
      <DescriptionListContext.Provider
        value={{ size, labels: { ...DESCRIPTION_LIST_LABELS, ...labels } }}
      >
        {provide(children)}
      </DescriptionListContext.Provider>
    </dl>
  );
}
DescriptionListRoot.displayName = "DescriptionList.Root";

export type DescriptionListItemProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  label: React.ReactNode;
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
        {action ? <span className={styles.action}>{action}</span> : null}
      </dd>
    </div>
  );
}
DescriptionListItem.displayName = "DescriptionList.Item";

export type DescriptionListItemActionProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  label: string;
  children: React.ReactNode;
  asChild?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * The kit row action (`internal/RowAction`): a ghost icon Button one tier below the list, centred
 * on the value's first line.
 */
function DescriptionListItemAction({ label, children, ...rest }: DescriptionListItemActionProps) {
  const { size } = React.useContext(DescriptionListContext);
  return (
    <RowAction {...rest} label={label} size={size}>
      {children}
    </RowAction>
  );
}
DescriptionListItemAction.displayName = "DescriptionList.ItemAction";

export const DescriptionList = {
  Root: DescriptionListRoot,
  Item: DescriptionListItem,
  ItemAction: DescriptionListItemAction,
};
