import { Checkbox } from "prime-ui-kit";
import * as React from "react";

const ROW_IDS = ["row-1", "row-2", "row-3"] as const;

/**
 * Header “select all” with indeterminate when partially selected; row checkboxes toggle membership.
 */
export function BulkSelectRowsExample() {
  const [selected, setSelected] = React.useState<Set<string>>(() => new Set());

  const allSelected = selected.size === ROW_IDS.length;
  const noneSelected = selected.size === 0;
  const headerIndeterminate = !noneSelected && !allSelected;

  function toggleRow(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(ROW_IDS) : new Set());
  }

  return (
    <>
      <Checkbox.Root
        checked={allSelected}
        indeterminate={headerIndeterminate}
        onChange={(e) => toggleAll(e.target.checked)}
      >
        <Checkbox.Label>Select all rows</Checkbox.Label>
      </Checkbox.Root>
      {ROW_IDS.map((id) => (
        <Checkbox.Root
          key={id}
          checked={selected.has(id)}
          onChange={(e) => toggleRow(id, e.target.checked)}
        >
          <Checkbox.Label>Row {id}</Checkbox.Label>
        </Checkbox.Root>
      ))}
    </>
  );
}
