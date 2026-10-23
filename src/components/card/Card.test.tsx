import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Avatar } from "@/components/avatar/Avatar";
import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { ProgressCircle } from "@/components/progress-circle/ProgressCircle";
import { StatusDot } from "@/components/status-dot/StatusDot";
import { Switch } from "@/components/switch/Switch";
import { Icon } from "@/icons";
import headerRow from "@/internal/headerRow.module.css";
import rowLink from "@/internal/rowLink.module.css";
import surfaceFrame from "@/internal/surfaceFrame.module.css";
import { cssRule, cssValue } from "@/test/css";

import { Card } from "./Card";
import styles from "./Card.module.css";

const CSS = "src/components/card/Card.module.css";
const HEADER_CSS = "src/internal/headerRow.module.css";

describe("Card.Root", () => {
  it("is a surface of the ladder with its own class and ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Card.Root ref={ref} data-testid="card" className="own">
        <Card.Header>
          <Card.Title>Выручка</Card.Title>
        </Card.Header>
      </Card.Root>,
    );
    const card = screen.getByTestId("card");
    expect(card).toBe(ref.current);
    expect(card).toHaveClass(styles.root, "own");
    expect(card).toHaveAttribute("data-depth", "1");
    expect(card).toHaveAttribute("data-size", "m");
    expect(cssValue(cssRule(CSS, ".root"), "background")).toBe("var(--prime-color-layer-current)");
  });

  it("stands one step deeper inside another card", () => {
    render(
      <Card.Root data-testid="outer">
        <Card.Body>
          <Card.Root data-testid="inner">
            <Card.Body>Накладная</Card.Body>
          </Card.Root>
        </Card.Body>
      </Card.Root>,
    );
    expect(screen.getByTestId("outer")).toHaveAttribute("data-depth", "1");
    expect(screen.getByTestId("inner")).toHaveAttribute("data-depth", "2");
  });

  it("has five sets of metrics, one per size", () => {
    render(
      (["xs", "s", "m", "l", "xl"] as const).map((size) => (
        <Card.Root key={size} size={size} data-testid={size}>
          <Card.Body>Сводка</Card.Body>
        </Card.Root>
      )),
    );
    const sizes = ["xs", "s", "m", "l", "xl"].map((id) =>
      screen.getByTestId(id).getAttribute("data-size"),
    );
    expect(sizes).toEqual(["xs", "s", "m", "l", "xl"]);
    expect(sizes).toEqual(
      ["xs", "s", "m", "l", "xl"].map((id) => screen.getByTestId(id).getAttribute("data-frame")),
    );
    expect(screen.getByTestId("m")).toHaveClass(surfaceFrame.frame);
  });

  it("takes the tier of the host around it", () => {
    render(
      <Card.Root size="l">
        <Card.Body>
          <Card.Root data-testid="inner">
            <Card.Body>Накладная</Card.Body>
          </Card.Root>
        </Card.Body>
      </Card.Root>,
    );
    expect(screen.getByTestId("inner")).toHaveAttribute("data-size", "l");
  });

  it("is a pane without a zone: no padding, content edge to edge", () => {
    render(
      <>
        <Card.Root data-testid="pane">
          <div>Лента чата</div>
        </Card.Root>
        <Card.Root data-testid="zoned">
          <Card.Body>Сводка</Card.Body>
        </Card.Root>
      </>,
    );
    expect(screen.getByTestId("pane")).toHaveAttribute("data-bare");
    expect(screen.getByTestId("zoned")).not.toHaveAttribute("data-bare");
    expect(cssValue(cssRule(CSS, ".root[data-bare]"), "gap")).toBe("0");
    expect(cssValue(cssRule(CSS, '.root[data-cover="start"], .root[data-bare]'), "padding")).toBe(
      "0",
    );
  });

  it("marks a start cover as a split of the cover and the zones", () => {
    render(
      <Card.Root data-testid="card">
        <Card.Media placement="start" data-testid="media">
          <img src="unit.jpg" alt="" />
        </Card.Media>
        <Card.Header>
          <Card.Title>Honda PCX 160</Card.Title>
        </Card.Header>
        <Card.Body>Пробег 12 000 км</Card.Body>
      </Card.Root>,
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("data-cover", "start");
    const split = card.firstElementChild as HTMLElement;
    expect(split).toHaveClass(styles.split);
    expect(split.firstElementChild).toBe(screen.getByTestId("media"));
    expect(screen.getByTestId("media")).toHaveAttribute("data-placement", "start");
    const main = split.lastElementChild as HTMLElement;
    expect(main).toHaveClass(styles.main);
    expect(main).toContainElement(screen.getByRole("heading", { name: "Honda PCX 160" }));
    expect(main).not.toContainElement(screen.getByTestId("media"));
    // From 30rem a column as wide as the photo's ratio makes it; narrower it stays on top.
    const column = cssRule(CSS, '.media[data-placement="start"]', ["@container"]);
    expect(cssValue(column, "flex")).toBe(
      "0 0 var(--card-cover-width, min(40%, var(--prime-layout-tile-min-width)))",
    );
  });

  it("sizes a start cover by the zones' height and the photo's ratio, half the card at most", () => {
    const height = vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(120);
    const width = vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(600);
    const { rerender } = render(
      <Card.Root>
        <Card.Media placement="start" data-testid="media">
          <div style={{ aspectRatio: "4 / 3" }} />
        </Card.Media>
        <Card.Header>
          <Card.Title>Honda PCX 160</Card.Title>
        </Card.Header>
      </Card.Root>,
    );
    const media = screen.getByTestId("media");
    expect(media.style.getPropertyValue("--card-cover-width")).toBe("160px");
    width.mockReturnValue(200);
    rerender(
      <Card.Root>
        <Card.Media placement="start" data-testid="media">
          <div style={{ aspectRatio: "4 / 3" }} />
        </Card.Media>
        <Card.Header>
          <Card.Title>Honda PCX 160</Card.Title>
        </Card.Header>
      </Card.Root>,
    );
    expect(media.style.getPropertyValue("--card-cover-width")).toBe("100px");
    height.mockRestore();
    width.mockRestore();
  });

  it("puts a top cover first, edge to edge", () => {
    render(
      <Card.Root data-testid="card">
        <Card.Media data-testid="media">
          <img src="unit.jpg" alt="" />
        </Card.Media>
        <Card.Header>
          <Card.Title>Honda PCX 160</Card.Title>
        </Card.Header>
      </Card.Root>,
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("data-cover", "top");
    expect(card.firstElementChild).toBe(screen.getByTestId("media"));
    expect(screen.getByTestId("media")).toHaveAttribute("data-placement", "top");
    expect(card).not.toHaveAttribute("data-bare");
  });
});

