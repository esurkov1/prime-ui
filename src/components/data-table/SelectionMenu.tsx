import type * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Icon } from "@/icons";
import type { ControlSize } from "@/internal/states";

type SelectionMenuProps = {
  /** The selected row keys, in the order they were selected. */
  selected: React.Key[];
  /** The consumer's items for the selection (`renderSelectionActions`). */
  actions: React.ReactNode;
  onClear: () => void;
  labels: { selectionActions: string; clearSelection: string };
  size: ControlSize;
};

/**
 * The actions on the selected rows: a soft Button with the count of selected rows that opens a
 * Dropdown — `labels.clearSelection` first, then the consumer's items.
 */
export function SelectionMenu({ selected, actions, onClear, labels, size }: SelectionMenuProps) {
  const name = labels.selectionActions;
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        {/* Named by its text and count as read aloud: «Действия 3», not «Действия3». */}
        <Button.Root aria-label={`${name} ${selected.length}`} variant="soft" tone="neutral">
          {name}
          <Badge.Root>{selected.length}</Badge.Root>
          <Button.Icon>
            <Icon name="nav.chevronDown" />
          </Button.Icon>
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content side="bottom" align="end" size={size}>
        <Dropdown.Item onSelect={onClear}>
          <Dropdown.ItemIcon>
            <Icon name="action.close" />
          </Dropdown.ItemIcon>
          {labels.clearSelection}
        </Dropdown.Item>
        <Dropdown.Separator />
        {actions}
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
