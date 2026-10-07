import * as React from "react";

/**
 * True inside a dropdown-level panel (Dropdown menu, Select or TagSelect list). Those panels sit
 * above popovers of the same portal layer, so a Popover opened from inside one (a tag's manage
 * panel in a TagSelect list) raises itself above it instead of opening underneath.
 */
export const DropdownLayerContext = React.createContext(false);