describe("Card.Header", () => {
  function arranged(header: React.ReactNode) {
    render(
      <Card.Root>
        <Card.Header data-testid="header">{header}</Card.Header>
      </Card.Root>,
    );
    return screen.getByTestId("header");
  }

  it("arranges its parts whatever the order they are written in", () => {
    const header = arranged(
      <>
        <Card.Actions data-testid="actions">
          <Button.Root variant="ghost">Ещё</Button.Root>
        </Card.Actions>
        <Card.Description data-testid="description">Обновлён вчера</Card.Description>
        <Card.Badges data-testid="badges">
          <Badge.Root>В работе</Badge.Root>
        </Card.Badges>
        <Card.Title data-testid="title">Заказ 1042</Card.Title>
        <Card.Icon data-testid="icon">
          <Icon name="action.more" />
        </Card.Icon>
      </>,
    );
    const [icon, titles, actions] = [...header.children] as HTMLElement[];
    expect(icon).toBe(screen.getByTestId("icon"));
    expect(actions).toBe(screen.getByTestId("actions"));
    const [titleRow, description] = [...titles.children] as HTMLElement[];
    expect(titles).toHaveClass(headerRow.titles);
    expect(description).toBe(screen.getByTestId("description"));
    expect([...titleRow.children]).toEqual([
      screen.getByTestId("title"),
      screen.getByTestId("badges"),
    ]);
  });

  it("puts the indicator at the end like the actions", () => {
    const header = arranged(
      <>
        <Card.Indicator type="radio" data-testid="indicator" />
        <Card.Title>Тариф «Команда»</Card.Title>
      </>,
    );
    expect(header.lastElementChild).toBe(screen.getByTestId("indicator"));
  });

  it("is one line without a description and two with it", () => {
    render(
      <>
        <Card.Root>
          <Card.Header data-testid="one">
            <Card.Title>Заказ 1042</Card.Title>
          </Card.Header>
        </Card.Root>
        <Card.Root>
          <Card.Header data-testid="two">
            <Card.Title>Заказ 1043</Card.Title>
            <Card.Description>Обновлён вчера</Card.Description>
          </Card.Header>
        </Card.Root>
      </>,
    );
    expect(screen.getByTestId("one")).toHaveAttribute("data-lines", "one");
    expect(screen.getByTestId("two")).toHaveAttribute("data-lines", "two");
    // The controls of a one-line header share the title's centre line.
    expect(
      cssValue(
        cssRule(HEADER_CSS, '.header[data-lines="one"], .header:has(> .mark), .header:only-child'),
        "align-items",
      ),
    ).toBe("center");
  });
});

