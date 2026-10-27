import { render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { StatusDot } from "@/components/status-dot/StatusDot";
import { cssRule, cssValue } from "@/test/css";

import {
  HeaderLineContent,
  HeaderRowContent,
  headerRowStyles,
  SectionTitle,
  useTitleFloor,
} from "./headerRow";

const CSS = "src/internal/headerRow.module.css";

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

  it("finds a StatusDot behind the consumer's own component by its marker", async () => {
    function LineState({ live }: { live: boolean }) {
      return (
        <>
          <StatusDot tone={live ? "success" : "neutral"}>{live ? "В эфире" : "Выключен"}</StatusDot>
          {live ? "192.168.1.47" : null}
        </>
      );
    }
    const view = render(
      <div>
        <HeaderLineContent>
          <LineState live />
        </HeaderLineContent>
      </div>,
    );
    const text = view.container.querySelector(`.${headerRowStyles.descriptionText}`);
    expect(text?.firstElementChild).toHaveAttribute("data-status-dot");
    expect(text).toHaveAttribute("data-lead-dot");
    // The dot alone: nothing to separate it from.
    view.rerender(
      <div>
        <HeaderLineContent>
          <LineState live={false} />
        </HeaderLineContent>
      </div>,
    );
    await waitFor(() => expect(text).not.toHaveAttribute("data-lead-dot"));
    const after = cssRule(
      CSS,
      ".descriptionText[data-lead-dot] > [data-status-dot]:first-child::after",
    );
    expect(cssValue(after, "content")).toBe('"·" / ""');
  });

  it("leaves a dot written straight in the line to the element-type path", () => {
    const { container } = render(
      <div>
        <HeaderLineContent>
          <StatusDot tone="success">Оплачен</StatusDot>
          Обновлён вчера
        </HeaderLineContent>
      </div>,
    );
    expect(container.querySelector("[data-lead-dot]")).toBeNull();
    expect(container.querySelector(`.${headerRowStyles.separator}`)).not.toBeNull();
  });
});

describe("header row CSS", () => {
  const TRIMMED =
    '.header[data-lines="two"]:not(:has(> .mark)):is(:not(:only-child), [data-nested])';
  const SUPPORTS = ["@supports (text-box: trim-start cap alphabetic)"];

  it("clips a title only along its line, so a cap-trimmed title keeps its glyph tops", () => {
    const title = cssRule(CSS, ".title");
    expect(cssValue(title, "overflow-x")).toBe("clip");
    expect(cssValue(title, "overflow-y")).toBe("visible");
    expect(cssValue(title, "text-overflow")).toBe("ellipsis");
    expect(cssValue(cssRule(CSS, `${TRIMMED} .title`, SUPPORTS), "text-box")).toBe(
      "trim-start cap alphabetic",
    );
  });

  it("stands the badges of a trimmed title on its baseline", () => {
    expect(cssValue(cssRule(CSS, ".titleRow"), "align-items")).toBe("center");
    expect(cssValue(cssRule(CSS, `${TRIMMED} .titleRow`, SUPPORTS), "align-items")).toBe(
      "baseline",
    );
  });
});
