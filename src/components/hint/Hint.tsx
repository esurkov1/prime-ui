import type * as React from "react";

import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import enterMotion from "@/internal/enterMotion.module.css";
import { fieldHintTextClass, fieldTierClass } from "@/internal/fieldClasses";
import type { ControlSize } from "@/internal/states";

import styles from "./Hint.module.css";

export type HintRootProps = React.HTMLAttributes<HTMLParagraphElement> & {
  size?: ControlSize;
  invalid?: boolean;
  disabled?: boolean;
  ref?: React.Ref<HTMLParagraphElement>;
};

function HintRoot({
  className,
  size: sizeProp,
  invalid,
  disabled: disabledProp,
  children,
  ...rest
}: HintRootProps) {
  const tier = useHostTier(sizeProp);
  const disabled = useInheritedDisabled(disabledProp);
  return tier.provide(
    <p
      {...rest}
      className={cx(
        fieldTierClass,
        fieldHintTextClass,
        styles.root,
        invalid && enterMotion.enter,
        className,
      )}
      {...toDataAttributes({
        size: tier.size,
        invalid: invalid || undefined,
        disabled: disabled || undefined,
      })}
    >
      {children}
    </p>,
  );
}
HintRoot.displayName = "Hint.Root";

export type HintIconProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** Leading icon centred on the first line; decorative. */
function HintIcon({ className, ...rest }: HintIconProps) {
  return <span aria-hidden="true" className={cx(styles.icon, className)} {...rest} />;
}
HintIcon.displayName = "Hint.Icon";

export const Hint = { Root: HintRoot, Icon: HintIcon };