describe("Card.Icon", () => {
  it("is an accent tile of one icon sized by the card: 32 · 32 · 40 · 48 · 56", () => {
    render(
      (["xs", "s", "m", "l", "xl"] as const).map((size) => (
        <Card.Root key={size} size={size}>
          <Card.Header>
            <Card.Icon data-testid={size}>
              <Icon name="action.more" />
            </Card.Icon>
            <Card.Title>Заказ</Card.Title>
          </Card.Header>
        </Card.Root>
      )),
    );
    expect(
      ["xs", "s", "m", "l", "xl"].map((id) => screen.getByTestId(id).getAttribute("data-size")),
    ).toEqual(["xs", "xs", "s", "m", "l"]);
    expect(screen.getByTestId("m")).toHaveAttribute("data-tone", "accent");
    expect(screen.getByTestId("m")).not.toHaveAttribute("data-media");
  });

  it("is one step smaller on a one-line card with a switch (24 · 24 · 32 · 40 · 48)", () => {
    render(
      <>
        <Card.Root size="m">
          <Card.Header data-testid="row">
            <Card.Icon data-testid="row-icon">
              <Icon name="action.more" />
            </Card.Icon>
            <Card.Title>Уведомления</Card.Title>
            <Card.Actions>
              <Switch.Root aria-label="Уведомления" />
            </Card.Actions>
          </Card.Header>
        </Card.Root>
        <Card.Root size="m">
          <Card.Header data-testid="two">
            <Card.Icon data-testid="two-icon">
              <Icon name="action.more" />
            </Card.Icon>
            <Card.Title>Уведомления</Card.Title>
            <Card.Description>Почта и мессенджеры</Card.Description>
            <Card.Actions>
              <Switch.Root aria-label="Уведомления" />
            </Card.Actions>
          </Card.Header>
        </Card.Root>
        <Card.Root size="s">
          <Card.Header>
            <Card.Icon data-testid="row-s">
              <Icon name="action.more" />
            </Card.Icon>
            <Card.Title>Уведомления</Card.Title>
            <Card.Actions>
              <Switch.Root aria-label="Уведомления" />
            </Card.Actions>
          </Card.Header>
        </Card.Root>
      </>,
    );
    expect(screen.getByTestId("row")).toHaveAttribute("data-mark", "row");
    expect(screen.getByTestId("row-icon")).toHaveAttribute("data-size", "xs");
    expect(screen.getByTestId("row-s")).toHaveAttribute("data-size", "2xs");
    // With a description the header holds two lines: the full mark.
    expect(screen.getByTestId("two")).toHaveAttribute("data-mark", "header");
    expect(screen.getByTestId("two-icon")).toHaveAttribute("data-size", "s");
  });

  it("takes a picture with no tile and hides it from assistive tech", () => {
    render(
      <Card.Root>
        <Card.Header>
          <Card.Icon data-testid="icon">
            <Avatar.Root>АВ</Avatar.Root>
          </Card.Icon>
          <Card.Title>Анна Ветрова</Card.Title>
        </Card.Header>
      </Card.Root>,
    );
    const icon = screen.getByTestId("icon");
    expect(icon).toHaveAttribute("data-media");
    expect(icon).not.toHaveAttribute("data-tone");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps the name of a state ring", () => {
    render(
      <Card.Root>
        <Card.Header>
          <Card.Icon data-testid="icon">
            <ProgressCircle value={40} aria-label="Выполнено 40%" />
          </Card.Icon>
          <Card.Title>Склад</Card.Title>
        </Card.Header>
      </Card.Root>,
    );
    const icon = screen.getByTestId("icon");
    expect(icon).toHaveAttribute("data-media");
    expect(icon).not.toHaveAttribute("aria-hidden");
    expect(screen.getByRole("progressbar", { name: "Выполнено 40%" })).toBeInTheDocument();
  });

  it("is the owner's avatar on the edge of a top cover", () => {
    render(
      <>
        <Card.Root>
          <Card.Media>
            <img src="unit.jpg" alt="" />
          </Card.Media>
          <Card.Header data-testid="covered">
            <Card.Icon data-testid="edge">
              <Avatar.Root>АВ</Avatar.Root>
            </Card.Icon>
            <Card.Title>Honda PCX 160</Card.Title>
          </Card.Header>
        </Card.Root>
        <Card.Root>
          <Card.Header data-testid="plain">
            <Card.Icon data-testid="plain-icon">
              <Avatar.Root>АВ</Avatar.Root>
            </Card.Icon>
            <Card.Title>Анна Ветрова</Card.Title>
          </Card.Header>
        </Card.Root>
      </>,
    );
    expect(screen.getByTestId("covered")).toHaveAttribute("data-edge");
    expect(screen.getByTestId("edge")).toHaveAttribute("data-edge");
    expect(screen.getByTestId("plain")).not.toHaveAttribute("data-edge");
    expect(screen.getByTestId("plain-icon")).not.toHaveAttribute("data-edge");
    expect(cssValue(cssRule(CSS, ".icon[data-edge]"), "flex-basis")).toBe("100%");
  });
});

