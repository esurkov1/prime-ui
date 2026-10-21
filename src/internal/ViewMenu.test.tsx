import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";
import enterMotion from "./enterMotion.module.css";
import { sameIds, toggleHidden, VIEW_MENU_TEXT, ViewMenu } from "./ViewMenu";

const ITEMS = [
  { id: "rent", label: "Аренды" },
  { id: "book", label: "Брони" },
  { id: "fix", label: "Сервис" },
];

const LABELS = { view: VIEW_MENU_TEXT.view, group: "На графике", reset: VIEW_MENU_TEXT.reset };

function Menu({ initial = [] as string[], defaultHidden = [] as string[] }) {
  const [hidden, setHidden] = React.useState<string[]>(initial);
  return (
    <ViewMenu
      items={ITEMS}
      hidden={hidden}
      defaultHidden={defaultHidden}
      onHiddenChange={setHidden}
      labels={LABELS}
      size="m"
    />
  );
}

describe("ViewMenu", () => {
  it("is a soft neutral button with the columns icon, the text and a count badge, read as «Вид 3»", () => {
    render(<Menu />);
    const trigger = screen.getByRole("button", { name: "Вид 3" });
    expect(trigger).toHaveAttribute("data-variant", "soft");
    expect(trigger).toHaveAttribute("data-tone", "neutral");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger.querySelector("svg")).not.toBeNull();
    expect(trigger).toHaveTextContent("Вид3");
  });

  it("toggles items from the keyboard; the reset item rises in with a change and puts the default back", async () => {
    const user = userEvent.setup();
    render(<Menu defaultHidden={["fix"]} initial={["fix"]} />);
    act(() => screen.getByRole("button", { name: "Вид 2" }).focus());
    await user.keyboard("{Enter}");
    expect(screen.getByRole("group", { name: "На графике" })).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: "По умолчанию" })).toBeNull();
    expect(screen.queryByRole("separator")).toBeNull();

    act(() => screen.getByRole("menuitemcheckbox", { name: "Брони" }).focus());
    await user.keyboard(" ");
    expect(screen.getByRole("menuitemcheckbox", { name: "Брони" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(screen.getByRole("button", { name: "Вид 1" })).toBeInTheDocument();
    const reset = screen.getByRole("menuitem", { name: "По умолчанию" });
    expect(reset).toHaveClass(enterMotion.enter);

    await user.keyboard("{End}");
    expect(reset).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Вид 2" })).toBeInTheDocument();
  });

  it("a menu opened on a changed view shows the reset item still", async () => {
    const user = userEvent.setup();
    render(<Menu initial={["rent"]} />);
    await user.click(screen.getByRole("button", { name: "Вид 2" }));
    expect(screen.getByRole("menuitem", { name: "По умолчанию" })).not.toHaveClass(
      enterMotion.enter,
    );
  });
});

describe("view menu ids", () => {
  it("compares ids as sets and toggles one in place", () => {
    expect(sameIds(["a", "b"], ["b", "a"])).toBe(true);
    expect(sameIds(["a"], ["a", "b"])).toBe(false);
    expect(toggleHidden(["a", "b"], "a", true)).toEqual(["b"]);
    expect(toggleHidden(["b"], "a", false)).toEqual(["b", "a"]);
  });
});
