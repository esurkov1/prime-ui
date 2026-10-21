import type * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { useHostTier } from "@/internal/ControlSizeContext";
import { useLabels } from "@/internal/labels";
import type { ControlSize } from "@/internal/states";
import { VIEW_MENU_TEXT, ViewMenu } from "@/internal/ViewMenu";

import type { GanttCategory } from "./ganttModel";

/** System strings of the chart's view menu. */
export type GanttCategoriesMenuLabels = {
  /** The trigger's text. */
  view: string;
  /** The heading of the group of categories. */
  categories: string;
  /** The item that puts the default categories back. */
  reset: string;
};

export const GANTT_CATEGORIES_MENU_LABELS: GanttCategoriesMenuLabels = {
  view: VIEW_MENU_TEXT.view,
  categories: "На графике",
  reset: VIEW_MENU_TEXT.reset,
};

export type GanttCategoriesMenuProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "type"
> & {
  categories: readonly GanttCategory[];
  hiddenCategories?: readonly string[];
  defaultHiddenCategories?: readonly string[];
  onHiddenCategoriesChange?: (hiddenCategories: readonly string[]) => void;
  size?: ControlSize;
  labels?: Partial<GanttCategoriesMenuLabels>;
  ref?: React.Ref<HTMLButtonElement>;
};

const NONE: readonly string[] = [];

/**
 * The view of a Gantt, for the page's tools: the kit's one view trigger (`ViewMenu`: the columns
 * icon, «Вид» and the count of shown categories) opening a check item per bar category and, once the
 * view differs from `defaultHiddenCategories`, «По умолчанию». The chart reads the same
 * `hiddenCategories`: their bars and legend entries leave.
 */
export function GanttCategoriesMenu({
  categories,
  hiddenCategories: hiddenProp,
  defaultHiddenCategories = NONE,
  onHiddenCategoriesChange,
  size: sizeProp,
  labels: labelsProp,
  ...triggerProps
}: GanttCategoriesMenuProps) {
  const labels = useLabels(GANTT_CATEGORIES_MENU_LABELS, labelsProp);
  const { size } = useHostTier(sizeProp);
  const [hidden, setHidden] = useControllableState<readonly string[]>({
    value: hiddenProp,
    defaultValue: defaultHiddenCategories,
    onChange: onHiddenCategoriesChange,
  });
  return (
    <ViewMenu
      items={categories}
      hidden={hidden}
      defaultHidden={defaultHiddenCategories}
      onHiddenChange={setHidden}
      labels={{ view: labels.view, group: labels.categories, reset: labels.reset }}
      size={size}
      triggerProps={triggerProps}
    />
  );
}
GanttCategoriesMenu.displayName = "GanttCategoriesMenu";