describe("Card.Title", () => {
  it("is an h3 by default, with `as` for the outline, and one cut line", () => {
    const ref = React.createRef<HTMLHeadingElement>();
    render(
      <Card.Root size="l">
        <Card.Header>
          <Card.Title ref={ref} className="own">
            Заказ 1042
          </Card.Title>
        </Card.Header>
        <Card.Header>
          <Card.Title as="h2">Заказ 1043</Card.Title>
          <Card.Title as="span">Заказ 1044</Card.Title>
        </Card.Header>
      </Card.Root>,
    );
    expect(screen.getByRole("heading", { name: "Заказ 1042", level: 3 })).toBe(ref.current);
    expect(ref.current).toHaveClass(headerRow.title, "own");
    expect(screen.getByRole("heading", { name: "Заказ 1043", level: 2 })).toBeInTheDocument();
    expect(screen.getByText("Заказ 1044").tagName).toBe("SPAN");
    const title = cssRule(HEADER_CSS, ".title");
    expect(cssValue(title, "white-space")).toBe("nowrap");
    expect(cssValue(title, "text-overflow")).toBe("ellipsis");
  });

  it("gives way to its badges first, down to its own text or 8em", () => {
    render(
      <Card.Root>
        <Card.Header>
          <Card.Title data-testid="title">Заказ 1042</Card.Title>
          <Card.Badges>
            <Badge.Root>В работе</Badge.Root>
          </Card.Badges>
        </Card.Header>
      </Card.Root>,
    );
    expect(screen.getByTestId("title").style.getPropertyValue("--header-title-min")).toMatch(/px$/);
    expect(
      cssValue(cssRule(HEADER_CSS, ".titleRow:has(> .badges) > .title"), "min-width"),
    ).toContain("--header-title-min");
  });
});

