import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { StatusDot } from "@/components/status-dot/StatusDot";

import {
  HeaderLineContent,
  HeaderRowContent,
  headerRowStyles,
  SectionTitle,
  useTitleFloor,
} from "./headerRow";

describe("HeaderRowContent", () => {
  it("places mark, titles (title row, then description) and end whatever the order given", () => {
    const { container } = render(
      <div>
        <HeaderRowContent
          end={<i data-testid="end" />}
          description={<p data-testid="description" />}
          badges={<b data-testid="badges" />}
          title={<h3 data-testid="title">Заказ</h3>}
          mark={<u data-testid="mark" />}
        />
      </div>,
    );
    const [mark, titles, end] = [...(container.firstElementChild?.children ?? [])];
    expect(mark).toBe(screen.getByTestId("mark"));
    expect(end).toBe(screen.getByTestId("end"));
    expect(titles).toHaveClass(headerRowStyles.titles);
    const [row, description] = [...titles.children];
    expect(row).toHaveClass(headerRowStyles.titleRow);
    expect([...row.children]).toEqual([screen.getByTestId("title"), screen.getByTestId("badges")]);
    expect(description).toBe(screen.getByTestId("description"));
  });

  it("draws the titles wrapper only when there is text", () => {
    const { container } = render(
      <div>
        <HeaderRowContent mark={<u />} end={<i />} title={false} badges={null} />
      </div>,
    );
    expect(container.querySelector(`.${headerRowStyles.titles}`)).toBeNull();
  });
});

describe("useTitleFloor", () => {
  function Title({ text }: { text: string }) {
    const ref = React.useRef<HTMLHeadingElement>(null);
    useTitleFloor(ref);
    return (
      <div className={headerRowStyles.titles} data-testid="titles">
        <h3 ref={ref} data-testid="title">
          {text}
        </h3>
      </div>
    );
  }

  it("sets --header-title-min to the smaller of the text and 8em", () => {
    const widths = { current: 0 };
    const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollWidth");
    Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
      configurable: true,
      get: () => widths.current,
    });
    const size = vi
      .spyOn(window, "getComputedStyle")
      .mockImplementation(() => ({ fontSize: "10px" }) as CSSStyleDeclaration);
    try {
      widths.current = 50;
      const view = render(<Title text="Заказ" />);
      const floor = (id: string) =>
        screen.getByTestId(id).style.getPropertyValue("--header-title-min");
      expect(floor("title")).toBe("50px");
      // The titles column wraps the row by the same floor.
      expect(floor("titles")).toBe("50px");
      widths.current = 300;
      view.rerender(<Title text="Очень длинное название заказа" />);
      expect(floor("title")).toBe("80px");
      expect(floor("titles")).toBe("80px");
    } finally {
      if (original) Object.defineProperty(HTMLElement.prototype, "scrollWidth", original);
      else Reflect.deleteProperty(HTMLElement.prototype, "scrollWidth");
      size.mockRestore();
    }
  });
});

describe("SectionTitle", () => {
  it("is a plain wrapping heading without a number or badges", () => {
    render(
      <SectionTitle as="h2" className="own">
        Реквизиты
      </SectionTitle>,
    );
    const heading = screen.getByRole("heading", { level: 2, name: "Реквизиты" });
    expect(heading).toHaveClass("own");
    expect(heading).not.toHaveClass(headerRowStyles.title);
    expect(heading.parentElement).not.toHaveClass(headerRowStyles.titleRow);
  });

  it("names a record on one title line: the name, its number, then the badges", () => {
    render(
      <SectionTitle as="h3" number="#852" badges={<b data-testid="badges" />}>
        Сделка 15 окт
      </SectionTitle>,
    );
    const heading = screen.getByRole("heading", { level: 3, name: "Сделка 15 окт #852" });
    expect(heading).toHaveClass(headerRowStyles.title, headerRowStyles.numbered);
    const [name, number] = [...heading.children];
    expect(name).toHaveClass(headerRowStyles.name);
    expect(number).toHaveClass(headerRowStyles.number);
    expect(number).toHaveTextContent("#852");
    const row = heading.parentElement;
    expect(row).toHaveClass(headerRowStyles.titleRow);
    expect(row?.lastElementChild).toBe(screen.getByTestId("badges"));
  });

  it("takes badges alone without a number", () => {
    render(
      <SectionTitle as="h3" badges={<b data-testid="badges" />}>
        Сделка 15 окт
      </SectionTitle>,
    );
    const heading = screen.getByRole("heading", { name: "Сделка 15 окт" });
    expect(heading).toHaveClass(headerRowStyles.title);
    expect(heading).not.toHaveClass(headerRowStyles.numbered);
  });
});

describe("HeaderLineContent", () => {
  it("separates a StatusDot from the cut text with a «·»", () => {
    const { container } = render(
      <div>
        <HeaderLineContent>
          Обновлён вчера
          <StatusDot tone="success">Оплачен</StatusDot>
        </HeaderLineContent>
      </div>,
    );
    const [dot, separator, text] = [...(container.firstElementChild?.children ?? [])];
    expect(dot).toHaveTextContent("Оплачен");
    expect(separator).toHaveAttribute("aria-hidden", "true");
    expect(separator).toHaveClass(headerRowStyles.separator);
    expect(text).toHaveClass(headerRowStyles.descriptionText);
  });

  it("has no separator for text alone or a StatusDot alone", () => {
    const { container } = render(
      <div>
        <HeaderLineContent>Обновлён вчера</HeaderLineContent>
        <HeaderLineContent>
          <StatusDot tone="warning">Ждёт оплаты</StatusDot>
        </HeaderLineContent>
      </div>,
    );
    expect(container.querySelector(`.${headerRowStyles.separator}`)).toBeNull();
  });
});
