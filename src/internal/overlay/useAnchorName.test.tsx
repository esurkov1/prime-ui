import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { useAnchorName } from "./useAnchorName";

function Panel({ named = false, children }: { named?: boolean; children: React.ReactNode }) {
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const name = useAnchorName(true, named, anchorRef);
  return (
    <>
      <div ref={anchorRef} data-testid="anchor">
        {children}
      </div>
      <div role="dialog" {...name}>
        Панель
      </div>
    </>
  );
}

describe("useAnchorName", () => {
  it("names the panel by the id of the control inside the anchor", () => {
    render(
      <Panel>
        <button type="button" id="project-actions" aria-label="Действия с проектом" />
      </Panel>,
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-labelledby", "project-actions");
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Действия с проектом");
  });

  it("takes the control's aria-label when it has no id", () => {
    render(
      <Panel>
        <input aria-label="Поиск клиента" />
      </Panel>,
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-label", "Поиск клиента");
  });

  it("falls back to the control's text", () => {
    render(
      <Panel>
        <button type="button">Поставка оборудования</button>
      </Panel>,
    );
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Поставка оборудования");
  });

  it("reads nothing for a panel with its own heading", () => {
    render(
      <Panel named>
        <button type="button" id="filters" />
      </Panel>,
    );
    expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-labelledby");
    expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-label");
  });
});
