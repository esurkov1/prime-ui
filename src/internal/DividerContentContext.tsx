import * as React from "react";

/** Inside `Divider`, `Icon` gets no size classes; its box comes from `--prime-divider-icon`. */
export const DividerContentContext = React.createContext(false);

DividerContentContext.displayName = "DividerContentContext";
