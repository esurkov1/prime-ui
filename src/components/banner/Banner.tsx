import * as React from "react";

import { Button } from "@/components/button/Button";
import { Icon } from "@/icons";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize, Tone, Variant } from "@/internal/states";

import styles from "./Banner.module.css";

export type BannerLabels = {
  /** `aria-label` of the close button. */
  dismiss: string;
};

const BANNER_LABELS: BannerLabels = { dismiss: "Закрыть" };

/**
 * With `onDismiss` the close button is the small corner button, or — when the banner has
 * `Banner.Actions` — a regular square button at the end of that row, lined up with the others.
 */
type BannerContextValue = {
  onDismiss?: () => void;
  size: ControlSize;
  dismissLabel: string;
  registerActions: () => () => void;
};

const BannerContext = React.createContext<BannerContextValue | null>(null);

/** The corner close is a compact ghost button: one tier below the banner, never under `xs`. */
const CORNER_CLOSE_SIZE: Record<ControlSize, ControlSize> = {
  xs: "xs",
  s: "xs",
  m: "xs",
  l: "s",
  xl: "s",
};

export type BannerRootProps = React.HTMLAttributes<HTMLDivElement> & {
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
  /** Renders a close button and calls this on its click. */
  onDismiss?: () => void;
  labels?: Partial<BannerLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

function BannerRoot({
  variant = "soft",
  tone = "info",
  size = "m",
  placement = "inset",
  onDismiss,
  labels,
  className,
  children,
  ...rest
}: BannerRootProps) {
  const [actionsCount, setActionsCount] = React.useState(0);
  const registerActions = React.useCallback(() => {
    setActionsCount((n) => n + 1);
    return () => setActionsCount((n) => n - 1);
  }, []);
  const dismissLabel = labels?.dismiss ?? BANNER_LABELS.dismiss;
  const context = React.useMemo<BannerContextValue>(
    () => ({ onDismiss, size, dismissLabel, registerActions }),
    [onDismiss, size, dismissLabel, registerActions],
  );

  return (
    <div
      {...rest}
      className={cx(styles.root, className)}
      {...toDataAttributes({ variant, tone, size, placement })}
    >
      <BannerContext.Provider value={context}>
        <ControlSizeProvider value={size}>
          {children}
          {onDismiss && actionsCount === 0 ? (
            <Button.Root
              variant="ghost"
              tone="inherit"
              size={CORNER_CLOSE_SIZE[size]}
              aria-label={dismissLabel}
              className={styles.close}
              onClick={onDismiss}
            >
              <Button.Icon>
                <Icon name="action.close" />
              </Button.Icon>
            </Button.Root>
          ) : null}
        </ControlSizeProvider>
      </BannerContext.Provider>
    </div>
  );
}
BannerRoot.displayName = "Banner.Root";

export type BannerContentProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** Layout of the message: icon on the first line, title over description, actions right (under the text when narrow). */
function BannerContent({ className, ...rest }: BannerContentProps) {
  return <div className={cx(styles.content, className)} {...rest} />;
}
BannerContent.displayName = "Banner.Content";

export type BannerIconProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** Holds one `Icon` on the first text line, in the tone color. */
function BannerIcon({ className, ...rest }: BannerIconProps) {
  return <span className={cx(styles.icon, className)} aria-hidden="true" {...rest} />;
}
BannerIcon.displayName = "Banner.Icon";

export type BannerTitleProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

function BannerTitle({ className, ...rest }: BannerTitleProps) {
  return <span className={cx(styles.title, className)} {...rest} />;
}
BannerTitle.displayName = "Banner.Title";

export type BannerDescriptionProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

function BannerDescription({ className, ...rest }: BannerDescriptionProps) {
  return <span className={cx(styles.description, className)} {...rest} />;
}
BannerDescription.displayName = "Banner.Description";

export type BannerActionsProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** Action buttons take the banner `size`; with `onDismiss` the close button joins this row. */
function BannerActions({ className, children, ...rest }: BannerActionsProps) {
  const banner = React.useContext(BannerContext);
  const register = banner?.registerActions;
  const hasDismiss = Boolean(banner?.onDismiss);

  React.useLayoutEffect(() => {
    if (!register || !hasDismiss) return;
    return register();
  }, [register, hasDismiss]);

  return (
    <div className={cx(styles.actions, className)} {...rest}>
      {children}
      {banner?.onDismiss ? (
        <Button.Root
          variant="outline"
          tone="neutral"
          size={banner.size}
          aria-label={banner.dismissLabel}
          className={styles.actionsClose}
          onClick={banner.onDismiss}
        >
          <Button.Icon>
            <Icon name="action.close" />
          </Button.Icon>
        </Button.Root>
      ) : null}
    </div>
  );
}
BannerActions.displayName = "Banner.Actions";

export const Banner = {
  Root: BannerRoot,
  Content: BannerContent,
  Icon: BannerIcon,
  Title: BannerTitle,
  Description: BannerDescription,
  Actions: BannerActions,
};
