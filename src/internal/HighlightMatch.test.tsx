import { render } from "@testing-library/react";

import { HighlightMatch, highlightChildren, matchIndex } from "./HighlightMatch";

describe("HighlightMatch", () => {
  it("finds the first match regardless of case; an empty query matches nothing", () => {
    expect(matchIndex("Счёт на оплату", "ОПЛ")).toBe(8);
    expect(matchIndex("Счёт на оплату", "")).toBe(-1);
  });

  it("marks the first match, or every match with `all`", () => {
    const { container, rerender } = render(
      <HighlightMatch text="Заказ за заказом" query="заказ" />,
    );
    expect([...container.querySelectorAll("mark")].map((mark) => mark.textContent)).toEqual([
      "Заказ",
    ]);
    rerender(<HighlightMatch text="Заказ за заказом" query="заказ" all />);
    expect([...container.querySelectorAll("mark")].map((mark) => mark.textContent)).toEqual([
      "Заказ",
      "заказ",
    ]);
    expect(container).toHaveTextContent("Заказ за заказом");
  });

  it("is plain text when nothing matches", () => {
    const { container } = render(<HighlightMatch text="Проект" query="счёт" />);
    expect(container.innerHTML).toBe("Проект");
  });

  it("marks string children and passes elements through", () => {
    const { container } = render(
      <div>{highlightChildren(["Отчёт ", 2024, <b key="b">отчёт</b>], "от")}</div>,
    );
    expect(container.querySelectorAll("mark")).toHaveLength(1);
    expect(container.querySelector("b")).toHaveTextContent("отчёт");
    expect(highlightChildren("Отчёт", " ")).toBe("Отчёт");
  });
});
