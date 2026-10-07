import type * as React from "react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import type { ControlSize } from "@/internal/states";

import styles from "./Hint.module.css";

export type HintRootProps = React.HTMLAttributes<HTMLParagraphElement> & {
  /** Tier of the paired field. */
  size?: ControlSize;
  /** Error message styling (`danger-text`); the message drops in. */
  invalid?: boolean;
  /** Dimmed text next to a disabled control. */
  disabled?: boolean;
  ref?: React.Ref<HTMLParagraphElement>;
};

function HintRoot({ className, size = "m", invalid, disabled, children, ...rest }: HintRootProps) {
  return (
    <ControlSizeProvider value={size}>
      <p
        {...rest}
        className={cx(styles.root, invalid && enterMotion.enter, className)}
        {...toDataAttributes({
          size,
          invalid: invalid || undefined,
          disabled: disabled || undefined,
        })}
      >
        {children}
      </p>
    </ControlSizeProvider>
  );
}
HintRoot.displayName = "Hint.Root";

export type HintIconProps = React.HTMLAttributes<HTMLSpanElement>;

/** Leading icon centred on the first line; decorative. */
function HintIcon({ className, ...rest }: HintIconProps) {
  return <span aria-hidden="true" className={cx(styles.icon, className)} {...rest} />;
}
HintIcon.displayName = "Hint.Icon";

export const Hint = { Root: HintRoot, Icon: HintIcon };
