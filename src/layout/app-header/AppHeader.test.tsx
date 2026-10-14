import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { AppShell } from "../app-shell/AppShell";
import { Sidebar } from "../sidebar/Sidebar";
import { AppHeader } from "./AppHeader";

/** A shell whose Sidebar is an off-canvas panel (a phone), with the page in main. */
function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell.Root>
      <AppShell.Nav>
        <Sidebar.Root offCanvas="always">
          <Sidebar.Item href="#orders">Заказы</Sidebar.Item>
        </Sidebar.Root>
      </AppShell.Nav>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell.Root>
  );
}

describe("AppHeader", () => {
  it("renders a banner with the zones in order and merges className", () => {
    render(
      <AppHeader.Root className="custom">
        <AppHeader.Start>
          <AppHeader.Title>Заказы</AppHeader.Title>
        </AppHeader.Start>
        <AppHeader.Actions>
          <button type="button">Экспорт</button>
          <button type="button">Новый заказ</button>
        </AppHeader.Actions>
      </AppHeader.Root>,
    );

    const banner = screen.getByRole("banner");
    expect(banner).toHaveClass("custom");
    expect(banner).toHaveTextContent("Заказы");
    const buttons = screen.getAllByRole("button");
    expect(buttons.map((button) => button.textContent)).toEqual(["Экспорт", "Новый заказ"]);
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

  it("draws the menu button while the shell's Sidebar is off-canvas: it opens the panel", async () => {
    const user = userEvent.setup();
    render(
      <PhoneShell>
        <AppHeader.Root>
          <AppHeader.Start>
            <AppHeader.Title>Заказы</AppHeader.Title>
          </AppHeader.Start>
        </AppHeader.Root>
      </PhoneShell>,
    );
    const menu = screen.getByRole("button", { name: "Открыть меню" });
    const nav = screen.getByRole("navigation", { hidden: true });
    expect(menu).toHaveAttribute("aria-expanded", "false");
    expect(menu).toHaveAttribute("aria-controls", nav.id);
    // It leads the start zone, before the title.
    expect(menu.nextElementSibling).toContainElement(screen.getByRole("heading", { level: 1 }));

    menu.focus();
    await user.keyboard("{Enter}");
    expect(nav.parentElement).toHaveAttribute("data-state", "open");
    expect(menu).toHaveAttribute("aria-expanded", "true");
  });

  it("Space on the menu button opens the panel too; a placed MenuButton replaces the drawn one", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <PhoneShell>
        <AppHeader.Root labels={{ menu: "Навигация" }}>
          <AppHeader.Start>
            <AppHeader.Title>Заказы</AppHeader.Title>
          </AppHeader.Start>
          <AppHeader.Actions>
            <AppHeader.MenuButton onClick={onClick} />
          </AppHeader.Actions>
        </AppHeader.Root>
      </PhoneShell>,
    );
    const menus = screen.getAllByRole("button", { name: "Навигация" });
    expect(menus).toHaveLength(1);
    menus[0]?.focus();
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(menus[0]).toHaveAttribute("aria-expanded", "true");
  });

  it("no menu button while the rail is on screen, nor outside a shell", () => {
    const { rerender } = render(
      <AppShell.Root>
        <AppShell.Nav>
          <Sidebar.Root offCanvas="never">
            <Sidebar.Item>Обзор</Sidebar.Item>
          </Sidebar.Root>
        </AppShell.Nav>
        <AppHeader.Root>
          <AppHeader.MenuButton />
        </AppHeader.Root>
      </AppShell.Root>,
    );
    expect(screen.queryByRole("button", { name: "Открыть меню" })).not.toBeInTheDocument();
    rerender(
      <AppHeader.Root>
        <AppHeader.MenuButton />
      </AppHeader.Root>,
    );
    expect(screen.queryByRole("button", { name: "Открыть меню" })).not.toBeInTheDocument();
  });

  it("Tab follows the reading order across the zones", async () => {
    render(
      <PhoneShell>
        <AppHeader.Root>
          <AppHeader.Start>
            <AppHeader.Title>Заказы</AppHeader.Title>
          </AppHeader.Start>
          <AppHeader.Actions>
            <button type="button">Экспорт</button>
            <button type="button">Создать</button>
          </AppHeader.Actions>
        </AppHeader.Root>
      </PhoneShell>,
    );

    // The closed panel before it is `inert` (jsdom does not skip inert content, so start at the
    // header).
    screen.getByRole("button", { name: "Открыть меню" }).focus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Экспорт" })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Создать" })).toHaveFocus();
  });

  it("Title's name is the page h1; the icon and the description stay out of its name", () => {
    render(
      <AppHeader.Root>
        <AppHeader.Start>
          <AppHeader.Title>
            <AppHeader.Icon>
              <svg />
            </AppHeader.Icon>
            Сделки
            <AppHeader.Description>Отдел продаж · октябрь</AppHeader.Description>
          </AppHeader.Title>
        </AppHeader.Start>
      </AppHeader.Root>,
    );
    const heading = screen.getByRole("heading", { level: 1 });
    expect(screen.getAllByRole("heading")).toHaveLength(1);
    expect(heading).toHaveAccessibleName("Сделки");
    expect(screen.getByText("Отдел продаж · октябрь")).toBeInTheDocument();
    expect(heading).not.toContainElement(screen.getByText("Отдел продаж · октябрь"));
  });

  it("the page tools are the second row: after the title row in the DOM and the Tab order", async () => {
    const { container } = render(
      <AppHeader.Root>
        <AppHeader.Start>
          <AppHeader.Title>Сделки</AppHeader.Title>
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

  it("tools inside a component of the page still form the second row", async () => {
    function DealsTools() {
      return (
        <AppHeader.Tools data-testid="tools">
          <button type="button">Период</button>
        </AppHeader.Tools>
      );
    }
    const { container } = render(
      <AppHeader.Root>
        <AppHeader.Start>
          <AppHeader.Title>Сделки</AppHeader.Title>
        </AppHeader.Start>
        <DealsTools />
        <AppHeader.Actions>
          <button type="button">Уведомления</button>
        </AppHeader.Actions>
      </AppHeader.Root>,
    );
    const header = container.querySelector("header") as HTMLElement;
    expect(header.lastElementChild).toBe(screen.getByTestId("tools"));
    expect(header.children).toHaveLength(2);
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Уведомления" })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Период" })).toHaveFocus();
  });
});
