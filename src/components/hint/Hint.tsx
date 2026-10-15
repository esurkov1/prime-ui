import type * as React from "react";

import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import enterMotion from "@/internal/enterMotion.module.css";
import { fieldHintTextClass, fieldTierClass } from "@/internal/fieldClasses";
import type { ControlSize, Tone } from "@/internal/states";
import textTone from "@/internal/textTone.module.css";

import styles from "./Hint.module.css";

/** The status a hint's words carry (a deadline that nears, a check that passed). */
export type HintTone = Extract<Tone, "neutral" | "success" | "warning" | "danger">;

export type HintRootProps = React.HTMLAttributes<HTMLParagraphElement> & {
  size?: ControlSize;
  tone?: HintTone;
  invalid?: boolean;
  disabled?: boolean;
  ref?: React.Ref<HTMLParagraphElement>;
};

function HintRoot({
  className,
  size: sizeProp,
  tone = "neutral",
  invalid,
  disabled: disabledProp,
  children,
  ...rest
}: HintRootProps) {
  const tier = useHostTier(sizeProp);
  const disabled = useInheritedDisabled(disabledProp);
  const shownTone = tone === "neutral" || invalid || disabled ? undefined : tone;
  return tier.provide(
    <p
      {...rest}
      className={cx(
        fieldTierClass,
        fieldHintTextClass,
        styles.root,
        invalid && enterMotion.enter,
        // A status color (`textTone`); an error or a disabled control takes over the color.
        shownTone && textTone.tone,
        className,
      )}
      {...toDataAttributes({
        size: tier.size,
        tone: shownTone,
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