describe("Card.Badges", () => {
  it("is one Badge.Group after the title with badges xs · xs · xs · s · s by card size", () => {
    render(
      (["xs", "s", "m", "l", "xl"] as const).map((size) => (
        <Card.Root key={size} size={size}>
          <Card.Header>
            <Card.Title>Заказ</Card.Title>
            <Card.Badges data-testid={`badges-${size}`}>
              <Badge.Root data-testid={`badge-${size}`}>В работе</Badge.Root>
            </Card.Badges>
          </Card.Header>
        </Card.Root>
      )),
    );
    const sizes = ["xs", "s", "m", "l", "xl"].map((id) =>
      screen.getByTestId(`badge-${id}`).getAttribute("data-size"),
    );
    expect(sizes).toEqual(["xs", "xs", "xs", "s", "s"]);
    expect(screen.getByTestId("badges-m")).toHaveAttribute("data-overflow", "count");
    expect(screen.getByTestId("badges-m")).toHaveClass(headerRow.badges);
  });

  it("folds into «+N» and keeps the consumer's ref and class", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Card.Root>
        <Card.Header>
          <Card.Title>Заказ</Card.Title>
          <Card.Badges ref={ref} className="own">
            <Badge.Root>В работе</Badge.Root>
            <Badge.Root>Срочно</Badge.Root>
          </Card.Badges>
        </Card.Header>
      </Card.Root>,
    );
    expect(ref.current).toHaveClass("own");
    // The «+N» badge is part of the group.
    expect(within(ref.current as HTMLElement).getByText(/\+/)).toBeInTheDocument();
  });
});

describe("Card.Description", () => {
  it("is plain text in one cut line", () => {
    render(
      <Card.Root size="l">
        <Card.Header>
          <Card.Title>Заказ</Card.Title>
          <Card.Description data-testid="description">Обновлён вчера</Card.Description>
        </Card.Header>
      </Card.Root>,
    );
    const description = screen.getByTestId("description");
    expect(description).toHaveClass(headerRow.description);
    expect(description).toHaveTextContent("Обновлён вчера");
    expect(description.querySelector(`.${headerRow.separator}`)).toBeNull();
    expect(cssValue(cssRule(HEADER_CSS, ".descriptionText"), "text-overflow")).toBe("ellipsis");
  });

  it("puts a quiet separator after a StatusDot", () => {
    render(
      <Card.Root>
        <Card.Header>
          <Card.Title>Заказ</Card.Title>
          <Card.Description data-testid="description">
            Обновлён вчера
            <StatusDot tone="success">Оплачен</StatusDot>
          </Card.Description>
        </Card.Header>
      </Card.Root>,
    );
    const description = screen.getByTestId("description");
    const [dot, separator, text] = [...description.children] as HTMLElement[];
    expect(dot).toHaveTextContent("Оплачен");
    expect(separator).toHaveAttribute("aria-hidden", "true");
    expect(separator).toHaveTextContent("·");
    expect(text).toHaveTextContent("Обновлён вчера");
  });

  it("has no separator when the state stands alone", () => {
    render(
      <Card.Root>
        <Card.Header>
          <Card.Title>Заказ</Card.Title>
          <Card.Description data-testid="description">
            <StatusDot tone="warning">Ждёт оплаты</StatusDot>
          </Card.Description>
        </Card.Header>
      </Card.Root>,
    );
    expect(screen.getByTestId("description").querySelector(`.${headerRow.separator}`)).toBeNull();
  });
});

