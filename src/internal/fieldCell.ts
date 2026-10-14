import * as React from "react";

/**
 * The contract between `FieldList` and the fields in its cells. A cell provides its column heading;
 * a framed field without a `label` of its own takes it as its label (and keeps its own `label`, if
 * any), so every field in a row has a name without a visible label per row. The column heading
 * shows the name once above the rows; the field's label is read, not shown, until the list stacks
 * its rows into blocks in a narrow container (the `prime-field-list` container FieldList sets),
 * where each field shows it.
 */
export type FieldCell = {
  /** The column heading: the name of the field in this cell. */
  label: string;
  /**
   * `wide` — hidden while the column heading is on screen, shown when the rows stack; `always` —
   * a one-column list, named by the list's own label, shows none in either layout.
   */
  hidden: "wide" | "always";
  /** The column is required: the field in the cell is required too (`useFieldFrame`). */
  required: boolean;
};

export const FieldCellContext = React.createContext<FieldCell | null>(null);

export function useFieldCell(): FieldCell | null {
  return React.useContext(FieldCellContext);
}
