import { readFileSync } from "node:fs";
import { join } from "node:path";

import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Timeline } from "./Timeline";
import styles from "./Timeline.module.css";

function Feed({ onSelect, current }: { onSelect?: (id: string) => void; current?: string }) {
  const rows = [
    { id: "a", title: "Аренда закончилась", date: "21.09.26", value: "+6 300 ฿" },
    { id: "b", title: "ТО: замена масла", date: "10.09.26", value: "−689 ฿" },
  ];
  return (
    <Timeline.Root>
      <Timeline.Group label="Недавно">
        {rows.map((row) => (
          <Timeline.Item
            key={row.id}
            current={current === row.id}
            onClick={onSelect ? () => onSelect(row.id) : undefined}
          >
            <Timeline.Title>{row.title}</Timeline.Title>
            <Timeline.Meta>
              <Timeline.MetaPrimary>{row.date}</Timeline.MetaPrimary> · 15 д. назад
            </Timeline.Meta>
            <Timeline.Value>{row.value}</Timeline.Value>
          </Timeline.Item>
        ))}
      </Timeline.Group>
    </Timeline.Root>
  );
}

describe("Timeline", () => {
  it("renders a labelled ordered list with one item per row", () => {
    render(<Feed />);
    const list = screen.getByRole("list", { name: "Недавно" });
    expect(list.tagName).toBe("OL");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(within(items[0]).getByText("Аренда закончилась")).toHaveClass(styles.title);
    expect(within(items[0]).getByText("21.09.26")).toHaveClass(styles.metaPrimary);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("sets the size on the root and draws one decorative dot per row", () => {
    const { container } = render(
      <Timeline.Root size="s">
        <Timeline.Group>
          <Timeline.Item>
            <Timeline.Title>Один</Timeline.Title>
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

  it("marks the current row with data-state and aria-current", () => {
    render(<Feed current="b" />);
    const items = screen.getAllByRole("listitem");
    const activeRow = within(items[1]).getByText("ТО: замена масла").parentElement;
    const idleRow = within(items[0]).getByText("Аренда закончилась").parentElement;
    expect(activeRow).toHaveAttribute("data-state", "active");
    expect(activeRow).toHaveAttribute("aria-current", "true");
    expect(idleRow).toHaveAttribute("data-state", "inactive");
    expect(idleRow).not.toHaveAttribute("aria-current");
    expect(items[1]).toHaveAttribute("data-state", "active");
  });

  it("dot color: palette color by default, tone wins over color", () => {
    render(
      <Timeline.Root>
        <Timeline.Group>
          <Timeline.Item>
            <Timeline.Title>Default</Timeline.Title>
          </Timeline.Item>
          <Timeline.Item color="teal" tone="danger">
            <Timeline.Title>Toned</Timeline.Title>
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
            <Timeline.Title>Link row</Timeline.Title>
          </Timeline.Item>
          <Timeline.Item asChild current>
            <a href="/events/2" data-custom="yes">
              <Timeline.Title>Custom row</Timeline.Title>
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
    expect(links[1]).toHaveAttribute("data-state", "active");
    expect(links[1].querySelector(`.${styles.dot}`)).toBeTruthy();
    expect(within(links[1]).getByText("Custom row")).toBeInTheDocument();
  });

  it("value is a right-aligned tabular cell with an optional tone", () => {
    render(
      <Timeline.Root>
        <Timeline.Group>
          <Timeline.Item>
            <Timeline.Title>Row</Timeline.Title>
            <Timeline.Value>+6 300 ฿</Timeline.Value>
            <Timeline.Value tone="danger">−689 ฿</Timeline.Value>
          </Timeline.Item>
        </Timeline.Group>
      </Timeline.Root>,
    );
    const plain = screen.getByText("+6 300 ฿");
    expect(plain).toHaveClass(styles.value);
    expect(plain).toHaveAttribute("data-tone", "neutral");
    expect(screen.getByText("−689 ฿")).toHaveAttribute("data-tone", "danger");
  });

  it("value takes a muted second line via ValueMeta", () => {
    render(
      <Timeline.Root>
        <Timeline.Group>
          <Timeline.Item>
            <Timeline.Title>ТО: замена масла</Timeline.Title>
            <Timeline.Value>
              900 ฿<Timeline.ValueMeta>ТО</Timeline.ValueMeta>
            </Timeline.Value>
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
          <Timeline.Gap trailing="сейчас">Без обслуживания 26 дней · 300 км</Timeline.Gap>
          <Timeline.Item>
            <Timeline.Title>ТО: замена масла</Timeline.Title>
          </Timeline.Item>
          <Timeline.Gap tone="warning">100 дней · 4 400 км без обслуживания</Timeline.Gap>
          <Timeline.Item>
            <Timeline.Title>Резина зад + работа</Timeline.Title>
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
  });

  it("highlight mode: current by default, hover on request; hover rows stay focusable", () => {
    const { container, rerender } = render(<Feed current="b" />);
    expect(container.firstElementChild).toHaveAttribute("data-highlight", "current");
    rerender(
      <Timeline.Root highlight="hover">
        <Timeline.Group label="Операции">
          <Timeline.Item href="#a" current>
            <Timeline.Title>Аренда закончилась</Timeline.Title>
          </Timeline.Item>
        </Timeline.Group>
      </Timeline.Root>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-highlight", "hover");
    const link = screen.getByRole("link", { name: "Аренда закончилась" });
    // `current` keeps its semantics in hover mode; the look is driven by :hover / :focus-visible.
    expect(link).toHaveAttribute("aria-current", "true");
    link.focus();
    expect(link).toHaveFocus();
  });

  it("CSS gates the persistent highlight to current mode and the transient one to hover mode", () => {
    const css = readFileSync(join(__dirname, "Timeline.module.css"), "utf8");
    expect(css).toMatch(/\.root\[data-highlight="current"\] \.row\[data-state="active"\]/);
    expect(css).toMatch(/\.root\[data-highlight="hover"\] \.row:is\(:hover, :focus-visible\)/);
    expect(css).not.toMatch(/^\.row\[data-state="active"\] \{/m);
  });
});
