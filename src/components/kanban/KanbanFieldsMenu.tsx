import type * as React from "react";

import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { useControllableState } from "@/hooks/useControllableState";
import { Icon } from "@/icons";
import { useHostTier } from "@/internal/ControlSizeContext";
import { useLabels } from "@/internal/labels";
import type { ControlSize } from "@/internal/states";

/** One part of a card the person may show or hide. */
export type KanbanField = { id: string; label: string };

/** System strings of the board's view menu. */
export type KanbanFieldsMenuLabels = {
  /** The trigger's text. */
  view: string;
  /** The heading of the group of card fields. */
  fields: string;
  /** The item that puts the default fields back. */
  reset: string;
};

export const KANBAN_FIELDS_MENU_LABELS: KanbanFieldsMenuLabels = {
  view: "Вид",
  fields: "На карточке",
  reset: "По умолчанию",
};

export type KanbanFieldsMenuProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "type"
> & {
  fields: readonly KanbanField[];
  hiddenFields?: readonly string[];
  defaultHiddenFields?: readonly string[];
  onHiddenFieldsChange?: (hiddenFields: readonly string[]) => void;
  size?: ControlSize;
  labels?: Partial<KanbanFieldsMenuLabels>;
  ref?: React.Ref<HTMLButtonElement>;
};

const NONE: readonly string[] = [];

const sameSet = (a: readonly string[], b: readonly string[]) =>
  a.length === b.length && a.every((id) => b.includes(id));

/**
 * The view of a board's cards, for the page's tools: a soft Button «Вид» opening a Dropdown with a
 * check item per card field and «По умолчанию», which puts `defaultHiddenFields` back. The cards
 * read the same `hiddenFields`.
 */
export function KanbanFieldsMenu({
  fields,
  hiddenFields: hiddenProp,
  defaultHiddenFields = NONE,
  onHiddenFieldsChange,
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
  const show = (id: string, visible: boolean) => {
    const rest = hidden.filter((field) => field !== id);
    setHidden(visible ? rest : [...rest, id]);
  };
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root {...triggerProps} variant="soft" tone="neutral" size={size}>
          <Button.Icon>
            <Icon name="view.preview" />
          </Button.Icon>
          {labels.view}
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content side="bottom" size={size}>
        <Dropdown.Group label={labels.fields}>
          {fields.map((field) => (
            <Dropdown.CheckboxItem
              key={field.id}
              checked={!hidden.includes(field.id)}
              onCheckedChange={(visible) => show(field.id, visible)}
            >
              {field.label}
            </Dropdown.CheckboxItem>
          ))}
        </Dropdown.Group>
        <Dropdown.Separator />
        <Dropdown.Item
          disabled={sameSet(hidden, defaultHiddenFields)}
          onSelect={() => setHidden(defaultHiddenFields)}
        >
          {labels.reset}
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
KanbanFieldsMenu.displayName = "KanbanFieldsMenu";
