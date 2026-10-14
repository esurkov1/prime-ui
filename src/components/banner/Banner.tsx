import * as React from "react";

import { Button } from "@/components/button/Button";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon } from "@/icons";
import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import { fieldTierClass } from "@/internal/fieldClasses";
import { iconSlotClass } from "@/internal/iconBox";
import { leaveInPlace } from "@/internal/leaveInPlace";
import { handoffFocus, tabStopBeside } from "@/internal/overlay/focus";
import { type ControlSize, compactTier, type Tone, type Variant } from "@/internal/states";
import { SurfaceDepthProvider, useNestedSurfaceDepth } from "@/internal/surfaceDepth";

import styles from "./Banner.module.css";

export type BannerLabels = {
  /** `aria-label` of the close button. */
  dismiss: string;
};

export const BANNER_LABELS: BannerLabels = { dismiss: "Закрыть" };

/**
 * With `onDismiss` the close button is the small corner button, or — when the banner has
 * `Banner.Actions` — a regular square button at the end of that row, lined up with the others
 * (CSS hides the corner one with `:has(.actions)`).
 */
type BannerContextValue = {
  onDismiss?: () => void;
  size: ControlSize;
  dismissLabel: string;
};

const BannerContext = React.createContext<BannerContextValue | null>(null);

export type BannerRootProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: Exclude<Variant, "ghost">;
  tone?: Tone;
  size?: ControlSize;
  placement?: "inset" | "page";
  onDismiss?: () => void;
  labels?: Partial<BannerLabels>;
  ref?: React.Ref<HTMLDivElement>;
};

function BannerRoot({
  variant = "soft",
  tone = "info",
  size: sizeProp,
  placement = "inset",
  onDismiss,
  labels,
  className,
  children,
  ref,
  ...rest
}: BannerRootProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(rootRef, ref);
  const tier = useHostTier(sizeProp);
  const size = tier.size;
  // Unmounted by its parent (dismissed, condition gone): focus inside moves to the tab stop that
  // takes its place, and a copy closes up in place, so the content below glides up instead of
  // jumping.
  React.useLayoutEffect(() => {
    const node = rootRef.current;
    return () => {
      if (!node) return;
      handoffFocus(node, tabStopBeside(node));
      leaveInPlace(node, "block");
    };
  }, []);
  const dismissLabel = labels?.dismiss ?? BANNER_LABELS.dismiss;
  const context = React.useMemo<BannerContextValue>(
    () => ({ onDismiss, size, dismissLabel }),
    [onDismiss, size, dismissLabel],
  );
  // A tinted banner is a host off the ladder (translucent fills inside); an outline one is a layer.
  const nested = useNestedSurfaceDepth();
  const depth = variant === "outline" ? nested : "tinted";

  return (
    <div
      {...rest}
      ref={mergedRef}
      className={cx(fieldTierClass, styles.root, enterMotion.enter, className)}
      data-depth={depth}
      {...toDataAttributes({ variant, tone, size, placement })}
    >
      <SurfaceDepthProvider value={depth}>
        <BannerContext.Provider value={context}>
          {tier.provide(
            <>
              {children}
              {onDismiss ? (
                <span className={cx(fieldTierClass, styles.close)} data-size={compactTier(size)}>
                  <Button.Root
                    variant="ghost"
                    tone="inherit"
                    size={compactTier(size)}
                    aria-label={dismissLabel}
                    onClick={onDismiss}
                  >
                    <Button.Icon>
                      <Icon name="action.close" />
                    </Button.Icon>
                  </Button.Root>
                </span>
              ) : null}
            </>,
          )}
        </BannerContext.Provider>
      </SurfaceDepthProvider>
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
  return (
    <span className={cx(styles.icon, iconSlotClass, className)} aria-hidden="true" {...rest} />
  );
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
