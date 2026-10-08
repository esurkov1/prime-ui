import * as React from "react";

import { cx } from "./cx";
import menu from "./menu.module.css";

export type MenuGroupProps = Omit<React.HTMLAttributes<HTMLDivElement>, "role"> & {
  /** Visible heading of the group; names it for screen readers. */
  label?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/** A labelled `role="group"` of rows: Dropdown, Select and CommandMenu groups. */
export function MenuGroup({ label, className, children, ...rest }: MenuGroupProps) {
  const labelId = React.useId();
  return (
    // biome-ignore lint/a11y/useSemanticElements: role="group" inside a menu / listbox; <fieldset> is not allowed there
    <div
      {...rest}
      role="group"
      aria-labelledby={label != null ? labelId : undefined}
      className={cx(menu.group, className)}
    >
      {label != null ? (
        <div id={labelId} role="presentation" className={menu.groupLabel}>
          {label}
        </div>
      ) : null}
      {children}
    </div>
  );
}
