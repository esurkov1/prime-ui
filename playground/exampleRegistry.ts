import type * as React from "react";

import { createSourceRegistry, type SourceEntry } from "./sourceRegistry";

export type ExampleBase = "components" | "layout";

/** Every example file of the kit (`src/<base>/<dir>/examples/*.tsx`): module + source, lazily. */
const loadExample = createSourceRegistry(
  import.meta.glob<{ default: React.ComponentType }>("../src/{components,layout}/*/examples/*.tsx"),
  import.meta.glob<string>("../src/{components,layout}/*/examples/*.tsx", {
    query: "?raw",
    import: "default",
  }),
  (key) => key.slice(3),
);

/** The example `src/<base>/<dir>/examples/<file>.tsx`; throws when the file does not exist. */
export function getExample(base: ExampleBase, dir: string, file: string): Promise<SourceEntry> {
  return loadExample(`../src/${base}/${dir}/examples/${file}.tsx`);
}
