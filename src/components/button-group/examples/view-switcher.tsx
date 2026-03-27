import { ButtonGroup } from "prime-ui-kit";
import * as React from "react";

type ViewMode = "list" | "grid" | "board";

/**
 * View switcher: one active segment; state lives in the parent.
 */
export default function ViewSwitcherExample() {
  const [mode, setMode] = React.useState<ViewMode>("list");

  return (
    <ButtonGroup.Root aria-label="View layout">
      <ButtonGroup.Item pressed={mode === "list"} type="button" onClick={() => setMode("list")}>
        List
      </ButtonGroup.Item>
      <ButtonGroup.Item pressed={mode === "grid"} type="button" onClick={() => setMode("grid")}>
        Grid
      </ButtonGroup.Item>
      <ButtonGroup.Item pressed={mode === "board"} type="button" onClick={() => setMode("board")}>
        Board
      </ButtonGroup.Item>
    </ButtonGroup.Root>
  );
}
