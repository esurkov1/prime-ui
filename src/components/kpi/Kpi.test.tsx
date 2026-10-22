import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Sparkline } from "@/components/sparkline/Sparkline";
import { useSparkline } from "@/components/sparkline/useSparkline";
import { Icon } from "@/icons";
import textRole from "@/internal/textRole.module.css";
import { cssRule, cssValue } from "@/test/css";

import { Kpi } from "./Kpi";
import styles from "./Kpi.module.css";

const CSS = "src/components/kpi/Kpi.module.css";

describe("Kpi", () => {
  it("is a card: the root is the kit's Card with the figure in its padded body", () => {
    render(
      <Kpi.Root data-testid="kpi" className="own" size="s">
        <Kpi.Title>Выручка</Kpi.Title>
        <Kpi.Value>4,2 млн ₽</Kpi.Value>
      </Kpi.Root>,
    );
    const card = screen.getByTestId("kpi");
    expect(card).toHaveClass("own");
    expect(card).toHaveAttribute("data-depth", "1");
    expect(card).toHaveAttribute("data-size", "s");
    expect(card).toHaveAttribute("data-layout", "zoned");
    expect(card.querySelector(`.${styles.root}`)).not.toBeNull();
  });

  it("puts the parts in their places whatever order they are written in", () => {
    render(
      <Kpi.Root>
        <Kpi.Media data-testid="media">график</Kpi.Media>
        <Kpi.Meta data-testid="meta">к сентябрю</Kpi.Meta>
        <Kpi.Delta value={18} tone="success" data-testid="delta">
          +18%
        </Kpi.Delta>
        <Kpi.Value data-testid="value">4,2 млн ₽</Kpi.Value>
        <Kpi.Actions data-testid="actions">
          <Button.Root aria-label="Ещё">
            <Button.Icon>
              <Icon name="action.more" />
            </Button.Icon>
          </Button.Root>
        </Kpi.Actions>
        <Kpi.Period data-testid="period">1–31 окт</Kpi.Period>
        <Kpi.Description data-testid="description">Оплаченные счета</Kpi.Description>
        <Kpi.Title data-testid="title">Выручка</Kpi.Title>
        <Kpi.Icon data-testid="icon">
          <Icon name="object.wallet" />
        </Kpi.Icon>
      </Kpi.Root>,
    );
    const head = screen.getByTestId("title").closest(`.${styles.head}`) as HTMLElement;
    expect([...head.children]).toEqual([
      screen.getByTestId("icon"),
      screen.getByTestId("title").parentElement,
      screen.getByTestId("actions"),
    ]);
    const sub = screen.getByTestId("description").parentElement as HTMLElement;
    expect(sub).toHaveClass(styles.sub);
    // The description, a quiet dot, then the period — always last.
    expect(sub.firstElementChild).toBe(screen.getByTestId("description"));
    expect(sub.lastElementChild).toBe(screen.getByTestId("period"));
    expect(sub.children[1]).toHaveAttribute("aria-hidden", "true");
    const figure = screen.getByTestId("value").parentElement as HTMLElement;
    expect(figure).toHaveClass(styles.figure);
    const change = figure.lastElementChild as HTMLElement;
    expect(change).toHaveClass(styles.change);
    expect([...change.children]).toEqual([screen.getByTestId("delta"), screen.getByTestId("meta")]);
    expect(figure.nextElementSibling).toBe(screen.getByTestId("media"));
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

  it("the period stays whole on a narrow line: the description gives way", () => {
    expect(cssValue(cssRule(CSS, ".period"), "flex")).toBe("none");
    expect(cssValue(cssRule(CSS, ".description"), "text-overflow")).toBe("ellipsis");
    expect(cssValue(cssRule(CSS, ".description"), "flex")).toBe("0 1 auto");
  });

  it("on a narrow card actions with a labelled button drop under the title", () => {
    const narrow = ["@container (max-width: 22rem)"];
    const rule = cssRule(
      CSS,
      ".head > .actions:has(> :is(button, a):not([data-icon-only]))",
      narrow,
    );
    expect(cssValue(rule, "flex-basis")).toBe("100%");
    expect(cssValue(rule, "margin-inline-start")).toBe("0");
  });

  it("a reading gives the change its value, tone and text, and no change draws no part", () => {
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
      </>,
    );
    const badge = screen.getByTestId("delta").firstElementChild as HTMLElement;
    expect(badge).toHaveTextContent("−3%");
    expect(badge).toHaveAttribute("data-tone", "danger");
    expect(badge.querySelector(`.${styles.trend}`)).toHaveAttribute("data-down", "true");
    expect(screen.getByTestId("quiet").querySelector(`.${styles.change}`)).toBeNull();
  });

  it("a period alone takes the line under the title with no dot", () => {
    render(
      <Kpi.Root>
        <Kpi.Title>Лиды</Kpi.Title>
        <Kpi.Period data-testid="period">Октябрь</Kpi.Period>
      </Kpi.Root>,
    );
    expect(screen.getByTestId("period").parentElement?.children).toHaveLength(1);
  });

  it("the title is title-s; the value steps by valueSize", () => {
    render(
      <>
        <Kpi.Root>
          <Kpi.Title data-testid="title">Выручка</Kpi.Title>
          <Kpi.Value data-testid="l">4,2 млн ₽</Kpi.Value>
        </Kpi.Root>
        <Kpi.Root valueSize="m">
          <Kpi.Value data-testid="m">92 %</Kpi.Value>
        </Kpi.Root>
        <Kpi.Root valueSize="s">
          <Kpi.Value data-testid="s">Выдать PCX 160</Kpi.Value>
        </Kpi.Root>
      </>,
    );
    expect(screen.getByTestId("title")).toHaveClass(textRole.titleS);
    expect(screen.getByTestId("l")).toHaveClass(textRole.headingL);
    expect(screen.getByTestId("m")).toHaveClass(textRole.headingM);
    expect(screen.getByTestId("s")).toHaveClass(textRole.bodyM);
    expect(cssValue(cssRule(CSS, '.root[data-value-size="s"] .value'), "font-weight")).toBe(
      "var(--prime-font-weight-medium)",
    );
  });

  it("the change is a Badge s whose arrow follows the sign of value, none for zero", () => {
    render(
      <Kpi.Root>
        <Kpi.Delta value={12} tone="success" data-testid="up">
          +12%
        </Kpi.Delta>
        <Kpi.Delta value={-3} tone="danger" data-testid="down">
          −3%
        </Kpi.Delta>
        <Kpi.Delta value={0} data-testid="flat">
          0%
        </Kpi.Delta>
      </Kpi.Root>,
    );
    const badgeOf = (id: string) => screen.getByTestId(id).firstElementChild as HTMLElement;
    expect(badgeOf("up")).toHaveAttribute("data-size", "s");
    expect(badgeOf("up")).toHaveAttribute("data-tone", "success");
    expect(badgeOf("up").querySelector(`.${styles.trend}`)).not.toHaveAttribute("data-down");
    expect(badgeOf("down").querySelector(`.${styles.trend}`)).toHaveAttribute("data-down", "true");
    expect(badgeOf("flat").querySelector(`.${styles.trend}`)).toBeNull();
    expect(badgeOf("flat")).toHaveAttribute("data-tone", "neutral");
    expect(cssValue(cssRule(CSS, ".trend[data-down]"), "rotate")).toBe("180deg");
  });

  it("loading holds a Skeleton in the value, the change and the reference line; the head stays", () => {
    const kpi = (loading: boolean) => (
      <Kpi.Root loading={loading} data-testid="kpi">
        <Kpi.Title>Выручка</Kpi.Title>
        <Kpi.Value data-testid="value">4,2 млн ₽</Kpi.Value>
        <Kpi.Delta value={18} tone="success" data-testid="delta">
          +18%
        </Kpi.Delta>
        <Kpi.Meta data-testid="meta">к сентябрю</Kpi.Meta>
      </Kpi.Root>
    );
    const { rerender } = render(kpi(true));
    expect(screen.getByTestId("kpi")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Выручка")).toBeInTheDocument();
    for (const id of ["value", "delta", "meta"]) {
      const part = screen.getByTestId(id);
      expect(part).toHaveAttribute("data-loading", "true");
      expect(part.querySelector('[aria-hidden="true"][data-shape]')).not.toBeNull();
    }
    expect(screen.queryByText("4,2 млн ₽")).toBeNull();
    rerender(kpi(false));
    expect(screen.getByTestId("kpi")).not.toHaveAttribute("aria-busy");
    expect(screen.getByTestId("value")).toHaveTextContent("4,2 млн ₽");
    expect(screen.getByTestId("delta")).toHaveTextContent("+18%");
  });

  it("the value and the reference line take a tone; a Badge in the value stands beside it", () => {
    render(
      <Kpi.Root>
        <Kpi.Value tone="warning" data-testid="value">
          56 000 ₽<Badge.Root>SLA</Badge.Root>
        </Kpi.Value>
        <Kpi.Meta tone="success" data-testid="meta">
          оплачено
        </Kpi.Meta>
      </Kpi.Root>,
    );
    expect(screen.getByTestId("value")).toHaveAttribute("data-tone", "warning");
    expect(screen.getByTestId("value")).toHaveClass(styles.badged);
    expect(screen.getByTestId("meta")).toHaveAttribute("data-tone", "success");
  });

  it("the change has a row of its own under the value; the media keeps to the bottom", () => {
    expect(cssValue(cssRule(CSS, ".figure"), "display")).toBe("grid");
    expect(cssValue(cssRule(CSS, ".change"), "display")).toBe("flex");
    expect(cssValue(cssRule(CSS, ".media"), "margin-top")).toBe("auto");
    expect(cssValue(cssRule(CSS, ".actions"), "margin-inline-start")).toBe("auto");
    expect(cssValue(cssRule(CSS, ".title"), "padding-inline-end")).toBe(
      "var(--corner-mark-room, 0)",
    );
  });

  it("with asChild the whole card is the link: one tab stop, the parts inside it", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">До</button>
        <Kpi.Root asChild>
          <a href="#invoices">
            <Kpi.Title>Счета к оплате</Kpi.Title>
            <Kpi.Value>37</Kpi.Value>
          </a>
        </Kpi.Root>
      </>,
    );
    const link = screen.getByRole("link", { name: /Счета к оплате\s*37/ });
    expect(link).toHaveAttribute("data-interactive", "true");
    expect(link).toHaveAttribute("data-mark", "true");
    screen.getByRole("button", { name: "До" }).focus();
    await user.tab();
    expect(link).toHaveFocus();
  });

  it("a group is one card: its Kpi.Root are cells, a faint line between them", () => {
    render(
      <Kpi.Group data-testid="group">
        <Kpi.Root data-testid="cell">
          <Kpi.Title>Конверсия</Kpi.Title>
          <Kpi.Value>3,8%</Kpi.Value>
        </Kpi.Root>
        <Kpi.Root>
          <Kpi.Title>Средний чек</Kpi.Title>
          <Kpi.Value>2 450 ₽</Kpi.Value>
        </Kpi.Root>
      </Kpi.Group>,
    );
    const group = screen.getByTestId("group");
    expect(group).toHaveAttribute("data-depth", "1");
    const cell = screen.getByTestId("cell");
    expect(cell).toHaveClass(styles.cell);
    expect(cell).not.toHaveAttribute("data-depth");
    expect(group.querySelectorAll("[data-depth]")).toHaveLength(0);
    expect(cssValue(cssRule(CSS, ".cells > * + *"), "border-inline-start")).toContain(
      "--prime-color-border-faint",
    );
    expect(
      cssValue(cssRule(CSS, ".cells", ["@container (max-width: 22rem)"]), "grid-auto-flow"),
    ).toBe("row");
  });

  it("a Sparkline reading fills the head: the scrubbed point moves the value, the period and the change", () => {
    function Revenue() {
      const reading = useSparkline({
        data: [
          { label: "1 окт", value: 400 },
          { label: "2 окт", value: 500 },
          { label: "3 окт", value: 450 },
        ],
        change: "previous",
      });
      return (
        <Kpi.Root>
          <Kpi.Title>Выручка</Kpi.Title>
          <Kpi.Period data-testid="period">{reading.date}</Kpi.Period>
          <Kpi.Value data-testid="value">{reading.valueText}</Kpi.Value>
          <Kpi.Delta value={reading.change} tone={reading.changeTone} data-testid="delta">
            {reading.changeText}
          </Kpi.Delta>
          <Kpi.Media>
            <Sparkline {...reading.plot} label="Выручка по дням" />
          </Kpi.Media>
        </Kpi.Root>
      );
    }
    render(<Revenue />);
    expect(screen.getByTestId("value")).toHaveTextContent("450");
    expect(screen.getByTestId("period")).toHaveTextContent("3 окт");
    expect(screen.getByTestId("delta")).toHaveTextContent("−10%");
    const slider = screen.getByRole("slider", { name: "Выручка по дням" });
    slider.focus();
    return userEvent.keyboard("{ArrowLeft}").then(() => {
      expect(screen.getByTestId("value")).toHaveTextContent("500");
      expect(screen.getByTestId("period")).toHaveTextContent("2 окт");
      expect(screen.getByTestId("delta")).toHaveTextContent("+25%");
      expect(
        (screen.getByTestId("delta").firstElementChild as HTMLElement).querySelector(
          `.${styles.trend}`,
        ),
      ).not.toHaveAttribute("data-down");
    });
  });
});
