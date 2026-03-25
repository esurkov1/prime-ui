import * as React from "react";

import {
  ControlSizeProvider,
  controlSurfaceToInputSize,
  useOptionalControlSize,
} from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";

import styles from "./Tag.module.css";

export type TagSize = "s" | "m" | "l" | "xl";

export type TagRootProps = {
  size?: TagSize;
  onRemove?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

export type TagIconProps = {
  children: React.ReactNode;
  className?: string;
};

const TagRoot = React.forwardRef<HTMLSpanElement, TagRootProps>(
  ({ size: sizeProp, onRemove, disabled, children, className, ...rest }, ref) => {
    const controlSurface = useOptionalControlSize();
    const size =
      sizeProp ?? (controlSurface !== undefined ? controlSurfaceToInputSize(controlSurface) : "m");

    return (
      <span
        ref={ref}
        className={cx(styles.root, className)}
        aria-disabled={disabled || undefined}
        {...toDataAttributes({
          size,
          disabled: disabled ? true : undefined,
        })}
        {...rest}
      >
        <span className={styles.body}>
          <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
        </span>
        {onRemove ? (
          <button
            type="button"
            className={styles.remove}
            aria-label="Remove"
            onClick={onRemove}
            disabled={disabled}
          >
            <svg className={styles.removeIcon} viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M2 2l8 8M10 2l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
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
