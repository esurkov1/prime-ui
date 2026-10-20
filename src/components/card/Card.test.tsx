import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Avatar } from "@/components/avatar/Avatar";
import { Badge } from "@/components/badge/Badge";
import { ProgressCircle } from "@/components/progress-circle/ProgressCircle";
import hairline from "@/internal/hairline.module.css";
import textRole from "@/internal/textRole.module.css";
import { cssRule, cssValue } from "@/test/css";

import { Card } from "./Card";
import styles from "./Card.module.css";

describe("Card", () => {
  it("renders mini variant with an icon, label and value straight in the root", () => {
    render(
      <Card.Root variant="mini" data-testid="card">
        <Card.Icon aria-hidden>×</Card.Icon>
        <Card.Label>Age</Card.Label>
        <Card.Value>36 years</Card.Value>
      </Card.Root>,
    );
    expect(screen.getByTestId("card")).toHaveAttribute("data-variant", "mini");
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("36 years")).toBeInTheDocument();
  });

  it("renders panel variant with a header, body, media and footer", () => {
    render(
      <Card.Root data-testid="panel-card">
        <Card.Header>
          <Card.Title>Revenue</Card.Title>
          <button type="button">Period</button>
        </Card.Header>
        <Card.Body>Intro</Card.Body>
        <Card.Media>Plot</Card.Media>
        <Card.Footer>
          <button type="button">Save</button>
        </Card.Footer>
      </Card.Root>,
    );
    expect(screen.getByTestId("panel-card")).toHaveAttribute("data-variant", "panel");
    expect(screen.getByRole("heading", { name: "Revenue" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Period" })).toBeInTheDocument();
    expect(screen.getByText("Intro")).toBeInTheDocument();
    expect(screen.getByText("Plot")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("renders stat-trend variant with delta trend", () => {
    render(
      <Card.Root variant="stat-trend" data-testid="stat-card">
        <Card.Label>MRR</Card.Label>
        <Card.Value>120k</Card.Value>
        <Card.Delta tone="success">+5%</Card.Delta>
      </Card.Root>,
    );
    expect(screen.getByTestId("stat-card")).toHaveAttribute("data-variant", "stat-trend");
    expect(screen.getByText("+5%")).toHaveAttribute("data-tone", "success");
  });

  it("renders the list template as a list of items", () => {
    render(
      <Card.Root variant="list">
        <Card.Header>
          <Card.Title>Events</Card.Title>
        </Card.Header>
        <Card.List>
          <Card.ListItem>One</Card.ListItem>
          <Card.ListItem>Two</Card.ListItem>
        </Card.List>
      </Card.Root>,
    );
    expect(screen.getByRole("list")).toHaveAttribute("role", "list");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("titles render h3 by default and take a heading level via as", () => {
    render(
      <Card.Root>
        <Card.Header>
          <Card.Title as="h2">Профиль</Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Title>Тариф</Card.Title>
        </Card.Body>
      </Card.Root>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Профиль" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Тариф" })).toBeInTheDocument();
  });

  it("renders a meta line and a description in a panel header", () => {
    render(
      <>
        <Card.Root variant="stat-trend">
          <Card.Label>Выручка</Card.Label>
          <Card.Value>4,2 млн ₽</Card.Value>
          <Card.Meta>Лидов 120 · сделок 18</Card.Meta>
        </Card.Root>
        <Card.Root>
          <Card.Header>
            <Card.Title>Воронка</Card.Title>
            <Card.Description>Заявки за октябрь</Card.Description>
          </Card.Header>
        </Card.Root>
      </>,
    );
    expect(screen.getByText("Лидов 120 · сделок 18").tagName).toBe("SPAN");
    expect(screen.getByText("Заявки за октябрь").parentElement).toHaveTextContent("Воронка");
  });

  it("becomes the link it wraps with asChild: one tab stop, parts inside, the root's attributes", async () => {
    render(
      <Card.Root asChild variant="mini" className="extra">
        <a href="#orders">
          <Card.Label>Заказы</Card.Label>
          <Card.Value>128</Card.Value>
        </a>
      </Card.Root>,
    );
    const link = screen.getByRole("link", { name: /Заказы\s*128/ });
    expect(link).toHaveAttribute("href", "#orders");
    expect(link).toHaveAttribute("data-interactive", "true");
    expect(link).toHaveAttribute("data-variant", "mini");
    expect(link).toHaveAttribute("data-depth");
    expect(link).toHaveClass("extra");
  });

  it("is one Tab stop with asChild: focus moves onto the whole link and on past it", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">До</button>
        <Card.Root asChild variant="mini">
          <a href="#orders">
            <Card.Label>Заказы</Card.Label>
            <Card.Value>128</Card.Value>
          </a>
        </Card.Root>
        <button type="button">После</button>
      </>,
    );
    screen.getByRole("button", { name: "До" }).focus();
    await user.tab();
    expect(screen.getByRole("link", { name: /Заказы/ })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "После" })).toHaveFocus();
  });

  it("works as a button: Enter and Space activate it", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Card.Root asChild>
        <button type="button" onClick={onClick}>
          <Card.Header>
            <Card.Title>Отчёт</Card.Title>
          </Card.Header>
        </button>
      </Card.Root>,
    );
    const button = screen.getByRole("button", { name: "Отчёт" });
    button.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("CSS: a label beside the icon of a KPI tile wraps instead of being cut", () => {
    const rule = cssRule(
      "src/components/card/Card.module.css",
      '.root[data-variant="mini"] > .label, .root[data-variant="split"] > .body > * > .label',
    );
    expect(cssValue(rule, "white-space")).toBe("normal");
  });

  it("an avatar in Card.Icon is the record's picture: no tile, size l, hidden from assistive tech", () => {
    render(
      <Card.Root>
        <Card.Header data-testid="header">
          <Card.Icon data-testid="icon">
            <Avatar.Root data-testid="avatar">
              <Avatar.Fallback>АС</Avatar.Fallback>
            </Avatar.Root>
          </Card.Icon>
          <Card.Title>Анна Соколова</Card.Title>
          <Card.Description>@a.sokolova</Card.Description>
          <button type="button">Отвязать</button>
        </Card.Header>
      </Card.Root>,
    );
    const icon = screen.getByTestId("icon");
    expect(icon).toHaveAttribute("data-media", "true");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).not.toHaveAttribute("data-tone");
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-size", "l");
    expect(screen.getByRole("heading", { name: "Анна Соколова" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Отвязать" })).toBeInTheDocument();
  });

  it("a glyph in Card.Icon keeps the accent tile", () => {
    render(
      <Card.Root variant="mini">
        <Card.Icon data-testid="icon" aria-hidden>
          ×
        </Card.Icon>
      </Card.Root>,
    );
    const icon = screen.getByTestId("icon");
    expect(icon).toHaveAttribute("data-tone", "accent");
    expect(icon).not.toHaveAttribute("data-media");
  });

  it("a ProgressCircle in Card.Icon is the record's state ring: no tile, its own size, its own name", () => {
    render(
      <Card.Root>
        <Card.Header>
          <Card.Icon data-testid="icon">
            <ProgressCircle value={0} color="yellow" aria-label="Бронь: до выдачи 17 д">
              17 д
            </ProgressCircle>
          </Card.Icon>
          <Card.Title>Honda PCX 160</Card.Title>
        </Card.Header>
      </Card.Root>,
    );
    const icon = screen.getByTestId("icon");
    expect(icon).toHaveAttribute("data-media", "true");
    expect(icon).not.toHaveAttribute("aria-hidden");
    expect(icon).not.toHaveAttribute("data-tone");
    const ring = screen.getByRole("progressbar", { name: "Бронь: до выдачи 17 д" });
    expect(ring.closest("[data-size]")).toHaveAttribute("data-size", "m");
  });

  it("a footer with a total is a record's row: the note's dot first, its text cut, the total at the end", () => {
    render(
      <Card.Root>
        <Card.Body>Позиции</Card.Body>
        <Card.Footer divider="full">
          <button type="button">Выдан</button>
          <Card.Description data-testid="note">
            <Badge.Dot color="yellow" data-testid="dot" />
            Выдать 6 нояб · Банг Тао
          </Card.Description>
          <Card.Total data-testid="total">
            <Card.Meta tone="warning" data-testid="due">
              к оплате 6 400 ฿
            </Card.Meta>
            <Card.Value data-testid="value">26 400 ฿</Card.Value>
          </Card.Total>
        </Card.Footer>
      </Card.Root>,
    );
    const note = screen.getByTestId("note");
    expect(note.firstElementChild).toBe(screen.getByTestId("dot"));
    expect(note.lastElementChild).toHaveTextContent("Выдать 6 нояб · Банг Тао");
    expect(note.lastElementChild).not.toBe(screen.getByTestId("dot"));
    expect(screen.getByTestId("value")).toHaveClass(textRole.titleM);
    expect(screen.getByTestId("due")).toHaveAttribute("data-tone", "warning");
    expect(screen.getByTestId("total").firstElementChild).toBe(screen.getByTestId("due"));

    const css = "src/components/card/Card.module.css";
    expect(cssValue(cssRule(css, ".footer:has(> .total)"), "flex-wrap")).toBe("nowrap");
    expect(cssValue(cssRule(css, ".total"), "margin-inline-start")).toBe("auto");
    expect(cssValue(cssRule(css, ".total"), "justify-items")).toBe("end");
    expect(cssValue(cssRule(css, ".noteText"), "text-overflow")).toBe("ellipsis");
  });

  it("a value straight in a footer keeps its template role; the total's is title-m", () => {
    render(
      <Card.Root>
        <Card.Footer>
          <Card.Value data-testid="value">26 400 ฿</Card.Value>
        </Card.Footer>
      </Card.Root>,
    );
    expect(screen.getByTestId("value")).toHaveClass(textRole.titleL);
  });

  it("divider=fill sets the footer on the next layer of the ladder, with no line", () => {
    render(
      <Card.Root data-testid="card">
        <Card.Body>Позиции</Card.Body>
        <Card.Footer divider="fill" data-testid="footer">
          <Card.Root data-testid="inner">Вложенная</Card.Root>
        </Card.Footer>
      </Card.Root>,
    );
    const footer = screen.getByTestId("footer");
    expect(screen.getByTestId("card")).toHaveAttribute("data-depth", "1");
    expect(footer).toHaveAttribute("data-depth", "2");
    expect(footer).toHaveAttribute("data-divider", "fill");
    expect(footer).not.toHaveClass(hairline.top);
    // A surface inside the footer counts its depth from the footer's layer.
    expect(screen.getByTestId("inner")).toHaveAttribute("data-depth", "3");
    const rule = cssRule("src/components/card/Card.module.css", '.footer[data-divider="fill"]');
    expect(cssValue(rule, "background")).toBe("var(--prime-color-layer-current)");
  });

  it('valueSize="l" sets a stat-text value a step larger, a number and a phrase alike', () => {
    render(
      <>
        <Card.Root variant="stat-text" valueSize="l">
          <Card.Label>К оплате</Card.Label>
          <Card.Value data-testid="number">21 000 ₽</Card.Value>
        </Card.Root>
        <Card.Root variant="stat-text">
          <Card.Label>Ближайшая задача</Card.Label>
          <Card.Value data-testid="phrase">Выдать PCX 160</Card.Value>
        </Card.Root>
      </>,
    );
    expect(screen.getByTestId("number")).toHaveClass(textRole.titleM);
    expect(screen.getByTestId("phrase")).toHaveClass(textRole.bodyM);
  });

  it("a link card with a header puts its arrow in the header, centred on its height", () => {
    const { container } = render(
      <Card.Root>
        <Card.Header data-testid="header">
          <Card.Title>
            <Card.Link href="#866">Сделка #866</Card.Link>
          </Card.Title>
          <Card.Description>Аренда PCX 160 · 15 дн.</Card.Description>
        </Card.Header>
      </Card.Root>,
    );
    const marks = container.querySelectorAll(`.${styles.mark}`);
    expect(marks).toHaveLength(1);
    expect(marks[0]?.parentElement).toBe(screen.getByTestId("header"));
    expect(
      screen.getByRole("link", { name: "Сделка #866" }).querySelector(`.${styles.mark}`),
    ).toBeNull();
    const rule = cssRule("src/components/card/Card.module.css", ".header > .mark");
    expect(cssValue(rule, "inset-block-start")).toBe("auto");
    expect(cssValue(rule, "align-self")).toBe("center");
  });

  it("a link card without a header keeps the arrow in the link, in the top corner", () => {
    render(
      <Card.Root>
        <Card.Body>
          <Card.Link href="#866">Сделка #866</Card.Link>
        </Card.Body>
      </Card.Root>,
    );
    expect(
      screen.getByRole("link", { name: "Сделка #866" }).querySelector(`.${styles.mark}`),
    ).not.toBeNull();
  });

  it("a description outside the footer keeps its children as they are", () => {
    render(
      <Card.Root>
        <Card.Header>
          <Card.Title>Honda PCX 160</Card.Title>
          <Card.Description data-testid="description">@a.sokolova</Card.Description>
        </Card.Header>
      </Card.Root>,
    );
    expect(screen.getByTestId("description").children).toHaveLength(0);
  });

  it("CSS: a Card.Icon leads the header grid and spans the title and description rows", () => {
    const grid = cssRule("src/components/card/Card.module.css", ".header:has(> .icon)");
    expect(cssValue(grid, "grid-template-columns")).toBe(
      "[icon] auto [text] minmax(0, 1fr) [end] auto",
    );
    const icon = cssRule("src/components/card/Card.module.css", ".header > .icon");
    expect(cssValue(icon, "grid-column")).toBe("icon");
    expect(cssValue(icon, "grid-row")).toBe("1 / -1");
  });

  it("loading holds a Skeleton in the value, delta and meta, then fades the data in", () => {
    const tile = (loading: boolean) => (
      <Card.Root variant="stat-trend" loading={loading} data-testid="kpi">
        <Card.Label>Выручка</Card.Label>
        <Card.Value data-testid="value">4,2 млн ₽</Card.Value>
        <Card.Delta tone="success" data-testid="delta">
          +18%
        </Card.Delta>
        <Card.Meta data-testid="meta">Сделок 186</Card.Meta>
      </Card.Root>
    );
    const { rerender } = render(tile(true));
    expect(screen.getByTestId("kpi")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Выручка")).toBeInTheDocument();
    for (const id of ["value", "delta", "meta"]) {
      const part = screen.getByTestId(id);
      expect(part).toHaveAttribute("data-loading", "true");
      expect(part.querySelector('[aria-hidden="true"][data-shape]')).not.toBeNull();
    }
    expect(screen.queryByText("4,2 млн ₽")).toBeNull();

    rerender(tile(false));
    expect(screen.getByTestId("kpi")).not.toHaveAttribute("aria-busy");
    const value = screen.getByTestId("value");
    expect(value).toHaveTextContent("4,2 млн ₽");
    expect(value).not.toHaveAttribute("data-loading");
    // The data replaces the Skeleton with the region swap's short fade.
    expect(value.className).toMatch(/settleIn/);
    expect(screen.getByTestId("delta")).toHaveTextContent("+18%");
    expect(screen.getByTestId("meta")).toHaveTextContent("Сделок 186");
  });

  it("a card that never loads keeps its parts as they are", () => {
    render(
      <Card.Root variant="stat-trend" data-testid="kpi">
        <Card.Value data-testid="value">99,95%</Card.Value>
      </Card.Root>,
    );
    expect(screen.getByTestId("kpi")).not.toHaveAttribute("aria-busy");
    expect(screen.getByTestId("value").className).not.toMatch(/swapIn|settleIn/);
  });

  it("Card.Link stretches over the card: the card opens as a whole, its button stays its own", async () => {
    const onIssue = vi.fn();
    render(
      <Card.Root data-testid="card">
        <Card.Header>
          <Card.Title>
            <Card.Link href="#pcx">Honda PCX</Card.Link>
          </Card.Title>
        </Card.Header>
        <Card.Footer divider="full">
          <button type="button" onClick={onIssue}>
            Выдан
          </button>
        </Card.Footer>
      </Card.Root>,
    );
    const card = screen.getByTestId("card");
    const link = screen.getByRole("link", { name: "Honda PCX" });
    expect(card).toHaveAttribute("data-link", "true");
    expect(link).toHaveAttribute("data-row-link");
    // The kit draws the transition arrow (in the header); the card keeps one tab stop for the link.
    expect(card.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(card.className).toMatch(/host/);
    expect(cssValue(cssRule("src/components/card/Card.module.css", ".link::after"), "inset")).toBe(
      "0",
    );
    await userEvent.tab();
    expect(link).toHaveFocus();
    await userEvent.click(screen.getByRole("button", { name: "Выдан" }));
    expect(onIssue).toHaveBeenCalledTimes(1);
  });

  it("Card.Link asChild takes a <button>: it stretches over the card and opens it in place", async () => {
    const onOpen = vi.fn();
    const onIssue = vi.fn();
    render(
      <Card.Root data-testid="card">
        <Card.Header>
          <Card.Title>
            <Card.Link asChild>
              <button type="button" onClick={onOpen}>
                Залог
              </button>
            </Card.Link>
          </Card.Title>
        </Card.Header>
        <Card.Footer>
          <button type="button" onClick={onIssue}>
            Выдан
          </button>
        </Card.Footer>
      </Card.Root>,
    );
    const link = screen.getByRole("button", { name: "Залог" });
    expect(screen.getByTestId("card")).toHaveAttribute("data-link", "true");
    expect(link).toHaveAttribute("data-row-link");
    expect(screen.getByTestId("card").querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    // The host never raises its own link: the `::after` is laid out by the card, not the button.
    expect(cssValue(cssRule("src/components/card/Card.module.css", ".link"), "border")).toBe("0");
    await userEvent.tab();
    expect(link).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onOpen).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole("button", { name: "Выдан" }));
    expect(onIssue).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("stat-text puts an action at the end of the row, centred on the text", () => {
    const CSS = "src/components/card/Card.module.css";
    const grid = cssRule(
      CSS,
      '.root[data-variant="stat-text"]:has(> :not(.label, .value, .delta, .meta, .mark))',
    );
    expect(cssValue(grid, "display")).toBe("grid");
    expect(cssValue(grid, "align-items")).toBe("center");
    const end = cssRule(
      CSS,
      '.root[data-variant="stat-text"] > :not(.label, .value, .delta, .meta, .mark)',
    );
    expect(cssValue(end, "grid-column")).toBe("end");
    expect(cssValue(end, "grid-row")).toBe("1 / -1");
    render(
      <Card.Root variant="stat-text">
        <Card.Label>Выдан</Card.Label>
        <Card.Value>14 октября, 12:40</Card.Value>
        <button type="button">Отменить</button>
      </Card.Root>,
    );
    expect(screen.getByRole("button", { name: "Отменить" })).toBeInTheDocument();
  });

  it("a card that is a link shows the transition arrow; a button card does not", () => {
    const { rerender } = render(
      <Card.Root variant="mini" asChild>
        <a href="#x" data-testid="card">
          <Card.Label>Лиды</Card.Label>
        </a>
      </Card.Root>,
    );
    expect(screen.getByTestId("card")).toHaveAttribute("data-mark", "true");
    expect(screen.getByTestId("card").querySelector("svg")).not.toBeNull();
    rerender(
      <Card.Root variant="mini" asChild>
        <button type="button" data-testid="card">
          <Card.Label>Лиды</Card.Label>
        </button>
      </Card.Root>,
    );
    expect(screen.getByTestId("card")).not.toHaveAttribute("data-mark");
    expect(screen.getByTestId("card").querySelector("svg")).toBeNull();
  });

  it("Card.Value takes a tone and stat-text a text value", () => {
    render(
      <Card.Root variant="stat-text" data-testid="card">
        <Card.Value tone="warning" data-testid="value">
          256 000 ₽
        </Card.Value>
      </Card.Root>,
    );
    expect(screen.getByTestId("card")).toHaveAttribute("data-variant", "stat-text");
    expect(screen.getByTestId("value")).toHaveAttribute("data-tone", "warning");
    expect(screen.getByTestId("value").className).toMatch(/tone/);
  });

  it("divider=full sets the zone hairline edge to edge on a footer of any template", () => {
    render(
      <Card.Root variant="cover">
        <Card.Footer divider="full" data-testid="footer">
          x
        </Card.Footer>
      </Card.Root>,
    );
    const footer = screen.getByTestId("footer");
    expect(footer).toHaveAttribute("data-divider", "full");
    expect(footer.className).toMatch(/top/);
  });

  it("a divider the consumer asks for is drawn in the Divider ink; zone lines stay faint", () => {
    render(
      <Card.Root>
        <Card.Header data-testid="header">
          <Card.Title>Транспорт</Card.Title>
        </Card.Header>
        <Card.Body divider="full" data-testid="body">
          x
        </Card.Body>
        <Card.Footer data-testid="footer">y</Card.Footer>
      </Card.Root>,
    );
    expect(screen.getByTestId("body").className).toMatch(/subtle/);
    expect(screen.getByTestId("footer").className).not.toMatch(/subtle/);
    expect(
      cssValue(
        cssRule("src/internal/hairline.module.css", ".top.subtle, .bottom.subtle"),
        "background-image",
      ),
    ).toContain("--prime-color-border-subtle");
  });
});
