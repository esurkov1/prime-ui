import * as React from "react";
import { useBadgeTier } from "@/components/badge/tier";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize } from "@/internal/states";

import styles from "./Kbd.module.css";

export type KbdRootProps = Omit<React.HTMLAttributes<HTMLElement>, "size"> & {
  children: React.ReactNode;
  className?: string;
  size?: ControlSize;
};

const KbdRoot = React.forwardRef<HTMLElement, KbdRootProps>(
  ({ children, className, size: sizeProp, ...rest }, ref) => {
    const { size, tier } = useBadgeTier(sizeProp);

    return (
      <kbd
        ref={ref}
        className={cx(styles.root, className)}
        {...rest}
        {...toDataAttributes({ size, tier })}
      >
        <ControlSizeProvider value={tier}>{children}</ControlSizeProvider>
      </kbd>
    );
  },
);

KbdRoot.displayName = "Kbd.Root";

export const Kbd = { Root: KbdRoot };
