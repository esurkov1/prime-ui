import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { List } from "./List";

function Dialogs({ onOpen }: { onOpen?: (id: string) => void }) {
  const [current, setCurrent] = React.useState("granit");
  const open = (id: string) => {
    setCurrent(id);
    onOpen?.(id);
  };
  return (
    <List.Root aria-label="Диалоги">
      <List.Item current={current === "granit"} onClick={() => open("granit")}>
        <List.ItemText>ООО «Гранит»</List.ItemText>
        <List.ItemDescription>Счёт № 4821 пришёл без НДС</List.ItemDescription>
        <List.ItemMeta>15:02</List.ItemMeta>
        <List.ItemCount color="blue">2</List.ItemCount>
      </List.Item>
      <List.Item current={current === "leto"} onClick={() => open("leto")}>
        <List.ItemText>ООО «Лето»</List.ItemText>
      </List.Item>
      <List.Item disabled onClick={() => open("archive")}>
        <List.ItemText>Архив</List.ItemText>
      </List.Item>
    </List.Root>
  );
}

describe("List", () => {
  it("renders a named list of rows, each a button inside a list item", () => {
    render(<Dialogs />);
    const list = screen.getByRole("list", { name: "Диалоги" });
    expect(list.tagName).toBe("UL");
    expect(list).toHaveAttribute("data-size", "m");
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    for (const item of items) expect(item.firstElementChild?.tagName).toBe("BUTTON");
  });

  it("names a row by its text, description, meta and count", () => {
    render(<Dialogs />);
    expect(
      screen.getByRole("button", { name: "ООО «Гранит» Счёт № 4821 пришёл без НДС 15:02 2" }),
    ).toBeInTheDocument();
  });

  it('marks the current row with aria-current="true" and moves it on click', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<Dialogs onOpen={onOpen} />);
    const granit = screen.getByRole("button", { name: /Гранит/ });
    const leto = screen.getByRole("button", { name: "ООО «Лето»" });
    expect(granit).toHaveAttribute("aria-current", "true");
    expect(leto).not.toHaveAttribute("aria-current");

    await user.click(leto);
    expect(onOpen).toHaveBeenCalledWith("leto");
    expect(leto).toHaveAttribute("aria-current", "true");
    expect(granit).not.toHaveAttribute("aria-current");
  });

  it("moves between rows with Tab and opens one with Enter and Space", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<Dialogs onOpen={onOpen} />);

    await user.tab();
    expect(screen.getByRole("button", { name: /Гранит/ })).toHaveFocus();
    await user.tab();
    const leto = screen.getByRole("button", { name: "ООО «Лето»" });
    expect(leto).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(onOpen).toHaveBeenLastCalledWith("leto");
    await user.keyboard(" ");
    expect(onOpen).toHaveBeenCalledTimes(2);

    // The disabled row is skipped.
    await user.tab();
    expect(document.body).toHaveFocus();
  });

  it("a disabled row is a disabled button and ignores clicks", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<Dialogs onOpen={onOpen} />);
    const archive = screen.getByRole("button", { name: "Архив" });
    expect(archive).toBeDisabled();
    expect(archive).toHaveAttribute("data-disabled", "true");
    await user.click(archive);
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('a link row keeps its href and marks the current one with aria-current="page"', () => {
    render(
      <List.Root aria-label="Счета">
        <List.Item href="/invoices/4821" current>
          <List.ItemText>Счёт № 4821</List.ItemText>
        </List.Item>
        <List.Item href="/invoices/4830" disabled>
          <List.ItemText>Счёт № 4830</List.ItemText>
        </List.Item>
      </List.Root>,
    );
    const current = screen.getByRole("link", { name: "Счёт № 4821" });
    expect(current).toHaveAttribute("href", "/invoices/4821");
    expect(current).toHaveAttribute("aria-current", "page");
    // A disabled link has no href: it is not a link to follow nor a Tab stop.
    const disabled = screen.getByText("Счёт № 4830").closest("a");
    expect(disabled).not.toHaveAttribute("href");
    expect(disabled).toHaveAttribute("aria-disabled", "true");
  });

  it("asChild renders the child element as the row and keeps its href", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(
      <List.Root aria-label="Задачи">
        <List.Item asChild current onClick={onClick}>
          <a href="/tasks/118" data-router="">
            <List.ItemText>Задача № 118</List.ItemText>
            <List.ItemMeta>вчера</List.ItemMeta>
          </a>
        </List.Item>
        <List.Item asChild disabled onClick={onClick}>
          <a href="/tasks/119">
            <List.ItemText>Задача № 119</List.ItemText>
          </a>
        </List.Item>
      </List.Root>,
    );
    const link = screen.getByRole("link", { name: "Задача № 118 вчера" });
    expect(link).toHaveAttribute("href", "/tasks/118");
    expect(link).toHaveAttribute("data-router", "");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link.closest("li")).toBeInTheDocument();
    await user.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);

    const disabled = screen.getByRole("link", { name: "Задача № 119" });
    expect(disabled).toHaveAttribute("href", "/tasks/119");
    expect(disabled).toHaveAttribute("aria-disabled", "true");
    expect(disabled).toHaveAttribute("tabindex", "-1");
    await user.click(disabled);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("places the parts: a leading icon, the body, the trail; a trailing icon after the text", () => {
    render(
      <List.Root size="s" aria-label="Проекты">
        <List.Item>
          <List.ItemIcon>
            <svg data-testid="lead" />
          </List.ItemIcon>
          Внедрение CRM
          <List.ItemIcon>
            <svg data-testid="trail" />
          </List.ItemIcon>
        </List.Item>
      </List.Root>,
    );
    const button = screen.getByRole("button", { name: "Внедрение CRM" });
    const lead = screen.getByTestId("lead").parentElement as HTMLElement;
    const trail = screen.getByTestId("trail").parentElement as HTMLElement;
    expect(lead).toHaveAttribute("aria-hidden", "true");
    expect(lead).not.toHaveAttribute("data-edge");
    expect(trail).toHaveAttribute("data-edge", "end");
    expect(button.firstElementChild).toBe(lead);
    // Loose content becomes the text line.
    expect(screen.getByText("Внедрение CRM").tagName).toBe("SPAN");
  });

  it("passes size to the count badge one tier down", () => {
    render(
      <List.Root size="l" aria-label="Очереди">
        <List.Item>
          <List.ItemText>Входящие</List.ItemText>
          <List.ItemCount>12</List.ItemCount>
        </List.Item>
      </List.Root>,
    );
    expect(screen.getByRole("list")).toHaveAttribute("data-size", "l");
    expect(screen.getByText("12").closest("[data-tier]")).toHaveAttribute("data-tier", "m");
  });

  it("sends ref, className and native attributes to the row element", () => {
    const ref = React.createRef<HTMLElement>();
    render(
      <List.Root aria-label="Диалоги">
        <List.Item ref={ref} className="custom" data-id="granit">
          <List.ItemText>ООО «Гранит»</List.ItemText>
        </List.Item>
      </List.Root>,
    );
    const button = screen.getByRole("button", { name: "ООО «Гранит»" });
    expect(ref.current).toBe(button);
    expect(button).toHaveClass("custom");
    expect(button).toHaveAttribute("data-id", "granit");
    expect(button).toHaveAttribute("type", "button");
  });
});
