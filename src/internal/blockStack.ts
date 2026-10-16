import * as React from "react";

/**
 * Whether the blocks placed here stand in a host's stack of sections: a dialog body says so, and a
 * `Tabs.Panel` inside it lays out its own blocks the section step apart, the rhythm of the body's
 * sections — so a tab's blocks need no spacing wrapper of the consumer's.
 */
export const BlockStackContext = React.createContext(false);
