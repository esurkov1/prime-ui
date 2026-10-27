import * as React from "react";
import { Check } from "@/icons/glyphs/check";

import { useOptionalControlSize } from "./ControlSizeContext";
import { cx } from "./cx";
import { toDataAttributes } from "./data-attributes";
import { fieldTierClass } from "./fieldClasses";
import type { ListRowLines } from "./listRow";
import listRowStyles from "./listRow.module.css";
import menu from "./menu.module.css";
import { type ControlSize, OVERLAY_CONTENT_SIZE, stepDown } from "./states";
import textRole from "./textRole.module.css";
import { touchTargetRowClass } from "./touchTarget";

/*
 * The rows and groups of a menu panel — Dropdown, Select, TagSelect, the suggestions of Input, the
 * presets of Datepicker, CommandMenu groups: the kit's one list row (internal/listRow). A row
 * stands a tier below its panel (`s` on an `m` panel) and grows to the touch target on a coarse
 * pointer; the panel's column puts the rows 2 apart (`menu.list`, `menu.group`).
 */

/** The tier of a panel's rows: one below the panel, never below `xs`. */
export function menuRowTier(panel: ControlSize): ControlSize {
  return stepDown(panel);
}

type MenuRowOptions = {
  /** The row's tier (`menuRowTier` of its panel). */
  size: ControlSize;
  /** Beside a description the row takes two lines. */
  lines?: ListRowLines;
  /**
   * The element is the row and its hit element (default). `false`: the element is only the row,
   * its hit element is a child (`listRowStyles.hit`) beside the row's own controls.
   */
  hit?: boolean;
  /** A press does something: pointer, hover wash, pressed fill. */
  interactive?: boolean;
  /** The keyboard highlight of a listbox or a menu with a search (focus stays in the field). */
  highlighted?: boolean;
  disabled?: boolean;
  /** A destructive action: red text and mark, a red wash under the pointer or the highlight. */
  danger?: boolean;
  /** Checked in a multiple choice: the accent's soft tone. */
  checked?: boolean;
  /** The row takes real focus (a menu's roving focus): its focus is the fill, no ring. */
  focusFill?: boolean;
  className?: string;
};

/** The class and the data attributes of a menu row element. */
export function menuRowProps({
  size,
  lines = "line",
  hit = true,
  interactive = true,
  highlighted = false,
  disabled = false,
  danger = false,
  checked = false,
  focusFill = false,
  className,
}: MenuRowOptions): { className: string } & Record<string, string | undefined> {
  return {
    className: cx(
      fieldTierClass,
      listRowStyles.tier,
      listRowStyles.row,
      hit && listRowStyles.hit,
      touchTargetRowClass,
      menu.row,
      className,
    ),
    ...toDataAttributes({
      size,
      lines: lines === "two" ? "two" : undefined,
      interactive: hit && interactive && !disabled ? "" : undefined,
      highlighted: highlighted || undefined,
      disabled: disabled || undefined,
      danger: danger && !disabled ? "" : undefined,
      checked: checked || undefined,
      focus: hit && focusFill ? "fill" : undefined,
    }),
  };
}

/**
 * The check of a single choice at the row's end: a plain accent glyph while chosen, the place held
 * while not, so labels and the parts before it never shift. Decorative: the row carries the state.
 */
export function MenuRowCheck({ checked }: { checked: boolean }) {
  return (
    <span className={listRowStyles.check} aria-hidden="true">
      {checked ? <Check /> : null}
    </span>
  );
}

export type MenuGroupProps = Omit<React.HTMLAttributes<HTMLDivElement>, "role"> & {
  label?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * A labelled `role="group"` of rows: Dropdown, Select and CommandMenu groups. It carries the rows'
 * tier (a tier below the panel), so its heading stands on the rows' text edge.
 */
export function MenuGroup({ label, className, children, ...rest }: MenuGroupProps) {
  const labelId = React.useId();
  const panel = useOptionalControlSize() ?? OVERLAY_CONTENT_SIZE;
  return (
    // biome-ignore lint/a11y/useSemanticElements: role="group" inside a menu / listbox; <fieldset> is not allowed there
    <div
      {...rest}
      role="group"
      aria-labelledby={label != null ? labelId : undefined}
      className={cx(fieldTierClass, listRowStyles.tier, menu.group, className)}
      data-size={menuRowTier(panel)}
    >
      {label != null ? (
        <div id={labelId} role="presentation" className={cx(textRole.caption, menu.groupLabel)}>
          {label}
        </div>
      ) : null}
      {children}
    </div>
  );
}
