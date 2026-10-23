import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { DescriptionList } from "@/components/description-list/DescriptionList";
import { ProgressBar } from "@/components/progress-bar/ProgressBar";
import { Icon } from "@/icons";
import { headerRowStyles } from "@/internal/headerRow";
import rowLink from "@/internal/rowLink.module.css";
import { FRAME_DESCRIPTION, FRAME_TITLE, surfaceFrameClass } from "@/internal/surfaceFrame";
import { cssRule, cssValue } from "@/test/css";
import { Kpi } from "./Kpi";

import styles from "./Kpi.module.css";

const CSS = "src/components/kpi/Kpi.module.css";

const PARTS = [
  { value: 591, label: "Сайт" },
  { value: 360, label: "Партнёры" },
  { value: 231, label: "Реклама" },
];

/** Every part, written out of order, for the arrangement tests. */
function everything(size: "xs" | "s" | "m" | "l" | "xl") {
  return (
    <Kpi.Root size={size} data-testid="kpi">
      <Kpi.Footer data-testid="footer">
        <Kpi.Note data-testid="note">9 счетов ждут напоминания</Kpi.Note>
        <Kpi.Total label="Счетов">412</Kpi.Total>
        <Kpi.Total label="Средний чек">21 100 ₽</Kpi.Total>
        <Kpi.Total label="Возвраты" data-testid="third-total">
          146 000 ₽
        </Kpi.Total>
        <DescriptionList.Root data-testid="breakdown">
          <DescriptionList.Item label="Маржа">42,8 %</DescriptionList.Item>
        </DescriptionList.Root>
        <Kpi.Legend segments={PARTS} />
      </Kpi.Footer>
      <Kpi.Media data-testid="media">график</Kpi.Media>
      <Kpi.Meta data-testid="meta">план 9,5 млн ₽</Kpi.Meta>
      <Kpi.Period data-testid="period">1–22 окт</Kpi.Period>
      <Kpi.Delta value={9.6} tone="success" data-testid="delta">
        +9,6 %
      </Kpi.Delta>
      <Kpi.Value data-testid="value">
        8,7<Kpi.Unit data-testid="unit">млн ₽</Kpi.Unit>
      </Kpi.Value>
      <Kpi.Actions data-testid="actions">
        <Badge.Root>Прогноз</Badge.Root>
      </Kpi.Actions>
      <Kpi.Description data-testid="description">Оплаченные счета</Kpi.Description>
      <Kpi.Title data-testid="title">Выручка</Kpi.Title>
      <Kpi.Icon data-testid="icon">
        <Icon name="currency.ruble" />
      </Kpi.Icon>
    </Kpi.Root>
  );
}

