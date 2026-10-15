import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { cssRule, cssValue } from "@/test/css";

import { Card } from "./Card";

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
    // The data enters with the region swap's fade-in.
    expect(value.className).toMatch(/swapIn/);
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
    expect(screen.getByTestId("value").className).not.toMatch(/swapIn/);
  });
});
