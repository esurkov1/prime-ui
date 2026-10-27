import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { visuallyHiddenClass } from "@/components/visually-hidden/VisuallyHidden";
import press from "@/internal/press.module.css";
import { touchTargetRowClass } from "@/internal/touchTarget";
import { cssRule, cssValue } from "@/test/css";
import { BottomNav } from "./BottomNav";
import styles from "./BottomNav.module.css";

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

  it("takes a disabled asChild link out of the Tab order and blocks its click", () => {
    const onClick = vi.fn();
    render(
      <BottomNav.Root>
        <BottomNav.Item asChild disabled>
          {/* biome-ignore lint/a11y/useValidAnchor: a router link stand-in */}
          <a href="#reports" onClick={onClick}>
            Отчёты
          </a>
        </BottomNav.Item>
      </BottomNav.Root>,
    );
    const link = screen.getByText("Отчёты").closest("a") as HTMLElement;
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(link).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
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

  it("floating puts the selection capsule under the current item and follows it", () => {
    function Floating() {
      const [current, setCurrent] = React.useState("home");
      return (
        <BottomNav.Root floating>
          <BottomNav.Item current={current === "home"} onClick={() => setCurrent("home")}>
            Главная
          </BottomNav.Item>
          <BottomNav.Item current={current === "orders"} onClick={() => setCurrent("orders")}>
            Заказы
          </BottomNav.Item>
        </BottomNav.Root>
      );
    }
    render(<Floating />);
    const selection = screen.getByRole("navigation").querySelector("[data-visible]");
    expect(selection).toHaveAttribute("data-visible", "true");
    expect(selection).toHaveAttribute("aria-hidden", "true");
    fireEvent.click(screen.getByRole("button", { name: "Заказы" }));
    expect(screen.getByRole("button", { name: "Заказы" })).toHaveAttribute("aria-current", "page");
    expect(selection).toHaveAttribute("data-visible", "true");
  });

  it("an action stands beside the bar as a named button inside the landmark", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(
      <BottomNav.Root floating>
        <BottomNav.Item current>Главная</BottomNav.Item>
        <BottomNav.Item>Заказы</BottomNav.Item>
        <BottomNav.Action aria-label="Новый заказ" onClick={onCreate}>
          <svg />
        </BottomNav.Action>
      </BottomNav.Root>,
    );
    const nav = screen.getByRole("navigation");
    const action = screen.getByRole("button", { name: "Новый заказ" });
    expect(action).toHaveAttribute("type", "button");
    expect(nav).toContainElement(action);
    expect(action.closest(`.${styles.bar}`)).toBeNull();
    await user.tab();
    await user.tab();
    await user.tab();
    expect(action).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it("an action inside a component of the consumer's own still stands at the bar's end", () => {
    function AssistantAction() {
      return (
        <BottomNav.Action aria-label="Ассистент">
          <svg />
        </BottomNav.Action>
      );
    }
    render(
      <BottomNav.Root floating>
        <BottomNav.Item current>Главная</BottomNav.Item>
        <BottomNav.Item>Заказы</BottomNav.Item>
        <AssistantAction />
      </BottomNav.Root>,
    );
    const action = screen.getByRole("button", { name: "Ассистент" });
    expect(action.closest(`.${styles.bar}`)).toBeNull();
    expect(action.parentElement).toHaveClass(styles.actionSlot);
    expect(action).toHaveAttribute("data-variant", "glass");
    expect(
      cssValue(cssRule("src/layout/bottom-nav/BottomNav.module.css", ".actionSlot"), "display"),
    ).toBe("contents");
  });

  it("a disabled item ignores clicks", () => {
    const onSelect = vi.fn();
    render(<Nav onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: "Отчёты" }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("the items are a switcher: they scroll inside the bar, never squeezed below their label", () => {
    render(<Nav />);
    const track = screen.getByRole("button", { name: "Главная" }).parentElement as HTMLElement;
    expect(track).toHaveAttribute("data-edges", "fade");
    const css = "src/layout/bottom-nav/BottomNav.module.css";
    expect(cssValue(cssRule(css, ".track"), "grid-auto-columns")).toBe("minmax(max-content, 1fr)");
    expect(cssRule(css, ".label").decls.map((decl) => decl.prop)).not.toContain("text-overflow");
  });

  it("the current item is told by more than colour: its glyph sits on a pill in the flat bar", () => {
    const rule = cssRule(
      "src/layout/bottom-nav/BottomNav.module.css",
      '.root:not([data-floating="true"]) .item[aria-current="page"] .glyph',
    );
    expect(cssValue(rule, "background")).toBe("var(--prime-color-fill-muted)");
  });

  it("every item presses its glyph; floating items are touch rows", () => {
    const { rerender } = render(
      <BottomNav.Root>
        <BottomNav.Item current>Главная</BottomNav.Item>
      </BottomNav.Root>,
    );
    const item = () => screen.getByRole("button", { name: "Главная" });
    expect(item()).toHaveClass(press.pressHost);
    expect(item().lastElementChild).toHaveClass(press.pressPartCompact);
    expect(item()).not.toHaveClass(touchTargetRowClass);
    rerender(
      <BottomNav.Root floating>
        <BottomNav.Item current>Главная</BottomNav.Item>
      </BottomNav.Root>,
    );
    expect(item()).toHaveClass(touchTargetRowClass);
  });

  it("the action is a solid disk in the flat bar and the Button glass disk when floating", () => {
    const { rerender } = render(
      <BottomNav.Root>
        <BottomNav.Item current>Главная</BottomNav.Item>
        <BottomNav.Action aria-label="Новый заказ">
          <svg />
        </BottomNav.Action>
      </BottomNav.Root>,
    );
    const action = () => screen.getByRole("button", { name: "Новый заказ" });
    expect(action()).toHaveAttribute("data-variant", "solid");
    rerender(
      <BottomNav.Root floating>
        <BottomNav.Item current>Главная</BottomNav.Item>
        <BottomNav.Action aria-label="Новый заказ">
          <svg />
        </BottomNav.Action>
      </BottomNav.Root>,
    );
    expect(action()).toHaveAttribute("data-variant", "glass");
  });

  it("the floating capsule glides to the item a person picks", async () => {
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query }));
    const offsets = vi
      .spyOn(HTMLElement.prototype, "offsetLeft", "get")
      .mockImplementation(function (this: HTMLElement) {
        return this.textContent?.trim() === "Заказы" ? 80 : 0;
      });
    function Floating() {
      const [current, setCurrent] = React.useState("home");
      return (
        <BottomNav.Root floating>
          <BottomNav.Item current={current === "home"} onClick={() => setCurrent("home")}>
            Главная
          </BottomNav.Item>
          <BottomNav.Item current={current === "orders"} onClick={() => setCurrent("orders")}>
            Заказы
          </BottomNav.Item>
        </BottomNav.Root>
      );
    }
    try {
      render(<Floating />);
      const selection = screen
        .getByRole("navigation")
        .querySelector("[data-visible]") as HTMLElement;
      expect(selection).not.toHaveAttribute("data-animate");
      fireEvent.click(screen.getByRole("button", { name: "Заказы" }));
      await waitFor(() => expect(selection.style.left).toBe("80px"));
      expect(selection).toHaveAttribute("data-animate", "true");
      fireEvent.transitionEnd(selection, { propertyName: "left" });
      expect(selection).not.toHaveAttribute("data-animate");
    } finally {
      offsets.mockRestore();
      vi.unstubAllGlobals();
    }
  });

  it("CSS: the bar and the capsule take their place from the frame's edges and safe areas", () => {
    const CSS = "src/layout/bottom-nav/BottomNav.module.css";
    const bar = cssRule(CSS, ".root");
    expect(cssValue(bar, "padding-block-end")).toBe("var(--prime-safe-area-bottom)");
    expect(cssValue(bar, "padding-left")).toContain("var(--prime-safe-area-left)");
    expect(cssValue(bar, "padding-right")).toContain("var(--prime-safe-area-right)");
    const capsule = cssRule(CSS, '.root[data-floating="true"]');
    expect(cssValue(capsule, "position")).toBe("absolute");
    const inset = "var(--prime-bottom-nav-floating-inset)";
    expect(cssValue(capsule, "bottom")).toBe(`calc(${inset} + var(--prime-safe-area-bottom))`);
    expect(cssValue(capsule, "left")).toBe(`calc(${inset} + var(--prime-safe-area-left))`);
    expect(cssValue(capsule, "right")).toBe(`calc(${inset} + var(--prime-safe-area-right))`);
  });
});
