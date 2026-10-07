import { X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize, Tone, Variant } from "@/internal/states";

import styles from "./Banner.module.css";

export type BannerLabels = {
  /** `aria-label` of the close button. */
  dismiss: string;
};

const DEFAULT_LABELS: BannerLabels = { dismiss: "Закрыть" };

const BannerLabelsContext = React.createContext<BannerLabels>(DEFAULT_LABELS);

/**
 * When the banner has actions, dismiss moves into the actions row as a regular square button of the
 * same size, so it lines up with the other buttons; otherwise it is the small corner close.
 */
type BannerDismissContextValue = {
  onDismiss?: () => void;
  size: ControlSize;
  registerActions: () => () => void;
};
const BannerDismissContext = React.createContext<BannerDismissContextValue | null>(null);

export type BannerRootProps = {
  /** Treatment: `soft` tinted fill (default), `solid` saturated fill, `outline` surface with a tone ring. */
  variant?: Exclude<Variant, "ghost">;
  /** Semantic color. Default `info`. */
  tone?: Tone;
  /** Spacing and type tier. Default `m`. */
  size?: ControlSize;
  /**
   * `inset` (default): rounded block in the content flow or inside a card.
   * `page`: edge-to-edge strip (no radius) at the top of a page or app shell; content follows the
   * page content column.
   */
  placement?: "inset" | "page";
  /** Renders a close button (unless `Banner.CloseButton` is already a child) and calls this on click. */
  onDismiss?: () => void;
  /** Built-in strings. */
  labels?: Partial<BannerLabels>;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function childHasCloseButton(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some(
    (c) => React.isValidElement(c) && c.type === BannerCloseButton,
  );
}

const BannerRoot = React.forwardRef<HTMLDivElement, BannerRootProps>(function BannerRoot(
  {
    variant = "soft",
    tone = "info",
    size = "m",
    placement = "inset",
    onDismiss,
    labels: labelsProp,
    className,
    children,
    ...rest
  },
  forwardedRef,
) {
  const [actionsCount, setActionsCount] = React.useState(0);
  const registerActions = React.useCallback(() => {
    setActionsCount((n) => n + 1);
    return () => setActionsCount((n) => n - 1);
  }, []);
  const dismissContext = React.useMemo<BannerDismissContextValue>(
    () => ({ onDismiss, size, registerActions }),
    [onDismiss, size, registerActions],
  );
  const showInjectedClose =
    Boolean(onDismiss) && !childHasCloseButton(children) && actionsCount === 0;
  const dismiss = labelsProp?.dismiss ?? DEFAULT_LABELS.dismiss;
  const labels = React.useMemo<BannerLabels>(() => ({ dismiss }), [dismiss]);

  return (
    <div
      ref={forwardedRef}
      {...rest}
      className={cx(styles.root, className)}
      {...toDataAttributes({ variant, tone, size, placement })}
    >
      <BannerLabelsContext.Provider value={labels}>
        <BannerDismissContext.Provider value={dismissContext}>
          <ControlSizeProvider value={size}>
            {children}
            {showInjectedClose ? <BannerCloseButton onClick={onDismiss} /> : null}
          </ControlSizeProvider>
        </BannerDismissContext.Provider>
      </BannerLabelsContext.Provider>
    </div>
  );
});
BannerRoot.displayName = "BannerRoot";

export type BannerContentProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

/** Layout of the message: icon on the first line, title over description, actions right (under the text when narrow). */
function BannerContent({ className, children, ...rest }: BannerContentProps) {
  return (
    <div className={cx(styles.content, className)} {...rest}>
      {children}
    </div>
  );
}
BannerContent.displayName = "BannerContent";

export type BannerIconProps<T extends React.ElementType = "div"> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">;

function BannerIcon<T extends React.ElementType = "div">({
  as,
  className,
  children,
  ...rest
}: BannerIconProps<T>) {
  const Component = (as ?? "div") as React.ElementType;

  return (
    <Component className={cx(styles.icon, className)} {...rest}>
      {children}
    </Component>
  );
}
BannerIcon.displayName = "BannerIcon";

export type BannerTitleProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>;

function BannerTitle({ className, children, ...rest }: BannerTitleProps) {
  return (
    <span className={cx(styles.title, className)} {...rest}>
      {children}
    </span>
  );
}
BannerTitle.displayName = "BannerTitle";

export type BannerDescriptionProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>;

function BannerDescription({ className, children, ...rest }: BannerDescriptionProps) {
  return (
    <span className={cx(styles.description, className)} {...rest}>
      {children}
    </span>
  );
}
BannerDescription.displayName = "BannerDescription";

export type BannerActionsProps = {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

/** Action buttons take the banner `size`; with `onDismiss` the close button joins this row. */
function BannerActions({ className, children, ...rest }: BannerActionsProps) {
  const dismiss = React.useContext(BannerDismissContext);
  const labels = React.useContext(BannerLabelsContext);
  const register = dismiss?.registerActions;
  const hasDismiss = Boolean(dismiss?.onDismiss);

  React.useLayoutEffect(() => {
    if (!register || !hasDismiss) return;
    return register();
  }, [register, hasDismiss]);

  return (
    <div className={cx(styles.actions, className)} {...rest}>
      {children}
      {dismiss?.onDismiss ? (
        <Button.Root
          variant="outline"
          tone="neutral"
          size={dismiss.size}
          aria-label={labels.dismiss}
          className={styles.actionsClose}
          onClick={dismiss.onDismiss}
        >
          <Button.Icon>
            <X aria-hidden strokeWidth={2} />
          </Button.Icon>
        </Button.Root>
      ) : null}
    </div>
  );
}
BannerActions.displayName = "BannerActions";

export type BannerCloseButtonProps = {
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">;

const BannerCloseButton = React.forwardRef<HTMLButtonElement, BannerCloseButtonProps>(
  function BannerCloseButton(
    { className, children, type = "button", "aria-label": ariaLabel, ...rest },
    forwardedRef,
  ) {
    const labels = React.useContext(BannerLabelsContext);
    return (
      <button
        ref={forwardedRef}
        type={type}
        aria-label={ariaLabel ?? (children == null ? labels.dismiss : undefined)}
        className={cx(styles.closeButton, className)}
        {...rest}
      >
        {children ?? <X className={styles.closeIcon} aria-hidden strokeWidth={2} />}
      </button>
    );
  },
);
BannerCloseButton.displayName = "BannerCloseButton";

export const Banner = {
  Root: BannerRoot,
  Content: BannerContent,
  Icon: BannerIcon,
  Title: BannerTitle,
  Description: BannerDescription,
  Actions: BannerActions,
  CloseButton: BannerCloseButton,
};
