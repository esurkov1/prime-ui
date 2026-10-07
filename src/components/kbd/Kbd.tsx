import type * as React from "react";

import { useBadgeTier } from "@/components/badge/tier";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize } from "@/internal/states";

import styles from "./Kbd.module.css";

export type KbdProps = Omit<React.HTMLAttributes<HTMLElement>, "size"> & {
  /** Badge tier; without it the key follows the surrounding control one tier down, else `m`. */
  size?: ControlSize;
  ref?: React.Ref<HTMLElement>;
};

/** One keyboard key as a native `<kbd>`; passes its tier to a nested `Icon`. */
export function Kbd({ children, className, size: sizeProp, ...rest }: KbdProps) {
  const { size, tier } = useBadgeTier(sizeProp);
  return (
    <kbd className={cx(styles.root, className)} {...rest} {...toDataAttributes({ size, tier })}>
      <ControlSizeProvider value={tier}>{children}</ControlSizeProvider>
    </kbd>
  );
}
