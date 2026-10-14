import { render, screen } from "@testing-library/react";

import { MenuGroup } from "./MenuGroup";

describe("MenuGroup", () => {
  it("a labelled group is named by its visible heading", () => {
    render(
      <MenuGroup label="Статус" data-testid="group">
        <div role="option" aria-selected="false" tabIndex={-1}>
          Оплачен
        </div>
      </MenuGroup>,
    );
    expect(screen.getByRole("group", { name: "Статус" })).toBe(screen.getByTestId("group"));
  });

  it("a group without a label has no heading and no name", () => {
    render(
      <MenuGroup>
        <div role="option" aria-selected="false" tabIndex={-1}>
          Черновик
        </div>
      </MenuGroup>,
    );
    expect(screen.getByRole("group")).not.toHaveAttribute("aria-labelledby");
  });
});
