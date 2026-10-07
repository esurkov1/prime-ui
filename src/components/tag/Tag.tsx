import * as React from "react";

import { useBadgeTier } from "@/components/badge/tier";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize, PaletteColor, Variant } from "@/internal/states";

import styles from "./Tag.module.css";

export type TagLabels = {
  /** Accessible name of the remove button; include the tag text, e.g. «Удалить Design». */
  remove: string;
};

const TAG_LABELS: TagLabels = { remove: "Удалить" };

export type TagRootProps = {
  /** Palette hue. Default `gray`. */
  color?: PaletteColor;
  /** Treatment. Default `soft`. */
  variant?: Extract<Variant, "soft" | "outline">;
  /** Badge tier; without it the tag follows the surrounding control one tier down. */
  size?: ControlSize;
  /** Shows the remove button. */
  onRemove?: () => void;
  labels?: Partial<TagLabels>;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

export type TagIconProps = {
  children: React.ReactNode;
  className?: string;
};

const TagRoot = React.forwardRef<HTMLSpanElement, TagRootProps>(
  (
    {
      color = "gray",
      variant = "soft",
      size: sizeProp,
      onRemove,
      labels,
      disabled,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const { size, tier } = useBadgeTier(sizeProp);

    return (
      <span
        ref={ref}
        className={cx(styles.root, className)}
        aria-disabled={disabled || undefined}
        {...toDataAttributes({
          color,
          variant,
          size,
          tier,
          removable: onRemove ? true : undefined,
          disabled: disabled ? true : undefined,
        })}
        {...rest}
      >
        <span className={styles.body}>
          <ControlSizeProvider value={tier}>{children}</ControlSizeProvider>
        </span>
        {onRemove ? (
          <button
            type="button"
            className={styles.remove}
            aria-label={labels?.remove ?? TAG_LABELS.remove}
            onClick={onRemove}
            disabled={disabled}
          >
            <svg className={styles.removeIcon} viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M4.5 4.5l7 7M11.5 4.5l-7 7"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        ) : null}
      </span>
    );
  },
);

TagRoot.displayName = "TagRoot";

function TagIcon({ children, className }: TagIconProps) {
  return <span className={cx(styles.icon, className)}>{children}</span>;
}

TagIcon.displayName = "TagIcon";

export const Tag = { Root: TagRoot, Icon: TagIcon };
