import { fireEvent, render } from "@testing-library/react";
import postcss from "postcss";
import type * as React from "react";

import { cssRules } from "@/test/css";

import { isPlainClick, opensRow } from "./rowLink";

/** One sample of every kind of control a row holds. */
const CONTROLS = [
  '<a href="/orders/1">Заказ</a>',
  "<button>Удалить</button>",
  "<input />",
  "<select></select>",
  "<textarea></textarea>",
  "<label>Метка</label>",
  "<summary>Подробнее</summary>",
  '<span contenteditable="true">Заметка</span>',
  '<span contenteditable="">Заметка</span>',
  '<span tabindex="0">Фокус</span>',
  '<span role="button">Кнопка</span>',
  '<span role="link">Ссылка</span>',
  '<span role="checkbox">Флажок</span>',
  '<span role="radio">Вариант</span>',
  '<span role="switch">Переключатель</span>',
  '<span role="menuitem">Пункт</span>',
  '<span role="menuitemcheckbox">Пункт</span>',
  '<span role="menuitemradio">Пункт</span>',
  '<span role="option">Вариант</span>',
  '<span role="tab">Вкладка</span>',
  '<span role="slider">Ползунок</span>',
  '<span role="combobox">Выбор</span>',
  '<span role="textbox">Поле</span>',
  "<span data-row-click-ignore>Виджет</span>",
];

/** The selectors the stylesheet raises above a stretched link. */
function raisedSelectors(): string[] {
  const rule = cssRules("src/internal/rowLink.module.css").find((item) =>
    item.selector.startsWith(":where(.host)"),
  );
  if (!rule) throw new Error("rowLink.module.css: no .host rule");
  const list = rule.selector.replace(/^:where\(\.host\)\s*:where\(/, "").replace(/\)$/, "");
  return postcss.list.comma(list);
}

function clickInRow(html: string) {
  const onClick = vi.fn((event: React.MouseEvent<HTMLElement>) => opensRow(event));
  const { container } = render(
    // biome-ignore lint/a11y/useKeyWithClickEvents: a click-only probe of the row predicate
    // biome-ignore lint/a11y/noStaticElementInteractions: a click-only probe of the row predicate
    <div data-testid="row" onClick={onClick}>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: fixed samples of the test */}
      <span dangerouslySetInnerHTML={{ __html: html }} />
    </div>,
  );
  const holder = container.querySelector("span");
  const target = holder?.firstElementChild ?? holder;
  if (!target) throw new Error("no sample");
  fireEvent.click(target);
  return { opened: onClick.mock.results[0]?.value as boolean, target };
}

describe("rowLink", () => {
  it("a click on a control inside the row never opens it; plain content does", () => {
    for (const html of CONTROLS) expect(clickInRow(html).opened, html).toBe(false);
    expect(clickInRow("Сумма 12 400 ₽").opened).toBe(true);
  });

  it("the row's own link opens it", () => {
    expect(clickInRow('<a href="/orders/1" data-row-link>Заказ</a>').opened).toBe(true);
  });

  it("the stylesheet raises exactly the controls the predicate skips", () => {
    const selectors = raisedSelectors();
    const samples = CONTROLS.map((html) => clickInRow(html).target);
    // Every control is raised, and every raised selector stands for a control.
    for (const sample of samples) {
      expect(
        selectors.some((selector) => sample.matches(selector)),
        sample.outerHTML,
      ).toBe(true);
    }
    for (const selector of selectors) {
      expect(
        samples.some((sample) => sample.matches(selector)),
        selector,
      ).toBe(true);
    }
    expect(selectors).toHaveLength(CONTROLS.length);
    // The row's own link stays under the controls.
    const own = clickInRow('<a href="/orders/1" data-row-link>Заказ</a>').target;
    expect(selectors.some((selector) => own.matches(selector))).toBe(false);
  });

  it("a plain click has no modifier", () => {
    const base = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false };
    expect(isPlainClick(base as React.MouseEvent)).toBe(true);
    expect(isPlainClick({ ...base, metaKey: true } as React.MouseEvent)).toBe(false);
    expect(isPlainClick({ ...base, button: 1 } as React.MouseEvent)).toBe(false);
  });
});
