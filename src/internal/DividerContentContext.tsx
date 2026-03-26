import * as React from "react";

/** Внутри `Divider.Root` — у `Icon` не задаются классы размера; габариты из `--prime-divider-icon`. */
export const DividerContentContext = React.createContext(false);

DividerContentContext.displayName = "DividerContentContext";
