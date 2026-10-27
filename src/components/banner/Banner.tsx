import * as React from "react";
import { Button } from "@/components/button/Button";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { X } from "@/icons/glyphs/x";

import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import { HeaderRowContent, headerRowStyles } from "@/internal/headerRow";
import { iconSlotClass } from "@/internal/iconBox";
import { leaveInPlace } from "@/internal/leaveInPlace";
import { handoffFocus, tabStopBeside } from "@/internal/overlay/focus";
import { useEnterOnAppear } from "@/internal/partPresence";
import { flattenChildren, isPart } from "@/internal/parts";
import type { ControlSize, Tone, Variant } from "@/internal/states";
import { SurfaceDepthProvider, useNestedSurfaceDepth } from "@/internal/surfaceDepth";
import { FRAME_DESCRIPTION, FRAME_TITLE, surfaceFrameClass } from "@/internal/surfaceFrame";

import styles from "./Banner.module.css";

export type BannerLabels = {
  /** `aria-label` of the close button. */
  dismiss: string;
};

export const BANNER_LABELS: BannerLabels = { dismiss: "Закрыть" };

/**
 * With `onDismiss` the close button stands last at the end of the banner's row: in
 * `Banner.Actions` when the banner has them, alone otherwise.
 */
type BannerContextValue = {
  onDismiss?: () => void;
  frame: ControlSize;
  controls: ControlSize;
  dismissLabel: string;
};

const BannerContext = React.createContext<BannerContextValue | null>(null);

function useBanner(): BannerContextValue | null {
  return React.useContext(BannerContext);
}

function CloseButton({
  banner,
  variant,
}: {
  banner: BannerContextValue;
  variant: "ghost" | "soft";
}) {
  return (
    <Button.Root
      variant={variant}
      tone="inherit"
      size={banner.controls}
      aria-label={banner.dismissLabel}
      onClick={banner.onDismiss}
    >
      <Button.Icon>
        <X />
      </Button.Icon>
    </Button.Root>
  );
}

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
  // It enters when it appears on a shown page (after an event), not when it mounts with the page.
  const appear = useEnterOnAppear<HTMLDivElement>();
  const mergedRef = useMergedRefs(rootRef, appear.ref, ref);
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
  const frame = size;
  // The buttons of the banner take its tier: as tall as the fields of the same surface.
  const controls = useHostTier(frame, "surface");
  const context = React.useMemo<BannerContextValue>(
    () => ({ onDismiss, frame, controls: controls.size, dismissLabel }),
    [onDismiss, frame, controls.size, dismissLabel],
  );
  // A tinted banner is a host off the ladder (translucent fills inside); an outline one is a layer.
  const nested = useNestedSurfaceDepth();
  const depth = variant === "outline" ? nested : "tinted";

  return (
    <div
      {...rest}
      ref={mergedRef}
      className={cx(
        surfaceFrameClass,
        styles.root,
        appear.entering && enterMotion.enter,
        className,
      )}
      data-depth={depth}
      data-frame={frame}
      {...toDataAttributes({ variant, tone, size, placement })}
    >
      <SurfaceDepthProvider value={depth}>
        <BannerContext.Provider value={context}>
          {controls.provide(children)}
        </BannerContext.Provider>
      </SurfaceDepthProvider>
    </div>
  );
}
BannerRoot.displayName = "Banner.Root";

export type BannerContentProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The banner's header row: the mark (`Banner.Icon`), the title over the description, the actions
 * at the end (under the text when narrow) — whatever order they are written in. With `onDismiss`
 * and no `Banner.Actions` the close button stands alone at the end.
 */
function BannerContent({ className, children, ...rest }: BannerContentProps) {
  const banner = useBanner();
  const items = flattenChildren(children);
  const pick = (type: React.ElementType) => items.filter((part) => isPart(part, type));
  const actions = pick(BannerActions);
  const own: React.ElementType[] = [BannerIcon, BannerTitle, BannerDescription, BannerActions];
  return (
    <div
      {...rest}
      className={cx(headerRowStyles.header, styles.content, className)}
      data-lines={pick(BannerDescription).length > 0 ? "two" : "one"}
    >
      <HeaderRowContent
        mark={pick(BannerIcon)}
        title={pick(BannerTitle)}
        description={pick(BannerDescription)}
        end={
          actions.length === 0 && banner?.onDismiss ? (
            <div className={headerRowStyles.end}>
              <CloseButton banner={banner} variant="ghost" />
            </div>
          ) : (
            actions
          )
        }
      >
        {items.filter(
          (part) => !(React.isValidElement(part) && own.includes(part.type as React.ElementType)),
        )}
      </HeaderRowContent>
    </div>
  );
}
BannerContent.displayName = "Banner.Content";

export type BannerIconProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** Holds one `Icon` in the mark box of the banner's frame, in the tone color. */
function BannerIcon({ className, ...rest }: BannerIconProps) {
  return (
    <span
      className={cx(headerRowStyles.mark, styles.icon, iconSlotClass, className)}
      aria-hidden="true"
      {...rest}
    />
  );
}
BannerIcon.displayName = "Banner.Icon";

export type BannerTitleProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

function BannerTitle({ className, ...rest }: BannerTitleProps) {
  const banner = useBanner();
  return (
    <span
      className={cx(FRAME_TITLE[banner?.frame ?? "m"], headerRowStyles.title, className)}
      {...rest}
    />
  );
}
BannerTitle.displayName = "Banner.Title";

export type BannerDescriptionProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

function BannerDescription({ className, ...rest }: BannerDescriptionProps) {
  const banner = useBanner();
  return (
    <span
      className={cx(FRAME_DESCRIPTION[banner?.frame ?? "m"], styles.description, className)}
      {...rest}
    />
  );
}
BannerDescription.displayName = "Banner.Description";

export type BannerActionsProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** Action buttons take the banner's frame tier; with `onDismiss` the close button ends this row. */
function BannerActions({ className, children, ...rest }: BannerActionsProps) {
  const banner = useBanner();

  return (
    <div className={cx(headerRowStyles.end, styles.actions, className)} {...rest}>
      {children}
      {banner?.onDismiss ? <CloseButton banner={banner} variant="soft" /> : null}
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
