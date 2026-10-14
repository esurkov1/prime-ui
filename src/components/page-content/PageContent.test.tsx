import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import enterMotion from "@/internal/enterMotion.module.css";

import { PageContent } from "./PageContent";

describe("PageContent", () => {
  it("renders title, description, and body", () => {
    render(
      <PageContent.Root>
        <PageContent.Header>
          <PageContent.Title>Заголовок</PageContent.Title>
          <PageContent.Description>Краткое описание страницы.</PageContent.Description>
        </PageContent.Header>
        <PageContent.Body>
          <span>Контент</span>
        </PageContent.Body>
      </PageContent.Root>,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Заголовок");
    expect(screen.getByText("Краткое описание страницы.")).toBeInTheDocument();
    expect(screen.getByText("Контент")).toBeInTheDocument();
  });

  it("sets data-max-width for readable and wide", () => {
    const { rerender, container } = render(
      <PageContent.Root maxWidth="readable">
        <PageContent.Body />
      </PageContent.Root>,
    );

    expect(container.firstChild).toHaveAttribute("data-max-width", "readable");

    rerender(
      <PageContent.Root maxWidth="wide">
        <PageContent.Body />
      </PageContent.Root>,
    );
    expect(container.firstChild).toHaveAttribute("data-max-width", "wide");
  });

  it("does not set data-max-width for full width", () => {
    const { container } = render(
      <PageContent.Root maxWidth="full">
        <PageContent.Body />
      </PageContent.Root>,
    );

    expect(container.firstChild).not.toHaveAttribute("data-max-width");
  });

  it("renders Page as a semantic region", () => {
    render(
      <PageContent.Page aria-label="Doc">
        <PageContent.Header>
          <PageContent.Title>Doc</PageContent.Title>
        </PageContent.Header>
      </PageContent.Page>,
    );

    expect(document.querySelector("section")).toHaveAttribute("aria-label", "Doc");
  });

  it("Section: a region named by its h2, description under it, Actions at the end of the heading", () => {
    render(
      <PageContent.Body>
        <PageContent.Section label="Последние счета" description="За октябрь">
          <PageContent.Actions>
            <a href="#invoices">Все счета</a>
          </PageContent.Actions>
          <p>Таблица</p>
        </PageContent.Section>
      </PageContent.Body>,
    );

    const region = screen.getByRole("region", { name: "Последние счета" });
    const heading = screen.getByRole("heading", { level: 2, name: "Последние счета" });
    expect(region).toContainElement(heading);
    expect(screen.getByText("За октябрь").tagName).toBe("P");
    const link = screen.getByRole("link", { name: "Все счета" });
    expect(heading.parentElement?.parentElement).toContainElement(link);
    expect(screen.getByText("Таблица").parentElement).not.toContainElement(link);
  });

  it("Section: layout aside sets data-layout; stack sets nothing", () => {
    const { rerender } = render(<PageContent.Section label="Компания" layout="aside" />);
    expect(screen.getByRole("region")).toHaveAttribute("data-layout", "aside");
    rerender(<PageContent.Section label="Компания" />);
    expect(screen.getByRole("region")).not.toHaveAttribute("data-layout");
  });

  it("Cell: span defaults to the full row; rows only when more than one", () => {
    render(
      <PageContent.Grid>
        <PageContent.Cell data-testid="full" />
        <PageContent.Cell data-testid="tile" span={3} />
        <PageContent.Cell data-testid="chart" span={8} rows={2} />
      </PageContent.Grid>,
    );

    expect(screen.getByTestId("full")).toHaveAttribute("data-span", "12");
    expect(screen.getByTestId("full")).not.toHaveAttribute("data-rows");
    expect(screen.getByTestId("tile")).toHaveAttribute("data-span", "3");
    expect(screen.getByTestId("chart")).toHaveAttribute("data-rows", "2");
  });

  it("CSS: blocks 24 apart, a section 40 from its neighbours, tiles 16 on both axes", () => {
    const css = readFileSync(join(__dirname, "PageContent.module.css"), "utf8");
    expect(css).toMatch(/\.body \{[^}]*gap: var\(--prime-space-6\)/);
    expect(css).toMatch(
      /\.body > \.section:not\(:first-child\),\n\.body > \.section \+ \* \{\s*margin-block-start: var\(--prime-space-4\);/,
    );
    expect(css).toMatch(
      /\.grid \{[^}]*container: prime-grid \/ inline-size;[^}]*gap: var\(--prime-space-4\)/,
    );
    expect(css).toMatch(/@container prime-grid \(min-width: 30rem\)/);
    expect(css).toMatch(/@container prime-grid \(min-width: 40rem\)/);
    expect(css).toMatch(/@container prime-grid \(min-width: 64rem\)/);
  });

  it("sets data-measure on Description when measure is full", () => {
    render(<PageContent.Description measure="full">Wide lead</PageContent.Description>);

    expect(screen.getByText("Wide lead")).toHaveAttribute("data-measure", "full");
  });

  it("places Actions next to the heading block", () => {
    render(
      <PageContent.Header data-testid="header">
        <PageContent.Title>Projects</PageContent.Title>
        <PageContent.Description>All projects</PageContent.Description>
        <PageContent.Actions>
          <button type="button">New project</button>
        </PageContent.Actions>
      </PageContent.Header>,
    );

    const header = screen.getByTestId("header");
    expect(header).toHaveAttribute("data-has-actions", "true");
    const [heading, actions] = Array.from(header.children);
    expect(heading).toContainElement(screen.getByRole("heading", { level: 1 }));
    expect(heading).not.toContainElement(screen.getByRole("button", { name: "New project" }));
    expect(actions).toContainElement(screen.getByRole("button", { name: "New project" }));
  });

  it("fill marks the root that takes the panel's height", () => {
    const { container } = render(
      <PageContent.Root fill>
        <PageContent.Body />
      </PageContent.Root>,
    );
    expect(container.firstChild).toHaveAttribute("data-fill", "true");
    const css = readFileSync(join(__dirname, "PageContent.module.css"), "utf8");
    expect(css).toMatch(
      /\.root\[data-fill="true"\] > \.body \{\s*flex: 1 1 auto;\s*min-height: 0;/,
    );
  });
});

describe("PageContent.Split", () => {
  /** jsdom has no CSS: a pane is hidden when the narrow layout would hide it. */
  function layout(narrow: boolean) {
    const real = window.getComputedStyle;
    vi.spyOn(window, "getComputedStyle").mockImplementation((element, pseudo) => {
      const style = real(element, pseudo);
      const split = element.closest("[data-testid='split']");
      if (!split || !narrow) return style;
      const open = split.getAttribute("data-open") === "true";
      const pane = element.getAttribute("data-pane");
      const display = (pane === "list" && open) || (pane === "detail" && !open) ? "none" : "flex";
      if (!pane) return style;
      return new Proxy(style, {
        get(target, property) {
          if (property === "display") return display;
          if (property === "getPropertyValue") {
            return (name: string) => (name === "display" ? display : target.getPropertyValue(name));
          }
          const value = Reflect.get(target, property);
          return typeof value === "function" ? value.bind(target) : value;
        },
      });
    });
  }

  afterEach(() => vi.restoreAllMocks());

  function Inbox({ narrow = true }: { narrow?: boolean }) {
    const [chat, setChat] = React.useState<string | null>(null);
    React.useState(() => layout(narrow));
    return (
      <PageContent.Split
        data-testid="split"
        open={chat !== null}
        onOpenChange={(open) => {
          if (!open) setChat(null);
        }}
      >
        <PageContent.List data-pane="list" aria-label="Диалоги">
          <button type="button" onClick={() => setChat("granit")}>
            ООО «Гранит»
          </button>
        </PageContent.List>
        <PageContent.Detail data-pane="detail" aria-label="Переписка">
          <PageContent.BackButton />
          <p>{chat ?? "Выберите диалог"}</p>
        </PageContent.Detail>
      </PageContent.Split>
    );
  }

  it("marks the open detail; the back button closes it", async () => {
    const user = userEvent.setup();
    render(<Inbox />);
    const split = screen.getByTestId("split");
    expect(split).not.toHaveAttribute("data-open");
    await user.click(screen.getByRole("button", { name: "ООО «Гранит»" }));
    expect(split).toHaveAttribute("data-open", "true");
    await user.click(screen.getByRole("button", { name: "Назад к списку" }));
    expect(split).not.toHaveAttribute("data-open");
  });

  it("narrow: focus moves into the detail on open and back to the list item on close", async () => {
    const user = userEvent.setup();
    render(<Inbox />);
    const item = screen.getByRole("button", { name: "ООО «Гранит»" });
    await user.click(item);
    expect(screen.getByLabelText("Переписка")).toHaveFocus();
    expect(screen.getByLabelText("Переписка")).toHaveClass(enterMotion.enterBase);
    await user.keyboard("{Tab}");
    expect(screen.getByRole("button", { name: "Назад к списку" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(item).toHaveFocus();
    expect(screen.getByLabelText("Диалоги")).toHaveClass(enterMotion.enterBase);
  });

  it("wide: both panes stay, nothing moves and focus stays where it is", async () => {
    const user = userEvent.setup();
    render(<Inbox narrow={false} />);
    const item = screen.getByRole("button", { name: "ООО «Гранит»" });
    await user.click(item);
    expect(item).toHaveFocus();
    expect(screen.getByLabelText("Переписка")).not.toHaveClass(enterMotion.enterBase);
  });

  it("parts throw outside a split", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<PageContent.BackButton />)).toThrow(/inside `PageContent.Split`/);
  });

  it("CSS: one pane at a time below 48rem of its own width, the back button only then", () => {
    const css = readFileSync(join(__dirname, "PageContent.module.css"), "utf8");
    expect(css).toMatch(/\.split \{[^}]*container: prime-split \/ inline-size/);
    expect(css).toMatch(
      /\.split:not\(\[data-open="true"\]\) > \.panes > \.detail,\n\.split\[data-open="true"\] > \.panes > \.list \{\s*display: none;/,
    );
    expect(css).toMatch(
      /@container prime-split \(min-width: 48rem\) \{[\s\S]*\.backButton \{\s*display: none;/,
    );
  });
});
