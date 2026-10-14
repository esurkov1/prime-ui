import * as React from "react";

import type { AnchorPoint } from "@/hooks/usePosition";
import { cx } from "@/internal/cx";
import { FloatingPanel } from "@/internal/overlay/FloatingPanel";
import { useFloatingLayer } from "@/internal/overlay/useFloatingLayer";
import textRole from "@/internal/textRole.module.css";

import styles from "./chartTooltip.module.css";

export type { AnchorPoint };

type ChartTooltipProps = React.HTMLAttributes<HTMLDivElement> & {
  /** The point the content belongs to («8 окт», «Неделя 41»), over the content. */
  label?: React.ReactNode;
  /**
   * Floats the tooltip beside a point of `anchorRef` (px from its top-left corner) — the pointer
   * over the plot, or the point the arrow keys reached; `null` hides it. Without `anchorRef` the
   * body renders in place (a chart library positions it).
   */
  point?: AnchorPoint | null;
  /** The plot the point lies in: its scroll and size changes move the tooltip with it. */
  anchorRef?: React.RefObject<HTMLElement | null>;
  /** Escape hid the floating tooltip (it stays hidden until the point moves). */
  onDismiss?: () => void;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The one chart tooltip of the kit (ChartFrame.Tooltip, Sparkline): its look, and — with
 * `anchorRef` — its place. A floating tooltip is an anchored layer like every other
 * (`useFloatingLayer` + `usePosition` with `anchorPoint`): right of the point, vertically centred,
 * flipped to the left only where the right has no room, kept inside the viewport, passive (no
 * focus, no presses) and aria-hidden — the chart speaks its points itself.
 */
export function ChartTooltip({ anchorRef, ...props }: ChartTooltipProps) {
  return anchorRef ? (
    <FloatingChartTooltip {...props} anchorRef={anchorRef} />
  ) : (
    <Body {...props} />
  );
}

function Body({
  label,
  point: _point,
  onDismiss: _onDismiss,
  className,
  children,
  ...rest
}: ChartTooltipProps) {
  return (
    <div {...rest} className={cx(textRole.caption, styles.root, className)} data-depth="floating">
      {label !== undefined && label !== null ? <div className={styles.label}>{label}</div> : null}
      {children}
    </div>
  );
}

function FloatingChartTooltip({
  anchorRef,
  point = null,
  onDismiss,
  label,
  className,
  children,
  ref,
  ...rest
}: ChartTooltipProps & { anchorRef: React.RefObject<HTMLElement | null> }) {
  // Escape hides the tooltip of this point; the next point shows it again.
  const [dismissed, setDismissed] = React.useState<AnchorPoint | null>(null);
  const open = point !== null && !(dismissed && dismissed.x === point.x && dismissed.y === point.y);
  // While it fades out the tooltip keeps the last point and content it showed.
  const shownRef = React.useRef({ point, label, children });
  if (open) shownRef.current = { point, label, children };
  const shown = shownRef.current;

  const floating = useFloatingLayer({
    open,
    onOpenChange: (next) => {
      if (next) return;
      setDismissed(point);
      onDismiss?.();
    },
    triggerRef: anchorRef,
    dismiss: "none",
    closeOnEscape: true,
    closeOnOutsideClick: true,
    side: "right",
    align: "center",
    // Clear of the pointer's arrow, which hangs down and right of its hot spot.
    offsetToken: "--prime-space-4",
    anchorPoint: shown.point,
  });

  return (
    <FloatingPanel<HTMLDivElement>
      {...rest}
      ref={ref}
      floating={floating}
      size="m"
      surface={false}
      className={cx(textRole.caption, styles.root, className)}
      data-depth="floating"
      aria-hidden="true"
    >
      {shown.label !== undefined && shown.label !== null ? (
        <div className={styles.label}>{shown.label}</div>
      ) : null}
      {shown.children}
    </FloatingPanel>
  );
}
