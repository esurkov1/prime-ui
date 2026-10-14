import type * as React from "react";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useOptionalControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import { iconBoxClass } from "@/internal/iconBox";
import { useLabels } from "@/internal/labels";
import { Ring } from "@/internal/ring";
import type { ControlSize, TextTone } from "@/internal/states";
import toneStyles from "@/internal/textTone.module.css";

import styles from "./Spinner.module.css";

export type SpinnerLabels = {
  /** Text read by screen readers while the spinner is shown. */
  loading: string;
};

export const SPINNER_LABELS: SpinnerLabels = {
  loading: "Загрузка",
};

export type SpinnerProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  size?: ControlSize;
  tone?: TextTone;
  labels?: Partial<SpinnerLabels>;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * Indeterminate loading indicator: the kit ring (`internal/ring`) with the share unknown — a quarter
 * arc turning on a faint track, at the line weight. A `role="status"` region with `labels.loading`
 * for screen readers; pass `aria-hidden` when the host already says it is busy. It fades itself in
 * (`enterMotion.enterFade`), so a host that shows it conditionally needs no motion of its own.
 */
export function Spinner({
  size: sizeProp,
  tone = "default",
  labels: labelsProp,
  className,
  ...rest
}: SpinnerProps) {
  const controlSize = useOptionalControlSize();
  const labels = useLabels(SPINNER_LABELS, labelsProp);
  const size = sizeProp ?? controlSize ?? "m";

  return (
    <span
      role="status"
      className={cx(
        styles.root,
        iconBoxClass(sizeProp, controlSize),
        toneStyles.tone,
        enterMotion.enterFade,
        className,
      )}
      {...toDataAttributes({ size, tone: tone === "default" ? undefined : tone })}
      {...rest}
    >
      <Ring value={null} className={styles.ring} />
      <VisuallyHidden>{labels.loading}</VisuallyHidden>
    </span>
  );
}