describe("Card.Actions", () => {
  it("gives its controls the card's own tier: xs · s · m · l · xl", () => {
    render(
      (["xs", "s", "m", "l", "xl"] as const).map((size) => (
        <Card.Root key={size} size={size}>
          <Card.Header>
            <Card.Title>Заказ</Card.Title>
            <Card.Actions>
              <Button.Root variant="ghost" data-testid={size}>
                Ещё
              </Button.Root>
            </Card.Actions>
          </Card.Header>
        </Card.Root>
      )),
    );
    expect(
      ["xs", "s", "m", "l", "xl"].map((id) => screen.getByTestId(id).getAttribute("data-size")),
    ).toEqual(["xs", "s", "m", "l", "xl"]);
  });

  it("shares the footer's width only in the footer", () => {
    render(
      <Card.Root>
        <Card.Header>
          <Card.Title>Заказ</Card.Title>
          <Card.Actions fullWidth data-testid="header-actions">
            <Button.Root variant="ghost">Ещё</Button.Root>
          </Card.Actions>
        </Card.Header>
        <Card.Footer>
          <Card.Actions fullWidth data-testid="footer-actions">
            <Button.Root variant="soft">Отмена</Button.Root>
            <Button.Root>Оплатить</Button.Root>
          </Card.Actions>
        </Card.Footer>
      </Card.Root>,
    );
    expect(screen.getByTestId("header-actions")).not.toHaveAttribute("data-full-width");
    expect(screen.getByTestId("footer-actions")).toHaveAttribute("data-full-width");
    expect(cssValue(cssRule(CSS, ".actions[data-full-width]"), "flex")).toBe("1 1 100%");
  });

  it("forwards its ref and class", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Card.Root>
        <Card.Footer>
          <Card.Actions ref={ref} className="own" />
        </Card.Footer>
      </Card.Root>,
    );
    expect(ref.current).toHaveClass(styles.actions, "own");
  });
});

describe("Card.Indicator", () => {
  it("follows `selected`: a radio circle", () => {
    const { rerender } = render(
      <Card.Root selected={false}>
        <Card.Header>
          <Card.Title>Тариф «Команда»</Card.Title>
          <Card.Indicator type="radio" data-testid="indicator" />
        </Card.Header>
      </Card.Root>,
    );
    const indicator = screen.getByTestId("indicator");
    expect(indicator).toHaveAttribute("aria-hidden", "true");
    expect(indicator).toHaveAttribute("data-state", "unchecked");
    rerender(
      <Card.Root selected>
        <Card.Header>
          <Card.Title>Тариф «Команда»</Card.Title>
          <Card.Indicator type="radio" data-testid="indicator" />
        </Card.Header>
      </Card.Root>,
    );
    expect(screen.getByTestId("indicator")).toHaveAttribute("data-state", "checked");
  });

  it("follows `selected`: a checkbox, the card's own tier", () => {
    render(
      <>
        <Card.Root selected size="l">
          <Card.Header>
            <Card.Title>Склад на Лесной</Card.Title>
            <Card.Indicator type="checkbox" data-testid="checked" />
          </Card.Header>
        </Card.Root>
        <Card.Root>
          <Card.Header>
            <Card.Title>Склад на Речной</Card.Title>
            <Card.Indicator type="checkbox" data-testid="unchecked" />
          </Card.Header>
        </Card.Root>
      </>,
    );
    expect(screen.getByTestId("checked")).toHaveAttribute("data-state", "checked");
    expect(screen.getByTestId("checked")).toHaveAttribute("data-size", "l");
    expect(screen.getByTestId("unchecked")).toHaveAttribute("data-state", "unchecked");
    expect(screen.getByTestId("unchecked")).toHaveAttribute("data-size", "m");
  });

  it("forwards its ref and class", () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(
      <Card.Root>
        <Card.Header>
          <Card.Title>Склад</Card.Title>
          <Card.Indicator ref={ref} type="radio" className="own" />
        </Card.Header>
      </Card.Root>,
    );
    expect(ref.current).toHaveClass(styles.indicator, "own");
  });
});

