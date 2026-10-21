import type * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { useHostTier } from "@/internal/ControlSizeContext";
import { useLabels } from "@/internal/labels";
import type { ControlSize } from "@/internal/states";
import { VIEW_MENU_TEXT, ViewMenu } from "@/internal/ViewMenu";
import { VIEW_MENU_SORTABLE } from "@/internal/viewMenuSortable";

/** One part of a card the person may show, hide or move; `group` heads a group of fields in the menu. */
export type KanbanField = { id: string; label: string; group?: string };

/** System strings of the board's view menu. */
export type KanbanFieldsMenuLabels = {
  /** The trigger's text. */
  view: string;
  /** The heading of the group of card fields. */
  fields: string;
  /** The item that puts the default fields (and their order) back. */
  reset: string;
  /** The name of a field's grip (`fieldOrder`); `{label}` is the field's label. */
  reorderField: string;
};

export const KANBAN_FIELDS_MENU_LABELS: KanbanFieldsMenuLabels = {
  view: VIEW_MENU_TEXT.view,
  fields: "На карточке",
  reset: VIEW_MENU_TEXT.reset,
  reorderField: "Переместить поле {label}",
};

export type KanbanFieldsMenuProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "type"
> & {
  fields: readonly KanbanField[];
  hiddenFields?: readonly string[];
  defaultHiddenFields?: readonly string[];
  onHiddenFieldsChange?: (hiddenFields: readonly string[]) => void;
  fieldOrder?: readonly string[];
  defaultFieldOrder?: readonly string[];
  onFieldOrderChange?: (fieldOrder: readonly string[]) => void;
  size?: ControlSize;
  labels?: Partial<KanbanFieldsMenuLabels>;
  ref?: React.Ref<HTMLButtonElement>;
};

const NONE: readonly string[] = [];

/**
 * The view of a board's cards, for the page's tools: the kit's one view trigger (`ViewMenu`: the
 * columns icon, «Вид» and the count of shown fields) opening a check item per card field (grouped
 * by `group`) and, once the view differs from the default, «По умолчанию». With any of the
 * `fieldOrder` triad the fields reorder (a grip, Alt + ↑ / ↓). The cards read the same
 * `hiddenFields` and `fieldOrder`.
 */
export function KanbanFieldsMenu({
  fields,
  hiddenFields: hiddenProp,
  defaultHiddenFields = NONE,
  onHiddenFieldsChange,
  fieldOrder,
  defaultFieldOrder,
  onFieldOrderChange,
  size: sizeProp,
  labels: labelsProp,
  ...triggerProps
}: KanbanFieldsMenuProps) {
  const labels = useLabels(KANBAN_FIELDS_MENU_LABELS, labelsProp);
  const { size } = useHostTier(sizeProp);
  const [hidden, setHidden] = useControllableState<readonly string[]>({
    value: hiddenProp,
    defaultValue: defaultHiddenFields,
    onChange: onHiddenFieldsChange,
  });
  // The fields reorder once the owner passes any of the triad (as DataTable `columnOrder`).
  const reorders =
    fieldOrder !== undefined || defaultFieldOrder !== undefined || onFieldOrderChange !== undefined;
  const [order, setOrder] = useControllableState<readonly string[]>({
    value: fieldOrder,
    defaultValue: defaultFieldOrder ?? NONE,
    onChange: onFieldOrderChange,
  });
  return (
    <ViewMenu
      items={fields}
      hidden={hidden}
      defaultHidden={defaultHiddenFields}
      onHiddenChange={setHidden}
      order={order}
      onOrderChange={reorders ? setOrder : undefined}
      sortable={VIEW_MENU_SORTABLE}
      labels={{
        view: labels.view,
        group: labels.fields,
        reset: labels.reset,
        reorder: labels.reorderField,
      }}
      size={size}
      triggerProps={triggerProps}
    />
  );
}
KanbanFieldsMenu.displayName = "KanbanFieldsMenu";