describe("Kpi", () => {
  it("is a surface of the ladder with its own size, class and ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Kpi.Root ref={ref} data-testid="kpi" className="own" size="l">
        <Kpi.Title>Выручка</Kpi.Title>
        <Kpi.Value>4,2 млн ₽</Kpi.Value>
      </Kpi.Root>,
    );
    const card = screen.getByTestId("kpi");
    expect(card).toBe(ref.current);
    expect(card).toHaveClass(styles.root, "own");
    expect(card).toHaveAttribute("data-depth", "1");
    expect(card).toHaveAttribute("data-size", "l");
  });

  it("stands on the frame a step under its tier: S xs · M s · L m · XL l", () => {
    const frames = (["xs", "s", "m", "l", "xl"] as const).map((size) => {
      const { unmount } = render(everything(size));
      const frame = screen.getByTestId("kpi").getAttribute("data-frame");
      expect(screen.getByTestId("kpi")).toHaveClass(surfaceFrameClass);
      unmount();
      return frame;
    });
    expect(frames).toEqual(["xs", "xs", "s", "m", "l"]);
    const rule = cssRule(CSS, ".root");
    expect(cssValue(rule, "padding")).toBe("var(--frame-pad)");
    expect(cssValue(rule, "border-radius")).toBe("var(--frame-radius)");
    expect(cssValue(rule, "gap")).toBe("var(--frame-gap)");
  });

  it("the title takes the frame's title role", () => {
    render(everything("m"));
    expect(screen.getByTestId("title")).toHaveClass(FRAME_TITLE.s, headerRowStyles.title);
  });

  it("takes s for the kit's xs", () => {
    render(everything("xs"));
    expect(screen.getByTestId("kpi")).toHaveAttribute("data-size", "s");
  });

  it("M: the parts stand in their places whatever order they are written in", () => {
    render(everything("m"));
    const card = screen.getByTestId("kpi");
    const head = screen.getByTestId("title").closest(`.${headerRowStyles.header}`) as HTMLElement;
    expect(head).toHaveAttribute("data-lines", "one");
    expect([...head.children]).toEqual([
      screen.getByTestId("title").closest(`.${headerRowStyles.titles}`),
      screen.getByTestId("actions"),
    ]);
    const figure = screen.getByTestId("value").closest(`.${styles.figure}`) as HTMLElement;
    const [valueRow, line] = [...figure.children] as HTMLElement[];
    expect([...valueRow.children]).toEqual([
      screen.getByTestId("value"),
      screen.getByTestId("delta"),
    ]);
    // The line under the value: the period, a quiet dot, the note.
    expect(line.firstElementChild).toBe(screen.getByTestId("period"));
    expect(line.children[1]).toHaveAttribute("aria-hidden", "true");
    expect(line.lastElementChild).toBe(screen.getByTestId("meta"));
    expect([...card.children]).toEqual([
      head,
      figure,
      screen.getByTestId("media"),
      screen.getByTestId("footer"),
    ]);
  });

  it("S holds the title, the period at the end of the head, the value and the change — nothing else", () => {
    render(everything("s"));
    const head = screen.getByTestId("title").closest(`.${styles.head}`) as HTMLElement;
    expect(head.lastElementChild).toContainElement(screen.getByTestId("period"));
    for (const part of ["icon", "description", "actions", "meta", "media", "footer"]) {
      expect(screen.queryByTestId(part)).toBeNull();
    }
    expect(screen.getByTestId("delta")).toBeInTheDocument();
  });

  it("M drops the icon and the description; its footer holds only the legend", () => {
    render(everything("m"));
    expect(screen.queryByTestId("icon")).toBeNull();
    expect(screen.queryByTestId("description")).toBeNull();
    const footer = screen.getByTestId("footer");
    expect(footer).toContainElement(screen.getByText("Сайт"));
    expect(screen.queryByTestId("note")).toBeNull();
    expect(screen.queryByText("Счетов")).toBeNull();
  });

  it("L adds the icon and the description; its footer keeps two totals and no breakdown", () => {
    render(everything("l"));
    expect(screen.getByTestId("icon")).toHaveAttribute("data-size", "s");
    expect(screen.getByTestId("icon")).toHaveClass(headerRowStyles.mark);
    expect(screen.getByTestId("description")).toHaveTextContent("Оплаченные счета");
    expect(screen.getByTestId("description")).toHaveClass(FRAME_DESCRIPTION.m);
    expect(screen.getByTestId("kpi").querySelector(`.${headerRowStyles.header}`)).toHaveAttribute(
      "data-lines",
      "two",
    );
    expect(screen.getByTestId("note")).toBeInTheDocument();
    expect(screen.getByText("Средний чек")).toBeInTheDocument();
    expect(screen.queryByTestId("third-total")).toBeNull();
    expect(screen.queryByTestId("breakdown")).toBeNull();
  });

  it("XL keeps up to four totals and the breakdown; its icon tile is 48", () => {
    render(everything("xl"));
    expect(screen.getByTestId("icon")).toHaveAttribute("data-size", "m");
    expect(screen.getByTestId("third-total")).toBeInTheDocument();
    expect(screen.getByTestId("breakdown")).toBeInTheDocument();
  });

  it("a footer of totals lays them out in columns", () => {
    render(
      <Kpi.Root size="xl">
        <Kpi.Value>8 704 000 ₽</Kpi.Value>
        <Kpi.Footer data-testid="footer">
          <Kpi.Total label="Счетов">412</Kpi.Total>
          <Kpi.Total label="Средний чек">21 100 ₽</Kpi.Total>
        </Kpi.Footer>
      </Kpi.Root>,
    );
    expect(screen.getByTestId("footer")).toHaveClass(styles.footer, styles.totals);
    expect(cssValue(cssRule(CSS, ".totals"), "grid-auto-flow")).toBe("column");
  });

  it("the ring stands in the footer beside its legend on XL only", () => {
    const { rerender } = render(
      <Kpi.Root size="xl">
        <Kpi.Value>24 600</Kpi.Value>
        <Kpi.Footer>
          <Kpi.Legend segments={PARTS} ring />
        </Kpi.Footer>
      </Kpi.Root>,
    );
    expect(screen.getByRole("group", { name: /Сайт/ }).closest('[data-size="2xl"]')).not.toBeNull();
    rerender(
      <Kpi.Root size="l">
        <Kpi.Value>24 600</Kpi.Value>
        <Kpi.Footer>
          <Kpi.Legend segments={PARTS} ring />
        </Kpi.Footer>
      </Kpi.Root>,
    );
    expect(document.querySelector('[data-size="2xl"]')).toBeNull();
    expect(screen.getByText("Сайт")).toBeInTheDocument();
  });

  it("the legend reads each part's value and share", () => {
    render(
      <Kpi.Root>
        <Kpi.Footer>
          <Kpi.Legend segments={PARTS} />
        </Kpi.Footer>
      </Kpi.Root>,
    );
    const row = screen.getByText("Сайт").closest("li") as HTMLElement;
    expect(row).toHaveTextContent("591");
    expect(row).toHaveTextContent("50%");
  });

  it("the actions take the frame's size, the media two steps under the card", () => {
    render(
      <Kpi.Root size="l">
        <Kpi.Actions>
          <Button.Root data-testid="button">Отчёт</Button.Root>
        </Kpi.Actions>
        <Kpi.Media>
          <ProgressBar value={73} aria-label="План" data-testid="bar" />
        </Kpi.Media>
      </Kpi.Root>,
    );
    expect(screen.getByTestId("button")).toHaveAttribute("data-size", "m");
    expect(screen.getByTestId("bar").closest("[data-size]")).toHaveAttribute("data-size", "s");
  });

  it("the unit never grows the value's line", () => {
    render(everything("m"));
    expect(screen.getByTestId("unit")).toHaveClass(styles.unit);
    expect(cssValue(cssRule(CSS, ".unit"), "line-height")).toBe("1");
  });

  it("nothing wraps and nothing leaves the card: the note is cut first, the value last, the period only at the edge", () => {
    expect(cssValue(cssRule(CSS, ".period"), "flex")).toBe("0 0 auto");
    expect(cssValue(cssRule(CSS, ".period"), "max-width")).toBe("100%");
    expect(cssValue(cssRule(CSS, ".meta"), "text-overflow")).toBe("ellipsis");
    expect(cssValue(cssRule(CSS, ".value"), "text-overflow")).toBe("ellipsis");
    expect(cssValue(cssRule(CSS, ".totalValue"), "text-overflow")).toBe("ellipsis");
    expect(cssValue(cssRule(CSS, ".delta"), "flex")).toBe("none");
  });

  it("the change turns its arrow by the sign and takes its tone; a reading drives it, no change — no part", () => {
    render(
      <>
        <Kpi.Root>
          <Kpi.Delta
            reading={{ change: -3, changeText: "−3%", changeTone: "danger" }}
            data-testid="delta"
          />
        </Kpi.Root>
        <Kpi.Root data-testid="quiet">
          <Kpi.Value>38</Kpi.Value>
          <Kpi.Delta reading={{ change: null, changeText: "", changeTone: "neutral" }} />
        </Kpi.Root>
        <Kpi.Root>
          <Kpi.Delta value={0} data-testid="flat">
            0 %
          </Kpi.Delta>
        </Kpi.Root>
      </>,
    );
    const badge = screen.getByTestId("delta").firstElementChild as HTMLElement;
    expect(badge).toHaveTextContent("−3%");
    expect(badge).toHaveAttribute("data-tone", "danger");
    expect(badge.querySelector(`.${styles.trend}`)).toHaveAttribute("data-down", "true");
    expect(screen.getByTestId("quiet").querySelector(`.${styles.delta}`)).toBeNull();
    expect(screen.getByTestId("flat").querySelector(`.${styles.trend}`)).toBeNull();
  });

  it("the change badge is a chip a size under the figure", () => {
    render(
      <Kpi.Root size="xl">
        <Kpi.Delta value={1} tone="success" data-testid="delta">
          +1 %
        </Kpi.Delta>
      </Kpi.Root>,
    );
    expect(screen.getByTestId("delta").firstElementChild).toHaveAttribute("data-size", "m");
  });

  it("a note says its meaning in words; its dot is the kit's StatusDot, decorative", () => {
    render(
      <Kpi.Root size="l">
        <Kpi.Footer>
          <Kpi.Note tone="danger" data-testid="note">
            Сорван срок
          </Kpi.Note>
        </Kpi.Footer>
      </Kpi.Root>,
    );
    const note = screen.getByTestId("note");
    expect(note).toHaveAttribute("data-tone", "danger");
    expect(note.querySelector('[data-tone="danger"] > [aria-hidden="true"]')).not.toBeNull();
    expect(cssValue(cssRule(CSS, ".noteText"), "text-overflow")).toBe("ellipsis");
  });

  it("loading: the data parts are Skeletons, the head stays, the card is busy", () => {
    render(
      <Kpi.Root loading data-testid="kpi">
        <Kpi.Title>Выручка</Kpi.Title>
        <Kpi.Value data-testid="value">8,7 млн ₽</Kpi.Value>
        <Kpi.Delta value={9.6} tone="success" data-testid="delta">
          +9,6 %
        </Kpi.Delta>
        <Kpi.Period data-testid="period">1–22 окт</Kpi.Period>
      </Kpi.Root>,
    );
    expect(screen.getByTestId("kpi")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Выручка")).toBeInTheDocument();
    for (const part of ["value", "delta", "period"]) {
      expect(screen.getByTestId(part)).toHaveAttribute("data-loading", "true");
    }
    expect(screen.queryByText("8,7 млн ₽")).toBeNull();
  });

  it("is a group named by its title; a link card is named by its own text", () => {
    render(
      <>
        <Kpi.Root data-testid="named">
          <Kpi.Title>Выручка</Kpi.Title>
          <Kpi.Value>4,2 млн ₽</Kpi.Value>
        </Kpi.Root>
        <Kpi.Root data-testid="own-id">
          <Kpi.Title id="revenue-title">Заказы</Kpi.Title>
        </Kpi.Root>
        <Kpi.Root data-testid="untitled">
          <Kpi.Value>37</Kpi.Value>
        </Kpi.Root>
        <Kpi.Root asChild>
          <a href="#x" data-testid="link">
            <Kpi.Title>Счета</Kpi.Title>
          </a>
        </Kpi.Root>
      </>,
    );
    expect(screen.getByRole("group", { name: "Выручка" })).toBe(screen.getByTestId("named"));
    expect(screen.getByTestId("own-id")).toHaveAttribute("aria-labelledby", "revenue-title");
    expect(screen.getByTestId("untitled")).not.toHaveAttribute("role");
    expect(screen.getByTestId("link")).not.toHaveAttribute("role");
  });

  it("a Kpi.Link in the title stretches over the card; the controls inside stay above it", async () => {
    const user = userEvent.setup();
    render(
      <Kpi.Root data-testid="kpi">
        <Kpi.Title>
          <Kpi.Link href="#leads">Лиды</Kpi.Link>
        </Kpi.Title>
        <Kpi.Value>58</Kpi.Value>
      </Kpi.Root>,
    );
    const card = screen.getByTestId("kpi");
    const link = screen.getByRole("link", { name: "Лиды" });
    expect(card).toHaveAttribute("data-link", "true");
    expect(card).toHaveClass(rowLink.host);
    expect(link).toHaveAttribute("data-row-link");
    expect(cssValue(cssRule(CSS, ".link::after"), "inset")).toBe("0");
    await user.tab();
    expect(link).toHaveFocus();
  });

  it("asChild: the link is the card — one Tab stop that carries the card's look", async () => {
    const user = userEvent.setup();
    render(
      <Kpi.Root asChild>
        <a href="#revenue" data-testid="link">
          <Kpi.Title>Выручка</Kpi.Title>
          <Kpi.Value>8,7 млн ₽</Kpi.Value>
        </a>
      </Kpi.Root>,
    );
    const link = screen.getByTestId("link");
    expect(link).toHaveClass(styles.root);
    expect(link).toHaveAttribute("data-interactive", "true");
    await user.tab();
    expect(link).toHaveFocus();
  });
});