/** The role as a spread: the element is the consumer's own radio card. */
const RADIO = { role: "radio" } as const;

describe("a choice card", () => {
  it("writes aria-pressed on its button from `selected`", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Card.Root asChild selected data-testid="card">
        <button type="button" onClick={onClick}>
          <Card.Header>
            <Card.Title as="span">Склад на Лесной</Card.Title>
            <Card.Indicator type="checkbox" />
          </Card.Header>
        </button>
      </Card.Root>,
    );
    const card = screen.getByRole("button", { name: "Склад на Лесной" });
    expect(card).toBe(screen.getByTestId("card"));
    expect(card).toHaveAttribute("aria-pressed", "true");
    expect(card).toHaveAttribute("data-selected");
    expect(card).toHaveAttribute("data-interactive");
    await user.click(card);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("writes aria-checked on a radio or a checkbox element", () => {
    render(
      <div role="radiogroup" aria-label="Тариф">
        <Card.Root asChild selected>
          <button type="button" {...RADIO}>
            <Card.Header>
              <Card.Title as="span">Команда</Card.Title>
              <Card.Indicator type="radio" />
            </Card.Header>
          </button>
        </Card.Root>
        <Card.Root asChild selected={false}>
          <button type="button" {...RADIO}>
            <Card.Header>
              <Card.Title as="span">Бизнес</Card.Title>
              <Card.Indicator type="radio" />
            </Card.Header>
          </button>
        </Card.Root>
      </div>,
    );
    expect(screen.getByRole("radio", { name: "Команда" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Бизнес" })).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("radio", { name: "Бизнес" })).not.toHaveAttribute("aria-pressed");
  });

  it("leaves the state alone without `selected`", () => {
    render(
      <Card.Root asChild>
        <button type="button">
          <Card.Header>
            <Card.Title as="span">Отчёт</Card.Title>
          </Card.Header>
        </button>
      </Card.Root>,
    );
    const card = screen.getByRole("button", { name: "Отчёт" });
    expect(card).not.toHaveAttribute("aria-pressed");
    expect(card).not.toHaveAttribute("aria-checked");
  });

  it("is pressed with Enter and Space from the keyboard", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Card.Root asChild>
        <button type="button" onClick={onClick}>
          <Card.Header>
            <Card.Title as="span">Отчёт</Card.Title>
          </Card.Header>
        </button>
      </Card.Root>,
    );
    await user.tab();
    expect(screen.getByRole("button", { name: "Отчёт" })).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("draws the selected ring over the card, from the state the element carries", () => {
    const chosen = cssRule(
      CSS,
      '.root:is([data-selected], [aria-pressed="true"], [aria-checked="true"])::after',
    );
    expect(cssValue(chosen, "box-shadow")).toContain("--prime-color-accent-default");
    expect(cssValue(cssRule(CSS, ".root::after"), "pointer-events")).toBe("none");
  });
});

describe("Card.Link", () => {
  it("is the one link of the card and tells the root to open as a whole", async () => {
    const user = userEvent.setup();
    render(
      <Card.Root data-testid="card">
        <Card.Header>
          <Card.Title>
            <Card.Link href="#order-1042">Заказ 1042</Card.Link>
          </Card.Title>
          <Card.Actions>
            <Button.Root variant="ghost">Ещё</Button.Root>
          </Card.Actions>
        </Card.Header>
      </Card.Root>,
    );
    const card = screen.getByTestId("card");
    const link = screen.getByRole("link", { name: "Заказ 1042" });
    expect(link).toHaveAttribute("href", "#order-1042");
    expect(link).toHaveClass(styles.link);
    expect(link).toHaveAttribute("data-row-link");
    expect(card).toHaveAttribute("data-link");
    expect(card).toHaveClass(rowLink.host);
    expect(screen.getByRole("heading", { name: "Заказ 1042" })).toContainElement(link);
    // The link is the first stop; Enter follows it.
    await user.tab();
    expect(link).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(window.location.hash).toBe("#order-1042");
    await user.tab();
    expect(screen.getByRole("button", { name: "Ещё" })).toHaveFocus();
  });

  it("stretches over the card and shows the focus ring on the card", () => {
    expect(cssValue(cssRule(CSS, ".link::after"), "inset")).toBe("0");
    expect(
      cssValue(
        cssRule(
          CSS,
          ".root[data-link]:has(.link:focus-visible), .root[data-interactive]:focus-visible",
        ),
        "outline",
      ),
    ).toContain("--prime-color-focus-ring");
  });

  it("renders the child element with asChild", () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(
      <Card.Root data-testid="card">
        <Card.Header>
          <Card.Title>
            <Card.Link asChild>
              <a ref={ref} href="#orders">
                Заказы
              </a>
            </Card.Link>
          </Card.Title>
        </Card.Header>
      </Card.Root>,
    );
    expect(screen.getByRole("link", { name: "Заказы" })).toBe(ref.current);
    expect(screen.getByTestId("card")).toHaveAttribute("data-link");
  });

  it("gives the card back when the link leaves", () => {
    const { rerender } = render(
      <Card.Root data-testid="card">
        <Card.Header>
          <Card.Title>
            <Card.Link href="#orders">Заказы</Card.Link>
          </Card.Title>
        </Card.Header>
      </Card.Root>,
    );
    expect(screen.getByTestId("card")).toHaveAttribute("data-link");
    rerender(
      <Card.Root data-testid="card">
        <Card.Header>
          <Card.Title>Заказы</Card.Title>
        </Card.Header>
      </Card.Root>,
    );
    expect(screen.getByTestId("card")).not.toHaveAttribute("data-link");
  });
});

describe("Card.Footer and Card.Total", () => {
  it("keeps the footer to the bottom with the total at the start and no line", () => {
    render(
      <Card.Root>
        <Card.Body>Позиции</Card.Body>
        <Card.Footer data-testid="footer">
          <Card.Actions data-testid="actions">
            <Button.Root>Оплатить</Button.Root>
          </Card.Actions>
          <Card.Total label="К оплате" tone="warning" data-testid="total">
            42 500 ₽
          </Card.Total>
        </Card.Footer>
      </Card.Root>,
    );
    const footer = screen.getByTestId("footer");
    const rule = cssRule(CSS, ".footer");
    expect(cssValue(rule, "margin-top")).toBe("auto");
    expect(rule.decls.some((decl) => decl.prop.startsWith("border"))).toBe(false);
    const total = screen.getByTestId("total");
    expect(footer).toContainElement(total);
    const [label, value] = [...total.children] as HTMLElement[];
    expect(label).toHaveTextContent("К оплате");
    expect(label).toHaveAttribute("data-tone", "warning");
    expect(value).toHaveTextContent("42 500 ₽");
    expect(cssValue(cssRule(CSS, ".totalValue"), "font-variant-numeric")).toBe("tabular-nums");
  });

  it("shows the amount alone without a label", () => {
    render(
      <Card.Root>
        <Card.Footer>
          <Card.Total data-testid="total">42 500 ₽</Card.Total>
        </Card.Footer>
      </Card.Root>,
    );
    expect(screen.getByTestId("total").children).toHaveLength(1);
  });
});

describe("Card.Media and Card.Body", () => {
  it("forward ref, class and attributes", () => {
    const media = React.createRef<HTMLDivElement>();
    const body = React.createRef<HTMLDivElement>();
    render(
      <Card.Root>
        <Card.Media ref={media} className="own" data-testid="media" />
        <Card.Body ref={body} className="own" data-testid="body" />
      </Card.Root>,
    );
    expect(media.current).toBe(screen.getByTestId("media"));
    expect(media.current).toHaveClass(styles.media, "own");
    expect(body.current).toBe(screen.getByTestId("body"));
    expect(body.current).toHaveClass(styles.body, "own");
  });
});
