import * as React from "react";
import {
  ControlSizeProvider,
  controlSurfaceToInputSize,
  useOptionalControlSize,
} from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { KbdSize } from "@/internal/states";

import styles from "./Kbd.module.css";

export type KbdRootProps = Omit<React.HTMLAttributes<HTMLElement>, "size"> & {
  children: React.ReactNode;
  className?: string;
  size?: KbdSize;
};

const KbdRoot = React.forwardRef<HTMLElement, KbdRootProps>(
  ({ children, className, size: sizeProp, ...rest }, ref) => {
    const controlSurface = useOptionalControlSize();
    const size =
      sizeProp ?? (controlSurface !== undefined ? controlSurfaceToInputSize(controlSurface) : "m");

    return (
      <kbd
        ref={ref}
        className={cx(styles.root, className)}
        {...rest}
        {...toDataAttributes({ size })}
      >
        <ControlSizeProvider value={size}>{children}</ControlSizeProvider>
      </kbd>
    );
  },
);

KbdRoot.displayName = "Kbd.Root";

export const Kbd = { Root: KbdRoot };
