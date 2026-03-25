import { X } from "lucide-react";
import * as React from "react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { AlertSize } from "@/internal/states";

import styles from "./Alert.module.css";

/** Визуальный стиль (в AlignUI поле `variant`). */
export type AlertAppearance = "filled" | "light" | "lighter" | "stroke";

/** Семантика статуса (в AlignUI `status`). */
export type AlertStatus = "error" | "warning" | "success" | "information" | "feature";

export type { AlertSize };

/** @deprecated Используйте `AlertStatus` и проп `status`. */
export type AlertVariant = AlertStatus;

export type AlertLiveTone = "assertive" | "polite";

function partitionAlertSlots(children: React.ReactNode): {
  icon: React.ReactElement | null;
  close: React.ReactElement | null;
  body: React.ReactNode[];
} {
  const arr = React.Children.toArray(children);
  let firstIconIdx = -1;
  for (let i = 0; i < arr.length; i++) {
    const ch = arr[i];
    if (React.isValidElement(ch) && ch.type === AlertIcon) {
      firstIconIdx = i;
      break;
    }
  }
  let closeIdx = -1;
  for (let i = arr.length - 1; i >= 0; i--) {
    const ch = arr[i];
    if (React.isValidElement(ch) && ch.type === AlertCloseIcon) {
      closeIdx = i;
      break;
    }
  }
  const icon = firstIconIdx >= 0 ? (arr[firstIconIdx] as React.ReactElement) : null;
  const close = closeIdx >= 0 ? (arr[closeIdx] as React.ReactElement) : null;
  const body = arr.filter((_, i) => i !== firstIconIdx && (closeIdx < 0 || i !== closeIdx));
  return { icon, close, body };
}

export type AlertRootProps = {
  /** Визуальный стиль панели (аналог `variant` в AlignUI). */
  appearance?: AlertAppearance;
  status?: AlertStatus;
  size?: AlertSize;
  /** Как объявлять для скринридеров: `polite` — для тостов, `assertive` — для встроенных предупреждений. */
  liveTone?: AlertLiveTone;
  wrapperClassName?: string;
  className?: string;
  children?: React.ReactNode;
  /** Если задано, подменяет вычисленный по `liveTone` `role` (например `presentation` внутри Radix Toast). */
  role?: React.AriaRole;
  "aria-live"?: "off" | "polite" | "assertive";
} & Omit<React.HTMLAttributes<HTMLDivElement>, "role" | "aria-live">;

const AlertRoot = React.forwardRef<HTMLDivElement, AlertRootProps>(function AlertRoot(
  {
    appearance = "light",
    status = "information",
    size = "m",
    liveTone = "assertive",
    wrapperClassName,
    className,
    children,
    role: roleProp,
    "aria-live": ariaLiveProp,
    ...rest
  },
  forwardedRef,
) {
  const { icon, close, body } = partitionAlertSlots(children);
  const hasIcon = icon !== null;
  const hasClose = close !== null;

  const defaultRole = liveTone === "polite" ? "status" : "alert";
  const defaultAriaLive = liveTone === "polite" ? ("polite" as const) : ("assertive" as const);
  const a11yRole = roleProp ?? defaultRole;
  const ariaLive =
    ariaLiveProp ?? (a11yRole === "presentation" ? ("off" as const) : defaultAriaLive);

  return (
    <div
      ref={forwardedRef}
      {...rest}
      className={cx(styles.root, className)}
      role={a11yRole}
      aria-live={ariaLive}
      {...toDataAttributes({ appearance, status, size })}
    >
      <div
        className={cx(styles.wrapper, wrapperClassName)}
        data-has-icon={hasIcon ? "true" : "false"}
        data-has-close={hasClose ? "true" : "false"}
      >
        <ControlSizeProvider value={size}>
          {icon}
          <div className={styles.body}>{body}</div>
          {hasClose ? <div className={styles.closeWrap}>{close}</div> : null}
        </ControlSizeProvider>
      </div>
    </div>
  );
});
AlertRoot.displayName = "AlertRoot";

export type AlertIconProps<T extends React.ElementType = "span"> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

function AlertIcon<T extends React.ElementType = "span">({
  as,
  className,
  children,
  ...rest
}: AlertIconProps<T>) {
  const Component = (as ?? "span") as React.ElementType;
  return (
    <Component className={cx(styles.icon, className)} {...rest}>
      {children}
    </Component>
  );
}
AlertIcon.displayName = "AlertIcon";

const defaultClose = X;

export type AlertCloseIconProps<T extends React.ElementType = typeof defaultClose> = {
  as?: T;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">;

function AlertCloseIcon<T extends React.ElementType = typeof defaultClose>({
  as,
  className,
  ...rest
}: AlertCloseIconProps<T>) {
  const Component = (as ?? defaultClose) as React.ElementType;
  return <Component className={cx(styles.closeIcon, className)} aria-hidden {...rest} />;
}
AlertCloseIcon.displayName = "AlertCloseIcon";

export type AlertTitleProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>;

function AlertTitle({ className, children, ...rest }: AlertTitleProps) {
  return (
    <span className={cx(styles.title, className)} {...rest}>
      {children}
    </span>
  );
}
AlertTitle.displayName = "AlertTitle";

export type AlertDescriptionProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLParagraphElement>;

function AlertDescription({ className, children, ...rest }: AlertDescriptionProps) {
  return (
    <p className={cx(styles.description, className)} {...rest}>
      {children}
    </p>
  );
}
AlertDescription.displayName = "AlertDescription";

export type AlertActionsProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function AlertActions({ className, children, ...rest }: AlertActionsProps) {
  return (
    <div className={cx(styles.actions, className)} {...rest}>
      {children}
    </div>
  );
}
AlertActions.displayName = "AlertActions";

export const Alert = {
  Root: AlertRoot,
  Icon: AlertIcon,
  CloseIcon: AlertCloseIcon,
  Title: AlertTitle,
  Description: AlertDescription,
  Actions: AlertActions,
};
