import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { visuallyHiddenClass } from "@/internal/VisuallyHidden";

import { BottomNav } from "./BottomNav";

function Nav({ onSelect = () => {} }: { onSelect?: (id: string) => void }) {
  return (
    <BottomNav.Root>
      <BottomNav.Item current onClick={() => onSelect("home")}>
        <BottomNav.ItemIcon>
          <svg />
        </BottomNav.ItemIcon>
        Главная
      </BottomNav.Item>
      <BottomNav.Item onClick={() => onSelect("orders")}>
        <BottomNav.ItemIcon>
          <svg />
        </BottomNav.ItemIcon>
        <BottomNav.ItemCount>12</BottomNav.ItemCount>
        Заказы
      </BottomNav.Item>
      <BottomNav.Item disabled onClick={() => onSelect("reports")}>
        <BottomNav.ItemIcon>
          <svg />
        </BottomNav.ItemIcon>
        Отчёты
      </BottomNav.Item>
      <BottomNav.Item href="#settings">
        <BottomNav.ItemIcon>
          <svg />
        </BottomNav.ItemIcon>
        Настройки
      </BottomNav.Item>
    </BottomNav.Root>
  );
}

describe("BottomNav", () => {
  it("is a named navigation landmark, renamable through labels or aria-label", () => {
    const { rerender } = render(<Nav />);
    expect(screen.getByRole("navigation", { name: "Основные разделы" })).toBeInTheDocument();
    rerender(<BottomNav.Root labels={{ nav: "Разделы CRM" }} />);
    expect(screen.getByRole("navigation", { name: "Разделы CRM" })).toBeInTheDocument();
    rerender(<BottomNav.Root aria-label="Магазин" />);
    expect(screen.getByRole("navigation", { name: "Магазин" })).toBeInTheDocument();
  });

  it("marks the current section and names items by label, then count", () => {
    render(<Nav />);
    expect(screen.getByRole("button", { name: "Главная" })).toHaveAttribute("aria-current", "page");
    const orders = screen.getByRole("button", { name: "Заказы 12" });
    expect(orders).not.toHaveAttribute("aria-current");
    // The icon is decoration, the label comes first in the DOM.
    expect(orders.querySelector("[aria-hidden='true'] svg")).not.toBeNull();
    expect(orders.firstElementChild).toHaveTextContent("Заказы");
  });

  it("renders a link with href and a disabled link without it", () => {
    render(
      <BottomNav.Root>
        <BottomNav.Item href="#settings">Настройки</BottomNav.Item>
        <BottomNav.Item href="#reports" disabled>
          Отчёты
        </BottomNav.Item>
      </BottomNav.Root>,
    );
    expect(screen.getByRole("link", { name: "Настройки" })).toHaveAttribute("href", "#settings");
    const disabled = screen.getByText("Отчёты").closest("a") as HTMLElement;
    expect(disabled).not.toHaveAttribute("href");
    expect(disabled).toHaveAttribute("aria-disabled", "true");
  });

  it("renders the child as the item with asChild, keeping the parts", () => {
    render(
      <BottomNav.Root>
        <BottomNav.Item asChild current>
          <a href="/orders">
            <BottomNav.ItemIcon>
              <svg />
            </BottomNav.ItemIcon>
            Заказы
          </a>
        </BottomNav.Item>
      </BottomNav.Root>,
    );
    const link = screen.getByRole("link", { name: "Заказы" });
    expect(link).toHaveAttribute("href", "/orders");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link.querySelector("[aria-hidden='true']")).not.toBeNull();
  });

  it("forwards refs to the nav and the item element", () => {
    const navRef = React.createRef<HTMLElement>();
    const itemRef = React.createRef<HTMLElement>();
    render(
      <BottomNav.Root ref={navRef}>
        <BottomNav.Item ref={itemRef}>Главная</BottomNav.Item>
      </BottomNav.Root>,
    );
    expect(navRef.current?.tagName).toBe("NAV");
    expect(itemRef.current?.tagName).toBe("BUTTON");
  });

  it("works from the keyboard: Tab skips the disabled item, Enter activates", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Nav onSelect={onSelect} />);
    await user.tab();
    expect(screen.getByRole("button", { name: "Главная" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Заказы 12" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith("orders");
    await user.tab();
    expect(screen.getByRole("link", { name: "Настройки" })).toHaveFocus();
  });

  it("iconOnly hides labels visually but keeps them as the items' names", () => {
    render(
      <BottomNav.Root iconOnly>
        <BottomNav.Item current>
          <BottomNav.ItemIcon>
            <svg />
          </BottomNav.ItemIcon>
          Главная
        </BottomNav.Item>
      </BottomNav.Root>,
    );
    expect(screen.getByRole("navigation")).toHaveAttribute("data-icon-only", "true");
    const item = screen.getByRole("button", { name: "Главная" });
    expect(screen.getByText("Главная")).toHaveClass(visuallyHiddenClass);
    expect(item).toHaveAttribute("aria-current", "page");
  });

  it("floating marks the bar for its glass look; flat by default", () => {
    const { rerender } = render(<BottomNav.Root />);
    expect(screen.getByRole("navigation")).not.toHaveAttribute("data-floating");
    rerender(<BottomNav.Root floating />);
    expect(screen.getByRole("navigation")).toHaveAttribute("data-floating", "true");
  });

  it("a disabled item ignores clicks", () => {
    const onSelect = vi.fn();
    render(<Nav onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: "Отчёты" }));
    expect(onSelect).not.toHaveBeenCalled();
  });
});
