import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AppHeader } from "./AppHeader";

describe("AppHeader", () => {
  it("renders a banner with the zones in order and merges className", () => {
    render(
      <AppHeader.Root className="custom">
        <AppHeader.Start>
          <AppHeader.Title>Заказы</AppHeader.Title>
        </AppHeader.Start>
        <AppHeader.Search>Поиск</AppHeader.Search>
        <AppHeader.Actions>
          <button type="button">Новый заказ</button>
        </AppHeader.Actions>
      </AppHeader.Root>,
    );

    const banner = screen.getByRole("banner");
    expect(banner).toHaveClass("custom");
    expect(banner).toHaveTextContent("Заказы");
    const buttons = screen.getAllByRole("button");
    expect(buttons.map((button) => button.textContent)).toEqual(["Поиск⌘K", "Новый заказ"]);
  });

  it("Title puts the icon first and the description under the name, whatever the order", () => {
    render(
      <AppHeader.Title data-testid="title">
        <AppHeader.Description>Отдел продаж</AppHeader.Description>
        Обзор
        <AppHeader.Icon data-testid="icon">
          <svg />
        </AppHeader.Icon>
      </AppHeader.Title>,
    );

    const title = screen.getByTestId("title");
    const icon = screen.getByTestId("icon");
    expect(title.firstElementChild).toBe(icon);
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(title).toHaveTextContent("ОбзорОтдел продаж");
  });

  it("Search is a button named by its text; the key hint is hidden and can be removed", async () => {
    const onClick = vi.fn();
    const { rerender } = render(<AppHeader.Search onClick={onClick}>Поиск</AppHeader.Search>);

    const search = screen.getByRole("button", { name: "Поиск" });
    expect(search).toHaveAttribute("type", "button");
    expect(screen.getByText("⌘K")).toHaveAttribute("aria-hidden", "true");

    search.focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);

    rerender(
      <AppHeader.Search onClick={onClick} shortcut={null}>
        Поиск
      </AppHeader.Search>,
    );
    expect(screen.queryByText("⌘K")).not.toBeInTheDocument();
  });

  it("MenuButton is named by labels.menu, takes aria-expanded and reports show", async () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <AppHeader.Root>
        <AppHeader.MenuButton aria-expanded={false} onClick={onClick} />
      </AppHeader.Root>,
    );

    const menu = screen.getByRole("button", { name: "Открыть меню" });
    expect(menu).toHaveAttribute("aria-expanded", "false");
    expect(menu).toHaveAttribute("data-show", "narrow");

    await userEvent.tab();
    expect(menu).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <AppHeader.Root labels={{ menu: "Навигация" }}>
        <AppHeader.MenuButton show="always" />
      </AppHeader.Root>,
    );
    expect(screen.getByRole("button", { name: "Навигация" })).toHaveAttribute(
      "data-show",
      "always",
    );
  });

  it("Tab follows the reading order across the zones", async () => {
    render(
      <AppHeader.Root>
        <AppHeader.Start>
          <AppHeader.MenuButton />
          <AppHeader.Title>Заказы</AppHeader.Title>
        </AppHeader.Start>
        <AppHeader.Search>Поиск</AppHeader.Search>
        <AppHeader.Actions>
          <button type="button">Создать</button>
        </AppHeader.Actions>
      </AppHeader.Root>,
    );

    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Открыть меню" })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Поиск" })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Создать" })).toHaveFocus();
  });

  it('Title as="h1" is the page heading; the description stays out of its name', () => {
    render(
      <AppHeader.Root>
        <AppHeader.Start>
          <AppHeader.Title as="h1">
            Сделки
            <AppHeader.Description>Отдел продаж · октябрь</AppHeader.Description>
          </AppHeader.Title>
        </AppHeader.Start>
      </AppHeader.Root>,
    );
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveAccessibleName("Сделки");
    expect(screen.getByText("Отдел продаж · октябрь")).toBeInTheDocument();
    expect(heading).not.toContainElement(screen.getByText("Отдел продаж · октябрь"));
  });

  it("Title is no heading by default", () => {
    render(
      <AppHeader.Root>
        <AppHeader.Title>Сделки</AppHeader.Title>
      </AppHeader.Root>,
    );
    expect(screen.queryByRole("heading")).toBeNull();
  });

  it("the page tools are the second row: after the title row in the DOM and the Tab order", async () => {
    const { container } = render(
      <AppHeader.Root>
        <AppHeader.Start>
          <AppHeader.Title as="h1">Сделки</AppHeader.Title>
        </AppHeader.Start>
        <AppHeader.Tools data-testid="tools">
          <button type="button">Период</button>
        </AppHeader.Tools>
        <AppHeader.Actions>
          <button type="button">Уведомления</button>
        </AppHeader.Actions>
      </AppHeader.Root>,
    );
    const header = container.querySelector("header") as HTMLElement;
    const [row, tools] = Array.from(header.children);
    expect(tools).toBe(screen.getByTestId("tools"));
    expect(row).toContainElement(screen.getByRole("button", { name: "Уведомления" }));
    expect(row).not.toContainElement(screen.getByRole("button", { name: "Период" }));
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Уведомления" })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Период" })).toHaveFocus();
  });
});
