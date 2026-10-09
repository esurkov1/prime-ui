import * as React from "react";

import type { ControlSize } from "@/internal/states";

import type { DataTableLabels } from "./DataTable";
import type { DataTableColumn } from "./types";

/** What `DataTable.ColumnsMenu` reads from the table it sits in (through `toolbar`). */
export type DataTableColumnsContextValue = {
  /** Every column, hidden ones included, in table order. */
  columns: DataTableColumn<never>[];
  hidden: ReadonlySet<string>;
  setHidden: (hidden: string[]) => void;
  labels: DataTableLabels;
  size: ControlSize;
};

export const DataTableColumnsContext = React.createContext<DataTableColumnsContextValue | null>(
  null,
);
