import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import press from "@/internal/press.module.css";
import textTone from "@/internal/textTone.module.css";
import { cssRule, cssRules, cssValue } from "@/test/css";

import { Timeline } from "./Timeline";
import styles from "./Timeline.module.css";

function Feed({ onSelect }: { onSelect?: (id: string) => void }) {
  const rows = [
    { id: "a", title: "Аренда закончилась", date: "21.09.26", value: "+6 300 ฿" },
    { id: "b", title: "ТО: замена масла", date: "10.09.26", value: "−689 ฿" },
  ];
  return (
    <Timeline.Root>
      <Timeline.Group label="Недавно">
        {rows.map((row) => (
          <Timeline.Item key={row.id} onClick={onSelect ? () => onSelect(row.id) : undefined}>
            <Timeline.ItemTitle>{row.title}</Timeline.ItemTitle>
            <Timeline.ItemMeta>
              <strong>{row.date}</strong> · 15 д. назад
            </Timeline.ItemMeta>
            <Timeline.ItemValue>{row.value}</Timeline.ItemValue>
          </Timeline.Item>
        ))}
      </Timeline.Group>
    </Timeline.Root>
  );
}

describe("Timeline", () => {
  it("marks the first and last event of a group, also after an event is added", () => {
    function Events({ count }: { count: number }) {
      return (
        <Timeline.Root>
          <Timeline.Group label="Недавно">
            {["Счёт оплачен", "Заказ отправлен", "Заказ доставлен"].slice(0, count).map((title) => (
              <Timeline.Item key={title}>
                <Timeline.ItemTitle>{title}</Timeline.ItemTitle>
              </Timeline.Item>
            ))}
          </Timeline.Group>
        </Timeline.Root>
      );
    }
    const { rerender } = render(<Events count={2} />);
    const second = screen.getAllByRole("listitem")[1];
    expect(second).toHaveAttribute("data-last");

    rerender(<Events count={3} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveAttribute("data-first");
    // The kept event is no longer last: its line now runs on to the new one.
    expect(items[1]).toBe(second);
    expect(second).not.toHaveAttribute("data-last");
    expect(items[2]).toHaveAttribute("data-last");
  });

  it("renders a labelled ordered list with one item per row", () => {
    render(<Feed />);
    const list = screen.getByRole("list", { name: "Недавно" });
    expect(list.tagName).toBe("OL");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(within(items[0]).getByText("Аренда закончилась")).toHaveClass(styles.title);
    expect(within(items[0]).getByText("21.09.26").tagName).toBe("STRONG");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("sets the size on the root and draws one decorative dot per row", () => {
    const { container } = render(
      <Timeline.Root size="s">
        <Timeline.Group>
          <Timeline.Item>
            <Timeline.ItemTitle>Один</Timeline.ItemTitle>
          </Timeline.Item>
        </Timeline.Group>
      </Timeline.Root>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-size", "s");
    const dots = container.querySelectorAll(`.${styles.dot}`);
    expect(dots).toHaveLength(1);
    expect(dots[0]).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("list")).not.toHaveAttribute("aria-labelledby");
  });

  it("takes the host tier without its own size; the heading's text role follows the tier", () => {
    const { container } = render(
      <ControlSizeProvider value="xs">
        <Timeline.Root>
          <Timeline.Group label="Недавно">
            <Timeline.Item>
              <Timeline.ItemTitle>Один</Timeline.ItemTitle>
            </Timeline.Item>
          </Timeline.Group>
        </Timeline.Root>
      </ControlSizeProvider>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-size", "xs");
    // The bare list keeps its semantics under `list-style: none` (WebKit drops them otherwise).
    expect(screen.getByRole("list", { name: "Недавно" })).toHaveAttribute("role", "list");
    expect(screen.getByText("Недавно")).toHaveClass(styles.groupLabel);
  });

  it("keeps no selection: rows carry no state or aria-current", () => {
    render(<Feed onSelect={() => {}} />);
    for (const button of screen.getAllByRole("button")) {
      fireEvent.click(button);
      expect(button).not.toHaveAttribute("data-state");
      expect(button).not.toHaveAttribute("aria-current");
    }
  });

  it("dot color: palette color by default, tone wins over color", () => {
    render(
      <Timeline.Root>
        <Timeline.Group>
          <Timeline.Item>
            <Timeline.ItemTitle>Default</Timeline.ItemTitle>
          </Timeline.Item>
          <Timeline.Item color="teal" tone="danger">
            <Timeline.ItemTitle>Toned</Timeline.ItemTitle>
          </Timeline.Item>
        </Timeline.Group>
      </Timeline.Root>,
    );
    expect(screen.getByText("Default").parentElement).toHaveAttribute("data-color", "blue");
    const toned = screen.getByText("Toned").parentElement;
    expect(toned).toHaveAttribute("data-tone", "danger");
    expect(toned).not.toHaveAttribute("data-color");
  });

  it("interactive rows are buttons: one tab stop each, click and keyboard select", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Feed onSelect={onSelect} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveAttribute("type", "button");
    expect(buttons[0]).toHaveAttribute("data-interactive", "true");

    fireEvent.click(buttons[1]);
    expect(onSelect).toHaveBeenLastCalledWith("b");

    await user.tab();
    expect(buttons[0]).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenLastCalledWith("a");
    await user.tab();
    expect(buttons[1]).toHaveFocus();
    await user.keyboard(" ");
    expect(onSelect).toHaveBeenLastCalledWith("b");
    await user.tab();
    expect(document.body).toHaveFocus();
  });

  it("renders a link with href and the child element with asChild", () => {
    render(
      <Timeline.Root>
        <Timeline.Group>
          <Timeline.Item href="/events/1">
            <Timeline.ItemTitle>Link row</Timeline.ItemTitle>
          </Timeline.Item>
          <Timeline.Item asChild>
            <a href="/events/2" data-custom="yes">
              <Timeline.ItemTitle>Custom row</Timeline.ItemTitle>
            </a>
          </Timeline.Item>
        </Timeline.Group>
      </Timeline.Root>,
    );
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/events/1");
    expect(links[0]).toHaveClass(styles.row);
    expect(links[1]).toHaveAttribute("data-custom", "yes");
    expect(links[1]).toHaveClass(styles.row);
    expect(links[1].querySelector(`.${styles.dot}`)).toBeTruthy();
    expect(within(links[1]).getByText("Custom row")).toBeInTheDocument();
  });

  it("interactive rows give under the press; a static row does not", () => {
    render(
      <Timeline.Root>
        <Timeline.Group>
          <Timeline.Item onClick={() => undefined}>
            <Timeline.ItemTitle>Button row</Timeline.ItemTitle>
          </Timeline.Item>
          <Timeline.Item>
            <Timeline.ItemTitle>Static row</Timeline.ItemTitle>
          </Timeline.Item>
        </Timeline.Group>
      </Timeline.Root>,
    );
    expect(screen.getByRole("button")).toHaveClass(press.press);
    expect(screen.getByText("Static row").parentElement).not.toHaveClass(press.press);
  });

  it("asChild needs one element child", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() =>
      render(
        <Timeline.Root>
          <Timeline.Group>
            <Timeline.Item asChild>text</Timeline.Item>
          </Timeline.Group>
        </Timeline.Root>,
      ),
    ).toThrow("Timeline.Item asChild needs a single element child");
  });

  it("value is a right-aligned tabular cell with an optional tone", () => {
    render(
      <Timeline.Root>
        <Timeline.Group>
          <Timeline.Item>
            <Timeline.ItemTitle>Row</Timeline.ItemTitle>
            <Timeline.ItemValue>+6 300 ฿</Timeline.ItemValue>
            <Timeline.ItemValue tone="danger">−689 ฿</Timeline.ItemValue>
          </Timeline.Item>
        </Timeline.Group>
      </Timeline.Root>,
    );
    const plain = screen.getByText("+6 300 ฿");
    expect(plain).toHaveClass(styles.value);
    expect(plain).toHaveAttribute("data-tone", "neutral");
    expect(screen.getByText("−689 ฿")).toHaveAttribute("data-tone", "danger");
    // The tone colour is the shared text tone ladder.
    expect(screen.getByText("−689 ฿")).toHaveClass(textTone.tone);
  });

  it("value takes a muted second line from an ItemMeta inside it", () => {
    render(
      <Timeline.Root>
        <Timeline.Group>
          <Timeline.Item>
            <Timeline.ItemTitle>ТО: замена масла</Timeline.ItemTitle>
            <Timeline.ItemValue>
              900 ฿<Timeline.ItemMeta>ТО</Timeline.ItemMeta>
            </Timeline.ItemValue>
          </Timeline.Item>
        </Timeline.Group>
      </Timeline.Root>,
    );
    const meta = screen.getByText("ТО");
    expect(meta).toHaveClass(styles.valueMeta);
    expect(meta.parentElement).toHaveClass(styles.value);
    expect(meta.parentElement).toHaveTextContent("900 ฿ТО");
  });

  it("gap is a list item between events with a hollow dot, caption, trailing and tone", () => {
    const { container } = render(
      <Timeline.Root>
        <Timeline.Group label="История работ">
          <Timeline.Gap>
            Без обслуживания 26 дней · 300 км
            <Timeline.Description>сейчас</Timeline.Description>
          </Timeline.Gap>
          <Timeline.Item>
            <Timeline.ItemTitle>ТО: замена масла</Timeline.ItemTitle>
          </Timeline.Item>
          <Timeline.Gap tone="warning">100 дней · 4 400 км без обслуживания</Timeline.Gap>
          <Timeline.Item>
            <Timeline.ItemTitle>Резина зад + работа</Timeline.ItemTitle>
          </Timeline.Item>
        </Timeline.Group>
      </Timeline.Root>,
    );
    const items = within(screen.getByRole("list", { name: "История работ" })).getAllByRole(
      "listitem",
    );
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveClass(styles.item, styles.gapItem);
    const firstGap = screen.getByText("Без обслуживания 26 дней · 300 км");
    expect(firstGap).toHaveClass(styles.gapCaption);
    expect(firstGap.parentElement).toHaveAttribute("data-tone", "neutral");
    expect(within(items[0]).getByText("сейчас")).toHaveClass(styles.gapTrailing);
    expect(screen.getByText("100 дней · 4 400 км без обслуживания").parentElement).toHaveAttribute(
      "data-tone",
      "warning",
    );
    expect(items[2].querySelector(`.${styles.gapTrailing}`)).toBeNull();
    const gapDots = container.querySelectorAll(`.${styles.gapDot}`);
    expect(gapDots).toHaveLength(2);
    expect(gapDots[0]).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll(`.${styles.dot}`)).toHaveLength(2);
    // The event before a gap dashes its lower segment (marked in TSX, not by `:has(+ …)`).
    expect(items[1]).toHaveAttribute("data-before-gap", "true");
    expect(items[3]).not.toHaveAttribute("data-before-gap");
  });

  it("CSS highlights only the row under the pointer or with keyboard focus", () => {
    const file = "src/components/timeline/Timeline.module.css";
    expect(cssValue(cssRule(file, ".row:focus-visible"), "background")).toBe(
      "var(--prime-color-fill-subtle-active)",
    );
    expect(cssValue(cssRule(file, ".row:hover", ["@media (hover: hover)"]), "background")).toBe(
      "var(--prime-color-fill-subtle-active)",
    );
    expect(cssRules(file).some((rule) => /data-state|data-highlight/.test(rule.selector))).toBe(
      false,
    );
  });

  it("link rows stay focusable without a click handler", () => {
    render(
      <Timeline.Root>
        <Timeline.Group label="Операции">
          <Timeline.Item href="#a">
            <Timeline.ItemTitle>Аренда закончилась</Timeline.ItemTitle>
          </Timeline.Item>
        </Timeline.Group>
      </Timeline.Root>,
    );
    const link = screen.getByRole("link", { name: "Аренда закончилась" });
    link.focus();
    expect(link).toHaveFocus();
    expect(link).toHaveAttribute("data-interactive", "true");
  });
});
