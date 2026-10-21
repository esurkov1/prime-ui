import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { VIEW_MENU_TEXT, ViewMenu } from "./ViewMenu";
import { VIEW_MENU_SORTABLE } from "./viewMenuSortable";

const ITEMS = [
  { id: "rent", label: "Аренды" },
  { id: "book", label: "Брони" },
  { id: "fix", label: "Сервис" },
];

const LABELS = { view: VIEW_MENU_TEXT.view, group: "На графике", reset: VIEW_MENU_TEXT.reset };

describe("viewMenuSortable", () => {
  function Ordered() {
    const [order, setOrder] = React.useState<string[]>([]);
    const [hidden, setHidden] = React.useState<string[]>([]);
    return (
      <>
        <ViewMenu
          items={ITEMS}
          hidden={hidden}
          defaultHidden={[]}
          onHiddenChange={setHidden}
          order={order}
          onOrderChange={setOrder}
          sortable={VIEW_MENU_SORTABLE}
          labels={{ ...LABELS, reorder: "Переместить {label}" }}
          size="m"
        />
        <output data-testid="order">{order.join(",")}</output>
      </>
    );
  }

  it("Alt + ↑ moves the focused item, which keeps the focus; the reset puts the order back", async () => {
    const user = userEvent.setup();
    render(<Ordered />);
    await user.click(screen.getByRole("button", { name: "Вид 3" }));
    expect(screen.getByRole("button", { name: "Переместить Сервис" })).toBeInTheDocument();
    const item = screen.getByRole("menuitemcheckbox", { name: "Сервис" });
    expect(item).toHaveAttribute("aria-keyshortcuts", "Alt+ArrowUp Alt+ArrowDown");
    act(() => item.focus());
    await user.keyboard("{Alt>}{ArrowUp}{/Alt}");
    expect(screen.getByTestId("order")).toHaveTextContent("rent,fix,book");
    expect(screen.getByRole("menuitemcheckbox", { name: "Сервис" })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("menuitem", { name: "По умолчанию" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByTestId("order")).toHaveTextContent("rent,book,fix");
  });
});

it("keeps a grouped item in its group: an id the order never listed takes its default place", async () => {
  const user = userEvent.setup();
  function Grouped() {
    const [order, setOrder] = React.useState<string[]>(["book"]);
    return (
      <>
        <ViewMenu
          items={[
            { id: "rent", label: "Аренды", group: "Сделки" },
            { id: "book", label: "Брони", group: "Сделки" },
            { id: "fix", label: "Сервис", group: "Парк" },
          ]}
          hidden={[]}
          defaultHidden={[]}
          onHiddenChange={() => {}}
          order={order}
          onOrderChange={setOrder}
          sortable={VIEW_MENU_SORTABLE}
          labels={LABELS}
          size="m"
        />
        <output data-testid="order">{order.join(",")}</output>
      </>
    );
  }
  render(<Grouped />);
  await user.click(screen.getByRole("button", { name: "Вид 3" }));
  expect(screen.getByRole("group", { name: "Сделки" })).toBeInTheDocument();
  act(() => screen.getByRole("menuitemcheckbox", { name: "Брони" }).focus());
  await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
  expect(screen.getByTestId("order")).toHaveTextContent("rent,book,fix");
});
