import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Avatar } from "@/components/avatar/Avatar";
import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { ProgressCircle } from "@/components/progress-circle/ProgressCircle";
import { Icon } from "@/icons";
import hairline from "@/internal/hairline.module.css";
import textRole from "@/internal/textRole.module.css";
import { cssRule, cssValue } from "@/test/css";

import { Card } from "./Card";
import styles from "./Card.module.css";

const CSS = "src/components/card/Card.module.css";

describe("Card", () => {
  it("lays out by its zones: zoned, a cover when the media leads, bare content edge to edge", () => {
    render(
      <>
        <Card.Root data-testid="zoned">
          <Card.Header>
            <Card.Title>Выручка</Card.Title>
          </Card.Header>
          <Card.Body>Сводка</Card.Body>
        </Card.Root>
        <Card.Root data-testid="cover">
          <Card.Media>
            <img src="unit.jpg" alt="" />
          </Card.Media>
          <Card.Header>
            <Card.Title>Honda PCX 160</Card.Title>
          </Card.Header>
        </Card.Root>
        <Card.Root data-testid="bare">
          <div>Лента чата</div>
        </Card.Root>
      </>,
    );
    expect(screen.getByTestId("zoned")).toHaveAttribute("data-layout", "zoned");
    expect(screen.getByTestId("cover")).toHaveAttribute("data-layout", "cover");
    expect(screen.getByTestId("bare")).toHaveAttribute("data-layout", "bare");
    // Bare content pads itself: the card adds no padding of its own.
    expect(() => cssRule(CSS, '.root[data-layout="bare"]')).toThrow();
  });

  it("renders a header, body, media and footer", () => {
    render(
      <Card.Root data-testid="panel-card">
        <Card.Header>
          <Card.Title>Revenue</Card.Title>
          <Card.Actions>
            <button type="button">Period</button>
          </Card.Actions>
        </Card.Header>
        <Card.Body>Intro</Card.Body>
        <Card.Media>Plot</Card.Media>
        <Card.Footer>
          <button type="button">Save</button>
        </Card.Footer>
      </Card.Root>,
    );
    expect(screen.getByRole("heading", { name: "Revenue" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Period" })).toBeInTheDocument();
    expect(screen.getByText("Intro")).toBeInTheDocument();
    expect(screen.getByText("Plot")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("renders a list of items", () => {
    render(
      <Card.Root>
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

  it("titles render h3 by default, title-s, and take a heading level via as", () => {
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
    expect(screen.getByRole("heading", { level: 2, name: "Профиль" })).toHaveClass(textRole.titleS);
    expect(screen.getByRole("heading", { level: 3, name: "Тариф" })).toBeInTheDocument();
  });

  it("Card.Actions is the end of the header: in order, centred on the text, the consumer's own", () => {
    const row = cssRule(CSS, ".actions");
    expect(cssValue(row, "display")).toBe("flex");
    expect(cssValue(row, "gap")).toBe("var(--prime-space-2)");
    const end = cssRule(CSS, ".header > .actions");
    expect(cssValue(end, "grid-column")).toBe("end");
    expect(cssValue(end, "grid-row")).toBe("1 / -1");
    render(
      <Card.Root>
        <Card.Header data-testid="header">
          <Card.Title>300 $</Card.Title>
          <Card.Description>наличные</Card.Description>
          <Card.Actions data-testid="actions" className="own">
            <Button.Root>Вернуть</Button.Root>
            <Button.Root aria-label="Исправить">
              <Button.Icon>
                <Icon name="action.edit" />
              </Button.Icon>
            </Button.Root>
          </Card.Actions>
        </Card.Header>
      </Card.Root>,
    );
    const actions = screen.getByTestId("actions");
    expect(actions).toHaveClass(styles.actions, "own");
    expect(actions.parentElement).toBe(screen.getByTestId("header"));
    expect([...actions.children]).toEqual([
      screen.getByRole("button", { name: "Вернуть" }),
      screen.getByRole("button", { name: "Исправить" }),
    ]);
  });

  it("dropped actions run to the end edge; their buttons share the width, icon buttons only stay", () => {
    const narrow = ["@container (max-width: 22rem)"];
    const rule = cssRule(CSS, ".header > .actions:has(> :not([data-icon-only]))", narrow);
    expect(cssValue(rule, "grid-column")).toBe("text / -1");
    expect(cssValue(rule, "justify-self")).toBe("stretch");
    expect(cssValue(rule, "justify-content")).toBe("flex-start");
    expect(
      cssValue(
        cssRule(CSS, ".header > .actions > :is(button, a):not([data-icon-only])", narrow),
        "flex",
      ),
    ).toBe("1 1 auto");
  });

  it("becomes the link it wraps with asChild: one tab stop, parts inside, the root's attributes", async () => {
    render(
      <Card.Root asChild className="extra">
        <a href="#orders">
          <Card.Header>
            <Card.Title>Заказы</Card.Title>
            <Card.Description>128 за неделю</Card.Description>
          </Card.Header>
        </a>
      </Card.Root>,
    );
    const link = screen.getByRole("link", { name: /Заказы\s*128/ });
    expect(link).toHaveAttribute("href", "#orders");
    expect(link).toHaveAttribute("data-interactive", "true");
    expect(link).toHaveAttribute("data-layout", "zoned");
    expect(link).toHaveAttribute("data-depth");
    expect(link).toHaveClass("extra");
  });

  it("is one Tab stop with asChild: focus moves onto the whole link and on past it", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">До</button>
        <Card.Root asChild>
          <a href="#orders">
            <Card.Header>
              <Card.Title>Заказы</Card.Title>
            </Card.Header>
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
          <Card.Actions>
            <button type="button">Отвязать</button>
          </Card.Actions>
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
      <Card.Root>
        <Card.Header>
          <Card.Icon data-testid="icon" aria-hidden>
            ×
          </Card.Icon>
          <Card.Title>Сессия</Card.Title>
        </Card.Header>
      </Card.Root>,
    );
    const icon = screen.getByTestId("icon");
    expect(icon).toHaveAttribute("data-tone", "accent");
    expect(icon).not.toHaveAttribute("data-media");
  });

  it("a ProgressCircle in Card.Icon is the record's state ring: no tile, the slot's 40, its own name", () => {
    render(
      <Card.Root size="s">
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
          <Card.Total label="к оплате 6 400 ฿" tone="warning" data-testid="total">
            26 400 ฿
          </Card.Total>
        </Card.Footer>
      </Card.Root>,
    );
    const note = screen.getByTestId("note");
    expect(note.firstElementChild).toBe(screen.getByTestId("dot"));
    expect(note.lastElementChild).toHaveTextContent("Выдать 6 нояб · Банг Тао");
    expect(note.lastElementChild).not.toBe(screen.getByTestId("dot"));
    const total = screen.getByTestId("total");
    const [label, value] = [...total.children];
    expect(label).toHaveTextContent("к оплате 6 400 ฿");
    expect(label).toHaveAttribute("data-tone", "warning");
    expect(label).toHaveClass(textRole.bodyS);
    expect(value).toHaveTextContent("26 400 ฿");
    expect(value).toHaveClass(textRole.titleM);

    expect(cssValue(cssRule(CSS, ".footer:has(> .total)"), "flex-wrap")).toBe("nowrap");
    expect(cssValue(cssRule(CSS, ".total"), "margin-inline-start")).toBe("auto");
    expect(cssValue(cssRule(CSS, ".total"), "justify-items")).toBe("end");
    expect(cssValue(cssRule(CSS, ".noteText"), "text-overflow")).toBe("ellipsis");
  });

  it("a total without a label is the amount alone", () => {
    render(
      <Card.Root>
        <Card.Footer>
          <Card.Total data-testid="total">26 400 ฿</Card.Total>
        </Card.Footer>
      </Card.Root>,
    );
    expect(screen.getByTestId("total").children).toHaveLength(1);
  });

  it("divider=fill sets the footer on the next layer of the ladder, its actions from the start", () => {
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
    expect(cssValue(cssRule(CSS, '.footer[data-divider="fill"]'), "background")).toBe(
      "var(--prime-color-layer-current)",
    );
    expect(
      cssValue(
        cssRule(CSS, '.root[data-layout="zoned"] > .footer[data-divider="fill"]'),
        "justify-content",
      ),
    ).toBe("flex-start");
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
    const rule = cssRule(CSS, ".header > .mark");
    expect(cssValue(rule, "inset-block-start")).toBe("auto");
    expect(cssValue(rule, "align-self")).toBe("center");
  });

  it("a link card without a header keeps the arrow in the link and gives its room to the content", () => {
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
    expect(
      cssValue(
        cssRule(
          CSS,
          ".root[data-mark]:not(:has(> .header)), .root[data-link]:not(:has(> .header))",
        ),
        "--corner-mark-room",
      ),
    ).toBe("var(--prime-space-6)");
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
    const grid = cssRule(CSS, ".header:has(> .icon)");
    expect(cssValue(grid, "grid-template-columns")).toBe(
      "[icon] auto [text] minmax(0, 1fr) [end] auto",
    );
    const icon = cssRule(CSS, ".header > .icon");
    expect(cssValue(icon, "grid-column")).toBe("icon");
    expect(cssValue(icon, "grid-row")).toBe("1 / -1");
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
    expect(cssValue(cssRule(CSS, ".link::after"), "inset")).toBe("0");
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
    expect(cssValue(cssRule(CSS, ".link"), "border")).toBe("0");
    await userEvent.tab();
    expect(link).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onOpen).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole("button", { name: "Выдан" }));
    expect(onIssue).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("a Badge in a title stands beside the text, a chip gap apart", () => {
    const rule = cssRule(CSS, ".badged");
    expect(cssValue(rule, "display")).toBe("flex");
    expect(cssValue(rule, "align-items")).toBe("center");
    expect(cssValue(rule, "gap")).toBe("var(--prime-space-2)");
    render(
      <>
        <Card.Root>
          <Card.Header>
            <Card.Title>
              <Badge.Root color="green">У нас</Badge.Root>
              300 $
            </Card.Title>
            <Card.Description>наличные</Card.Description>
          </Card.Header>
        </Card.Root>
        <Card.Root>
          <Card.Header>
            <Card.Title>Без бейджа</Card.Title>
          </Card.Header>
        </Card.Root>
      </>,
    );
    expect(screen.getByRole("heading", { name: /300 \$/ })).toHaveClass(styles.badged);
    expect(screen.getByRole("heading", { name: "Без бейджа" })).not.toHaveClass(styles.badged);
  });

  it("a record row lays out like the header: its Card.Actions at the end, a zone folding under it", () => {
    const { rerender } = render(
      <Card.Root>
        <Card.List>
          <Card.ListItem data-testid="row">
            <Card.Title>
              <Badge.Root>У нас</Badge.Root>300 $
            </Card.Title>
            <Card.Description>Наличные · принят 8 окт</Card.Description>
            <Card.Actions>
              <Button.Root>Вернуть</Button.Root>
            </Card.Actions>
            <Card.ListItemContent open={false} data-testid="zone">
              Форма
            </Card.ListItemContent>
          </Card.ListItem>
          <Card.ListItem data-testid="plain">Просто строка</Card.ListItem>
        </Card.List>
      </Card.Root>,
    );
    const row = screen.getByTestId("row");
    expect(row).toHaveAttribute("data-record");
    const head = row.firstElementChild as HTMLElement;
    expect(head).toHaveClass(styles.header);
    expect(head.querySelector(`.${styles.actions}`)).toContainElement(
      screen.getByRole("button", { name: "Вернуть" }),
    );
    expect(head).not.toContainElement(screen.getByTestId("zone"));
    expect(screen.getByTestId("zone")).toHaveAttribute("data-state", "closed");
    expect(screen.getByTestId("plain")).not.toHaveAttribute("data-record");
    rerender(
      <Card.Root>
        <Card.List>
          <Card.ListItem>
            <Card.Title>300 $</Card.Title>
            <Card.ListItemContent open data-testid="zone">
              Форма
            </Card.ListItemContent>
          </Card.ListItem>
        </Card.List>
      </Card.Root>,
    );
    expect(screen.getByTestId("zone")).toHaveAttribute("data-state", "open");
  });

  it("a list first in the card has the same padding above as below", () => {
    const rule = cssRule(CSS, ".header + .list, .list:first-child");
    expect(cssValue(rule, "padding-top")).toBe("var(--prime-space-2)");
  });

  it("a row of fields folds its zone open under it too; outside a row the zone says so", () => {
    render(
      <Card.Root>
        <Card.List>
          <Card.ListItem data-testid="row">
            Поля строки
            <Card.ListItemContent open data-testid="zone">
              Форма
            </Card.ListItemContent>
          </Card.ListItem>
        </Card.List>
      </Card.Root>,
    );
    expect(screen.getByTestId("row").lastElementChild).toContainElement(screen.getByTestId("zone"));
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Card.ListItemContent open>Форма</Card.ListItemContent>)).toThrow(
      "Card.ListItemContent must be rendered inside Card.ListItem",
    );
    error.mockRestore();
  });

  it("a row's folded zone rendered by the consumer's own component stands under the row", () => {
    function HoldForm({ open }: { open: boolean }) {
      return (
        <Card.ListItemContent open={open} data-testid="hold">
          Форма удержания
        </Card.ListItemContent>
      );
    }
    render(
      <Card.Root>
        <Card.List>
          <Card.ListItem data-testid="row">
            <Card.Title>300 $</Card.Title>
            <Card.Actions>
              <Button.Root>Вернуть</Button.Root>
            </Card.Actions>
            <HoldForm open />
          </Card.ListItem>
        </Card.List>
      </Card.Root>,
    );
    const row = screen.getByTestId("row");
    const head = row.firstElementChild as HTMLElement;
    expect(head).not.toContainElement(screen.getByTestId("hold"));
    expect(row.lastElementChild).toContainElement(screen.getByTestId("hold"));
    expect(row).toHaveClass(hairline.between, hairline.subtle);
  });

  it("a badge in a description lays the line out as a row, whatever component renders it", () => {
    function OwnerBadge() {
      return (
        <Dropdown.Root>
          <Dropdown.Trigger>
            <Badge.Root aria-label="Исполнитель: Анна Котова">Анна Котова</Badge.Root>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>Илья Соколов</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      );
    }
    render(
      <Card.Root>
        <Card.Header>
          <Card.Title>Продлить страховку</Card.Title>
          <Card.Description data-testid="owned">
            <OwnerBadge />
            истёк 2 дн. назад
          </Card.Description>
        </Card.Header>
      </Card.Root>,
    );
    expect(screen.getByTestId("owned").querySelector(":scope > [data-badge]")).not.toBeNull();
  });

  it("badges in a header description stand in a wrapping row; a Badge.Group inside is valid", () => {
    const rule = cssRule(CSS, ".description:has(> [data-badge])");
    expect(cssValue(rule, "display")).toBe("flex");
    expect(cssValue(rule, "flex-wrap")).toBe("wrap");
    expect(cssValue(rule, "align-items")).toBe("center");
    expect(cssValue(rule, "gap")).toBe("var(--prime-space-2)");
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <>
        <Card.Root>
          <Card.Header>
            <Card.Title>Honda PCX 160</Card.Title>
            <Card.Description data-testid="badges">
              <Badge.Root color="yellow">Бронь</Badge.Root>
              <Badge.Root color="green">Депозит 150 $</Badge.Root>
            </Card.Description>
          </Card.Header>
        </Card.Root>
        <Card.Root>
          <Card.Header>
            <Card.Title>Yamaha NMAX</Card.Title>
            <Card.Description data-testid="group">
              <Badge.Group>
                <Badge.Root>Выдан</Badge.Root>
              </Badge.Group>
            </Card.Description>
          </Card.Header>
        </Card.Root>
        <Card.Root>
          <Card.Header>
            <Card.Title>Без бейджей</Card.Title>
            <Card.Description data-testid="text">Банг Тао</Card.Description>
          </Card.Header>
        </Card.Root>
      </>,
    );
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
    const badges = screen.getByTestId("badges");
    expect(badges.tagName).toBe("DIV");
    expect(badges).toHaveClass(styles.description);
    expect(badges.querySelectorAll(":scope > [data-badge]")).toHaveLength(2);
    expect(screen.getByTestId("group").querySelector(":scope > [data-badge]")).not.toBeNull();
    expect(screen.getByTestId("text").querySelector(":scope > [data-badge]")).toBeNull();
  });

  it("a cover draws no zone lines; one that opens its record draws no arrow and keeps the title's width", () => {
    expect(cssValue(cssRule(CSS, '.root[data-layout="cover"] .mark'), "display")).toBe("none");
    expect(cssValue(cssRule(CSS, '.root[data-layout="cover"] .title'), "padding-inline-end")).toBe(
      "0",
    );
    render(
      <Card.Root data-testid="tile">
        <Card.Media>
          <img src="unit.jpg" alt="" />
        </Card.Media>
        <Card.Header data-testid="header">
          <Card.Title>
            <Card.Link href="#unit">Honda PCX 160</Card.Link>
          </Card.Title>
        </Card.Header>
        <Card.Body data-testid="body">Бейджи</Card.Body>
        <Card.Footer data-testid="footer">Простой 2 дн.</Card.Footer>
      </Card.Root>,
    );
    // The whole card still opens the record through its stretched link.
    expect(screen.getByTestId("tile")).toHaveAttribute("data-link", "true");
    expect(screen.getByRole("link", { name: "Honda PCX 160" })).toHaveAttribute("href", "#unit");
    for (const id of ["header", "body"]) {
      expect(screen.getByTestId(id)).not.toHaveClass(hairline.between);
    }
    expect(screen.getByTestId("footer")).not.toHaveClass(hairline.top);
  });

  it("size sets the padding tier and gives the controls inside the tier; unsized it gives none", () => {
    expect(
      cssValue(cssRule(CSS, '.root:is([data-size="xs"], [data-size="s"])'), "--card-pad"),
    ).toBe("var(--prime-card-padding-s)");
    expect(
      cssValue(cssRule(CSS, '.root:is([data-size="l"], [data-size="xl"])'), "--card-pad"),
    ).toBe("var(--prime-card-padding-l)");
    render(
      <>
        <Card.Root size="s" data-testid="dense">
          <Card.Header>
            <Card.Title>Каталог</Card.Title>
            <Card.Actions>
              <Button.Root data-testid="dense-button">Открыть</Button.Root>
            </Card.Actions>
          </Card.Header>
        </Card.Root>
        <Card.Root data-testid="plain">
          <Card.Header>
            <Card.Title>Сводка</Card.Title>
            <Card.Actions>
              <Badge.Root data-testid="plain-badge">Новый</Badge.Root>
            </Card.Actions>
          </Card.Header>
        </Card.Root>
      </>,
    );
    expect(screen.getByTestId("dense")).toHaveAttribute("data-size", "s");
    expect(screen.getByTestId("dense-button")).toHaveAttribute("data-size", "s");
    expect(screen.getByTestId("plain")).toHaveAttribute("data-size", "m");
    // No tier of its own and no host: a badge keeps its standalone tier.
    expect(screen.getByTestId("plain-badge")).toHaveAttribute("data-tier", "m");
  });

  it("a zoned header pads its bottom as its top; only a chart right under it takes none", () => {
    const zone = cssRule(CSS, '.root[data-layout="zoned"] > .header');
    // Alone, before the footer (any divider), the body or the list — in a flat card too.
    expect(cssValue(zone, "padding")).toBe("var(--prime-space-4) var(--card-pad)");
    expect(
      cssValue(
        cssRule(CSS, '.root[data-layout="zoned"] > .header:has(+ .media)'),
        "padding-bottom",
      ),
    ).toBe("0");
    render(
      <>
        <Card.Root flat data-testid="flat">
          <Card.Header data-testid="alone">
            <Card.Title>Telegram</Card.Title>
          </Card.Header>
        </Card.Root>
        <Card.Root>
          <Card.Header data-testid="over-footer">
            <Card.Title>События</Card.Title>
          </Card.Header>
          <Card.Footer divider="fill">
            <button type="button">Все события</button>
          </Card.Footer>
        </Card.Root>
      </>,
    );
    expect(screen.getByTestId("flat")).toHaveAttribute("data-flat", "true");
    expect(screen.getByTestId("alone")).toHaveClass(styles.header, hairline.between);
    expect(screen.getByTestId("over-footer").nextElementSibling).toHaveClass(styles.footer);
  });

  it("a card that is a link shows the transition arrow; a button card does not", () => {
    const { rerender } = render(
      <Card.Root asChild>
        <a href="#x" data-testid="card">
          Лиды
        </a>
      </Card.Root>,
    );
    expect(screen.getByTestId("card")).toHaveAttribute("data-mark", "true");
    expect(screen.getByTestId("card").querySelector("svg")).not.toBeNull();
    rerender(
      <Card.Root asChild>
        <button type="button" data-testid="card">
          Лиды
        </button>
      </Card.Root>,
    );
    expect(screen.getByTestId("card")).not.toHaveAttribute("data-mark");
    expect(screen.getByTestId("card").querySelector("svg")).toBeNull();
  });

  it("divider=full sets the zone hairline edge to edge on a footer of any layout", () => {
    render(
      <Card.Root>
        <Card.Media>
          <img src="unit.jpg" alt="" />
        </Card.Media>
        <Card.Footer divider="full" data-testid="footer">
          x
        </Card.Footer>
      </Card.Root>,
    );
    const footer = screen.getByTestId("footer");
    expect(footer).toHaveAttribute("data-divider", "full");
    expect(footer).toHaveClass(hairline.top);
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
    expect(screen.getByTestId("body")).toHaveClass(hairline.subtle);
    expect(screen.getByTestId("footer")).not.toHaveClass(hairline.subtle);
    expect(
      cssValue(
        cssRule(
          "src/internal/hairline.module.css",
          ".top.subtle, .bottom.subtle, .between + .between.subtle",
        ),
        "background-image",
      ),
    ).toContain("--prime-color-border-subtle");
  });
});
