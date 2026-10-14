import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";

import { DescriptionList } from "./DescriptionList";

describe("DescriptionList", () => {
  it("renders a definition list of terms and values", () => {
    const { container } = render(
      <DescriptionList.Root>
        <DescriptionList.Item label="Клиент">ООО «Север»</DescriptionList.Item>
        <DescriptionList.Item label="ИНН">7701234567</DescriptionList.Item>
      </DescriptionList.Root>,
    );
    const list = container.querySelector("dl");
    expect(list).toHaveAttribute("data-size", "m");
    expect(list).toHaveAttribute("data-orientation", "horizontal");
    expect(screen.getAllByRole("term").map((t) => t.textContent)).toEqual(["Клиент", "ИНН"]);
    expect(screen.getAllByRole("definition")[0]).toHaveTextContent("ООО «Север»");
  });

  it("marks an empty value with a muted dash and speaks it from labels", () => {
    render(
      <DescriptionList.Root labels={{ emptyText: "Нет данных" }}>
        <DescriptionList.Item label="Менеджер">{null}</DescriptionList.Item>
        <DescriptionList.Item label="Комментарий">{""}</DescriptionList.Item>
      </DescriptionList.Root>,
    );
    const [manager, comment] = screen.getAllByRole("definition");
    expect(manager).toHaveAttribute("data-empty", "true");
    expect(manager).toHaveTextContent("—Нет данных");
    expect(within(manager).getByText("—")).toHaveAttribute("aria-hidden", "true");
    expect(comment).toHaveAttribute("data-empty", "true");
  });

  it("takes its tier from the host and from size", () => {
    const { container, rerender } = render(
      <ControlSizeProvider value="s">
        <DescriptionList.Root>
          <DescriptionList.Item label="Город">Казань</DescriptionList.Item>
        </DescriptionList.Root>
      </ControlSizeProvider>,
    );
    expect(container.querySelector("dl")).toHaveAttribute("data-size", "s");
    rerender(
      <ControlSizeProvider value="s">
        <DescriptionList.Root size="xl" orientation="vertical">
          <DescriptionList.Item label="Город">Казань</DescriptionList.Item>
        </DescriptionList.Root>
      </ControlSizeProvider>,
    );
    expect(container.querySelector("dl")).toHaveAttribute("data-size", "xl");
    expect(container.querySelector("dl")).toHaveAttribute("data-orientation", "vertical");
  });

  it("puts a row action at the end of the value, reachable and named from the keyboard", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <DescriptionList.Root>
        <DescriptionList.Item label="Телефон">
          +7 900 123-45-67
          <DescriptionList.ItemAction label="Позвонить" onClick={onClick}>
            <span>☎</span>
          </DescriptionList.ItemAction>
        </DescriptionList.Item>
      </DescriptionList.Root>,
    );
    const value = screen.getByRole("definition");
    const action = within(value).getByRole("button", { name: "Позвонить" });
    expect(value).not.toHaveAttribute("data-empty");
    await user.tab();
    expect(action).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("a row action may be a link with the button look (asChild)", () => {
    render(
      <DescriptionList.Root>
        <DescriptionList.Item label="Почта">
          finance@severny-veter.ru
          <DescriptionList.ItemAction label="Написать" asChild>
            <a href="mailto:finance@severny-veter.ru">
              <svg aria-hidden="true" />
            </a>
          </DescriptionList.ItemAction>
        </DescriptionList.Item>
      </DescriptionList.Root>,
    );
    expect(screen.getByRole("link", { name: "Написать" })).toHaveAttribute(
      "href",
      "mailto:finance@severny-veter.ru",
    );
  });

  it("forwards refs and native attributes", () => {
    const listRef = React.createRef<HTMLDListElement>();
    const itemRef = React.createRef<HTMLDivElement>();
    render(
      <DescriptionList.Root ref={listRef} aria-label="Реквизиты">
        <DescriptionList.Item ref={itemRef} label="КПП" className="row">
          770101001
        </DescriptionList.Item>
      </DescriptionList.Root>,
    );
    expect(listRef.current?.tagName).toBe("DL");
    expect(listRef.current).toHaveAttribute("aria-label", "Реквизиты");
    expect(itemRef.current).toHaveClass("row");
  });
});
