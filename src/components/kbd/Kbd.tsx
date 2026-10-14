import type * as React from "react";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { useChipTier } from "@/internal/chipTier";
import chipTier from "@/internal/chipTier.module.css";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { iconSlotClass } from "@/internal/iconBox";
import type { ControlSize } from "@/internal/states";

import styles from "./Kbd.module.css";

export type KbdProps = Omit<React.HTMLAttributes<HTMLElement>, "size"> & {
  size?: ControlSize;
  ref?: React.Ref<HTMLElement>;
};

/** One keyboard key as a native `<kbd>`; passes its tier to a nested `Icon`. */
export function Kbd({ children, className, size: sizeProp, ...rest }: KbdProps) {
  const { size, tier } = useChipTier(sizeProp);
  return (
    <kbd
      className={cx(styles.root, chipTier.tier, iconSlotClass, className)}
      {...rest}
      {...toDataAttributes({ size, tier })}
    >
      <ControlSizeProvider value={tier}>{children}</ControlSizeProvider>
    </kbd>
  );
}
