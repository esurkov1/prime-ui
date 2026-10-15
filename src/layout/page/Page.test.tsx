import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Breadcrumb } from "@/components/breadcrumb/Breadcrumb";
import { Button } from "@/components/button/Button";
import { SegmentedControl } from "@/components/segmented-control/SegmentedControl";
import { Icon } from "@/icons";
import enterMotion from "@/internal/enterMotion.module.css";
import { cssRule, cssRules, cssValue } from "@/test/css";

import { AppShell } from "../app-shell/AppShell";
import { Sidebar } from "../sidebar/Sidebar";
import { Page } from "./Page";

const CSS = "src/layout/page/Page.module.css";

/** A shell whose Sidebar is an off-canvas panel (a phone), with the page in main. */
function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell.Root>
      <AppShell.Nav>
        <Sidebar.Root offCanvas="always">
          <Sidebar.Item href="#orders">Заказы</Sidebar.Item>
        </Sidebar.Root>
      </AppShell.Nav>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell.Root>
  );
}

/** Each element follows the one before it in the document. */
function expectInOrder(elements: HTMLElement[]) {
  for (let i = 1; i < elements.length; i++) {
    expect(
      (elements[i - 1] as HTMLElement).compareDocumentPosition(elements[i] as HTMLElement) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  }
}

describe("Page", () => {
  it("renders the title as the one h1, the description and the body", () => {
    render(
      <Page.Root>
        <Page.Header>
          <Page.Heading>
            <Page.Title>Заказы</Page.Title>
            <Page.Description>128 в работе</Page.Description>
          </Page.Heading>
        </Page.Header>
        <Page.Body>
          <span>Контент</span>
        </Page.Body>
      </Page.Root>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Заказы");
    expect(screen.getByText("128 в работе").tagName).toBe("P");
    expect(screen.getByText("Контент")).toBeInTheDocument();
  });

  it("sets data-max-width for readable and wide only; a named page is a region", () => {
    const { rerender, container } = render(<Page.Root maxWidth="readable" />);
    expect(container.firstChild).toHaveAttribute("data-max-width", "readable");
    rerender(<Page.Root maxWidth="wide" />);
    expect(container.firstChild).toHaveAttribute("data-max-width", "wide");
    rerender(<Page.Root />);
    expect(container.firstChild).not.toHaveAttribute("data-max-width");
    expect(container.firstChild).not.toHaveAttribute("role");
    rerender(<Page.Root aria-label="Заказы" />);
    expect(screen.getByRole("region", { name: "Заказы" })).toBeInTheDocument();
  });

  it("the heading follows its place: in the bar, or in the flow under Page.Header", () => {
    render(
      <Page.Root>
        <Page.TopBar>
          <Page.Heading data-testid="bar">
            <Breadcrumb.Root>
              <Breadcrumb.Item href="#settings">Настройки</Breadcrumb.Item>
            </Breadcrumb.Root>
          </Page.Heading>
        </Page.TopBar>
        <Page.Header data-testid="header">
          <Page.Heading data-testid="flow">
            <Page.Title>Уведомления</Page.Title>
          </Page.Heading>
        </Page.Header>
      </Page.Root>,
    );
    expect(screen.getByTestId("bar")).toHaveAttribute("data-place", "bar");
    expect(screen.getByTestId("flow")).toHaveAttribute("data-place", "flow");
    expect(screen.getByTestId("header").closest("header")).toBeNull();
    expect(screen.getByTestId("header")).not.toHaveAttribute("data-has-actions");
  });

  it("Header in the flow: the heading, then its actions, whatever the JSX order", () => {
    render(
      <Page.Header data-testid="header">
        <Page.Actions>
          <Button.Root>Сохранить</Button.Root>
        </Page.Actions>
        <Page.Heading>
          <Page.Title>Уведомления</Page.Title>
        </Page.Heading>
      </Page.Header>,
    );
    const header = screen.getByTestId("header");
    expect(header).toHaveAttribute("data-has-actions", "true");
    expectInOrder([
      screen.getByRole("heading", { level: 1 }),
      screen.getByRole("button", { name: "Сохранить" }),
    ]);
  });

  it("in the bar the title is the path's last level: path › title with one chevron", () => {
    render(
      <Page.TopBar>
        <Page.Heading data-testid="heading">
          <Page.Title>ООО «Север»</Page.Title>
          <Page.Description>7 сделок</Page.Description>
          <Breadcrumb.Root>
            <Breadcrumb.Item href="#clients">Клиенты</Breadcrumb.Item>
          </Breadcrumb.Root>
        </Page.Heading>
      </Page.TopBar>,
    );
    const heading = screen.getByTestId("heading");
    const line = heading.firstElementChild as HTMLElement;
    const path = screen.getByRole("navigation");
    const title = screen.getByRole("heading", { level: 1 });
    expect(line).toContainElement(path);
    expect(line).toContainElement(title);
    expectInOrder([path, title]);
    const chevrons = line.querySelectorAll(':scope > [aria-hidden="true"]');
    expect(chevrons).toHaveLength(1);
    expectInOrder([path, chevrons[0] as HTMLElement, title]);
    // The description stands under the whole line.
    expect(line).not.toContainElement(screen.getByText("7 сделок"));
    expect(heading.lastElementChild).toBe(screen.getByText("7 сделок"));
  });

  it("no chevron without a path, or without a title", () => {
    const { container, rerender } = render(
      <Page.TopBar>
        <Page.Heading>
          <Page.Title>Заказы</Page.Title>
        </Page.Heading>
      </Page.TopBar>,
    );
    const chevron = () => container.querySelector('[data-place="bar"] [aria-hidden="true"]');
    expect(chevron()).toBeNull();
    rerender(
      <Page.TopBar>
        <Page.Heading>
          <Breadcrumb.Root>
            <Breadcrumb.Item href="#settings">Настройки</Breadcrumb.Item>
          </Breadcrumb.Root>
        </Page.Heading>
      </Page.TopBar>,
    );
    expect(chevron()).toBeNull();
  });

  it("the top bar is a sticky <header> in main", () => {
    render(
      <PhoneShell>
        <Page.Root>
          <Page.TopBar data-testid="bar" />
        </Page.Root>
      </PhoneShell>,
    );
    const bar = screen.getByTestId("bar");
    expect(bar.tagName).toBe("HEADER");
    expect(bar).toHaveAttribute("data-sticky", "true");
  });

  it("draws the menu button while the shell's Sidebar is off-canvas: Enter opens the panel", async () => {
    const user = userEvent.setup();
    render(
      <PhoneShell>
        <Page.Root>
          <Page.TopBar>
            <Page.Heading>
              <Page.Title>Заказы</Page.Title>
            </Page.Heading>
          </Page.TopBar>
        </Page.Root>
      </PhoneShell>,
    );
    const menu = screen.getByRole("button", { name: "Открыть меню" });
    const nav = screen.getByRole("navigation", { hidden: true });
    expect(menu).toHaveAttribute("aria-expanded", "false");
    expect(menu).toHaveAttribute("aria-controls", nav.id);
    menu.focus();
    await user.keyboard("{Enter}");
    expect(nav.parentElement).toHaveAttribute("data-state", "open");
    expect(menu).toHaveAttribute("aria-expanded", "true");
  });

  it("Space on the menu button opens the panel too; labels rename it", async () => {
    const user = userEvent.setup();
    render(
      <PhoneShell>
        <Page.Root labels={{ menu: "Навигация" }}>
          <Page.TopBar />
        </Page.Root>
      </PhoneShell>,
    );
    const menu = screen.getByRole("button", { name: "Навигация" });
    menu.focus();
    await user.keyboard(" ");
    expect(menu).toHaveAttribute("aria-expanded", "true");
  });

  it("no menu button while the rail is on screen, nor outside a shell", () => {
    const { rerender } = render(
      <AppShell.Root>
        <AppShell.Nav>
          <Sidebar.Root offCanvas="never">
            <Sidebar.Item>Обзор</Sidebar.Item>
          </Sidebar.Root>
        </AppShell.Nav>
        <AppShell.Main>
          <Page.Root>
            <Page.TopBar />
          </Page.Root>
        </AppShell.Main>
      </AppShell.Root>,
    );
    expect(screen.queryByRole("button", { name: "Открыть меню" })).not.toBeInTheDocument();
    rerender(<Page.TopBar />);
    expect(screen.queryByRole("button", { name: "Открыть меню" })).not.toBeInTheDocument();
  });

  it("renders the groups as Heading, Tools, Actions, Chips whatever the JSX order", () => {
    render(
      <Page.TopBar>
        <Page.Chips data-testid="chips">Фильтры</Page.Chips>
        <Page.Actions data-testid="actions" />
        <Page.Tools data-testid="tools" />
        <Page.Heading data-testid="heading">
          <Page.Title>Сделки</Page.Title>
        </Page.Heading>
      </Page.TopBar>,
    );
    expectInOrder(["heading", "tools", "actions", "chips"].map((id) => screen.getByTestId(id)));
  });

  it("Tab follows the reading order: menu, tools, then the page's buttons", async () => {
    render(
      <PhoneShell>
        <Page.Root>
          <Page.TopBar>
            <Page.Actions>
              <Button.Root>Создать</Button.Root>
            </Page.Actions>
            <Page.Tools>
              <button type="button">Период</button>
            </Page.Tools>
            <Page.Heading>
              <Page.Title>Сделки</Page.Title>
            </Page.Heading>
          </Page.TopBar>
        </Page.Root>
      </PhoneShell>,
    );
    // The closed panel before it is `inert` (jsdom does not skip inert content).
    screen.getByRole("button", { name: "Открыть меню" }).focus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Период" })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Создать" })).toHaveFocus();
  });
});

describe("Page.Tools", () => {
  it("wraps each control in its own cell and is a group when named", () => {
    const { rerender, container } = render(
      <Page.Tools aria-label="Заказы">
        <button type="button">Фильтр</button>
        <button type="button">Период</button>
      </Page.Tools>,
    );
    const group = screen.getByRole("group", { name: "Заказы" });
    expect(group.children).toHaveLength(2);
    for (const cell of Array.from(group.children)) {
      expect(cell.children).toHaveLength(1);
      expect(cell.firstElementChild?.tagName).toBe("BUTTON");
    }
    rerender(<Page.Tools />);
    expect(container.firstElementChild).not.toHaveAttribute("role");
  });

  it("gives a SegmentedControl fullWidth; an explicit fullWidth={false} keeps it", () => {
    render(
      <Page.Tools>
        <SegmentedControl.Root defaultValue="all" aria-label="Раздел">
          <SegmentedControl.Item value="all">Все</SegmentedControl.Item>
          <SegmentedControl.Item value="mine">Мои</SegmentedControl.Item>
        </SegmentedControl.Root>
        <SegmentedControl.Root defaultValue="board" fullWidth={false} aria-label="Вид">
          <SegmentedControl.Item value="board">Доска</SegmentedControl.Item>
          <SegmentedControl.Item value="list">Список</SegmentedControl.Item>
        </SegmentedControl.Root>
      </Page.Tools>,
    );
    expect(screen.getByRole("radiogroup", { name: "Раздел" })).toHaveAttribute(
      "data-full-width",
      "true",
    );
    expect(screen.getByRole("radiogroup", { name: "Вид" })).not.toHaveAttribute("data-full-width");
  });

  it("chips take no line while empty", () => {
    expect(cssValue(cssRule(CSS, ".chips:empty"), "display")).toBe("none");
  });
});

describe("Page.TopBar collapse", () => {
  type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;
  let observed: { callback: Callback; target: Element | null }[] = [];

  afterEach(() => {
    observed = [];
    vi.unstubAllGlobals();
  });

  function stubObserver() {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        entry: { callback: Callback; target: Element | null };
        constructor(callback: Callback) {
          this.entry = { callback, target: null };
          observed.push(this.entry);
        }
        observe(target: Element) {
          this.entry.target = target;
        }
        disconnect() {}
      },
    );
  }

  function scrolled(away: boolean) {
    const entry = observed.at(-1);
    act(() =>
      entry?.callback([
        {
          isIntersecting: !away,
          boundingClientRect: { top: away ? -40 : 80 } as DOMRectReadOnly,
          rootBounds: { top: 0 } as DOMRectReadOnly,
        },
      ]),
    );
  }

  function Overview() {
    return (
      <Page.Root>
        <Page.TopBar collapse data-testid="bar">
          <Page.Actions>
            <button type="button">Отчёт</button>
          </Page.Actions>
        </Page.TopBar>
        <Page.Header>
          <Page.Heading>
            <Page.Title>Продажи</Page.Title>
            <Page.Description>На 14 октября</Page.Description>
          </Page.Heading>
        </Page.Header>
      </Page.Root>
    );
  }

  it("observes the flow title and repeats it in the bar once it scrolls away", () => {
    stubObserver();
    render(<Overview />);
    const bar = screen.getByTestId("bar");
    expect(observed.at(-1)?.target).toBe(screen.getByRole("heading", { level: 1 }));
    expect(bar).toHaveAttribute("data-collapsed", "false");
    scrolled(true);
    expect(bar).toHaveAttribute("data-collapsed", "true");
    scrolled(false);
    expect(bar).toHaveAttribute("data-collapsed", "false");
  });

  it("the echo is visual only: one h1, the copy aria-hidden and inert", () => {
    stubObserver();
    const { container } = render(<Overview />);
    scrolled(true);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    const echo = container.querySelector('[aria-hidden="true"][inert]');
    expect(echo).toHaveTextContent("ПродажиНа 14 октября");
    expect(echo).toHaveAttribute("data-visible", "true");
  });

  it("a bar without a heading gets one of its own for the echo", () => {
    stubObserver();
    const { container } = render(
      <Page.Root>
        <Page.TopBar collapse>
          <Page.Tools />
        </Page.TopBar>
        <Page.Header>
          <Page.Heading>
            <Page.Title>Продажи</Page.Title>
          </Page.Heading>
        </Page.Header>
      </Page.Root>,
    );
    expect(container.querySelectorAll('[data-place="bar"]')).toHaveLength(1);
    const echo = container.querySelector('[aria-hidden="true"][inert]') as HTMLElement;
    expect(echo).toHaveTextContent("Продажи");
    expect(echo.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it("after a path the echo is the path's last level, so the Breadcrumb folds for it", () => {
    stubObserver();
    render(
      <Page.Root>
        <Page.TopBar collapse>
          <Page.Heading>
            <Breadcrumb.Root>
              <Breadcrumb.Item href="#workspace">Прайм Софт</Breadcrumb.Item>
            </Breadcrumb.Root>
          </Page.Heading>
        </Page.TopBar>
        <Page.Header>
          <Page.Heading>
            <Page.Title>Продажи</Page.Title>
          </Page.Heading>
        </Page.Header>
      </Page.Root>,
    );
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("data-collapsible", "false");
    scrolled(true);
    // The title joins the path: two levels, so the path can fold; the level is visual only.
    expect(nav).toHaveAttribute("data-collapsible", "true");
    const level = nav.querySelector("li:last-child") as HTMLElement;
    expect(level).toHaveTextContent("Продажи");
    expect(level).toHaveAttribute("aria-hidden", "true");
    expect(level).toHaveAttribute("inert");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    scrolled(false);
    expect(nav.querySelector("li:last-child")).toHaveTextContent("Прайм Софт");
  });

  it("a path that already ends at the page's name (however spaced) gets no echo of it", () => {
    stubObserver();
    render(
      <Page.Root>
        <Page.TopBar collapse>
          <Page.Heading>
            <Breadcrumb.Root>
              <Breadcrumb.Item href="#actions">Действия</Breadcrumb.Item>
              <Breadcrumb.Item current>Link Button</Breadcrumb.Item>
            </Breadcrumb.Root>
          </Page.Heading>
        </Page.TopBar>
        <Page.Header>
          <Page.Heading>
            <Page.Title>LinkButton</Page.Title>
          </Page.Heading>
        </Page.Header>
      </Page.Root>,
    );
    scrolled(true);
    const nav = screen.getByRole("navigation");
    expect(nav.querySelectorAll('[aria-hidden="true"][inert]')).toHaveLength(0);
    expect(nav.querySelector("li:last-child")).toHaveTextContent(/^Link Button$/);
  });

  it("CSS: the echo moves on the movement clock and fades on the fade clock", () => {
    const transition = cssValue(cssRule(CSS, ".echo"), "transition") ?? "";
    expect(transition).toContain("transform var(--prime-motion-duration-fast)");
    expect(transition).toContain("opacity var(--prime-motion-fade-fast)");
  });
});

describe("Page.TopBar plan", () => {
  /** Natural widths jsdom cannot lay out: the heading, the tools and each button by its label. */
  const HEADING = 200;
  const TOOLS = 300;
  const BUTTONS: Record<string, number> = { Экспорт: 100, Печать: 100, "Новый заказ": 120 };
  const SQUARE = 40;
  let available = 2000;
  let resize: (() => void)[] = [];

  function layout(width: number) {
    available = width;
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      const testId = this.dataset.testid;
      const width =
        testId === "heading"
          ? HEADING
          : testId === "tools"
            ? TOOLS
            : this.dataset.role
              ? (BUTTONS[this.textContent ?? ""] ?? 0)
              : 0;
      return { width, height: SQUARE } as DOMRect;
    });
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.dataset.role ? SQUARE : 0;
    });
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.firstElementChild?.hasAttribute("data-plan") ? available : 0;
    });
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: () => void) {
          resize.push(callback);
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
  }

  /** The bar's room changes: the plan is re-chosen from the widths it measured. */
  function resizeTo(width: number) {
    available = width;
    act(() => {
      for (const callback of resize) callback();
    });
  }

  afterEach(() => {
    resize = [];
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  function Bar({ onExport }: { onExport?: () => void }) {
    return (
      <Page.TopBar>
        <Page.Heading data-testid="heading">
          <Page.Title>Заказы</Page.Title>
        </Page.Heading>
        <Page.Tools data-testid="tools">
          <button type="button">Период</button>
        </Page.Tools>
        <Page.Actions>
          <Button.Root variant="soft" tone="neutral" onClick={onExport}>
            <Button.Icon>
              <Icon name="action.download" />
            </Button.Icon>
            Экспорт
          </Button.Root>
          <Button.Root variant="soft" tone="neutral">
            <Button.Icon>
              <Icon name="action.refresh" />
            </Button.Icon>
            Печать
          </Button.Root>
          <Button.Root>
            <Button.Icon>
              <Icon name="action.add" />
            </Button.Icon>
            Новый заказ
          </Button.Root>
        </Page.Actions>
      </Page.TopBar>
    );
  }

  const plan = (container: HTMLElement) =>
    container.querySelector("[data-plan]")?.getAttribute("data-plan");
  /** The wrapper of a bar button: where the bar marks it icon-only or folds it. */
  const cell = (name: string) =>
    screen.getByRole("button", { name, hidden: true }).closest("[data-role]") as HTMLElement;

  it("steps one → below → icons-secondary → icons → fold as the room shrinks", () => {
    // Full: 100 + 100 + 120; icons of the secondary: 40 + 40 + 120; all icons: 120; fold: 80.
    layout(1000);
    const { container } = render(<Bar />);
    expect(plan(container)).toBe("one");
    resizeTo(600);
    expect(plan(container)).toBe("below");
    resizeTo(450);
    expect(plan(container)).toBe("icons-secondary");
    resizeTo(350);
    expect(plan(container)).toBe("icons");
    resizeTo(250);
    expect(plan(container)).toBe("fold");
    resizeTo(1000);
    expect(plan(container)).toBe("one");
  });

  it("collapses the secondary buttons first, then the primary; each keeps its name", () => {
    layout(450);
    const { container } = render(<Bar />);
    expect(plan(container)).toBe("icons-secondary");
    expect(cell("Экспорт")).toHaveAttribute("data-button-label", "icon");
    expect(cell("Печать")).toHaveAttribute("data-button-label", "icon");
    expect(cell("Новый заказ")).not.toHaveAttribute("data-button-label");
    resizeTo(350);
    expect(cell("Новый заказ")).toHaveAttribute("data-button-label", "icon");
    for (const name of ["Экспорт", "Печать", "Новый заказ"]) {
      expect(screen.getByRole("button", { name })).toBeVisible();
    }
  });

  it("a button without an icon keeps its label; anything else is never touched", () => {
    layout(10);
    render(
      <Page.TopBar>
        <Page.Actions>
          <a href="#help">Справка</a>
          <Button.Root>Создать</Button.Root>
        </Page.Actions>
      </Page.TopBar>,
    );
    expect(cell("Создать")).not.toHaveAttribute("data-button-label");
    expect(screen.getByRole("link", { name: "Справка" }).parentElement).toHaveAttribute(
      "data-role",
      "other",
    );
    expect(screen.queryByRole("button", { name: "Ещё действия" })).not.toBeInTheDocument();
  });

  it("all buttons stay while the row has room", () => {
    layout(2000);
    render(<Bar />);
    expect(screen.queryByRole("button", { name: "Ещё действия" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Экспорт" })).toBeVisible();
  });

  it("fold: the secondary buttons go into «⋯» (Enter opens it), the primary stays; the menu runs their click", async () => {
    const user = userEvent.setup();
    const onExport = vi.fn();
    layout(250);
    render(<Bar onExport={onExport} />);
    const more = screen.getByRole("button", { name: "Ещё действия" });
    expect(screen.getByRole("button", { name: "Новый заказ" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Экспорт" })).not.toBeInTheDocument();
    expect(cell("Экспорт")).toHaveAttribute("hidden");
    more.focus();
    await user.keyboard("{Enter}");
    const items = screen.getAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual(["Экспорт", "Печать"]);
    await user.click(items[0] as HTMLElement);
    expect(onExport).toHaveBeenCalledTimes(1);
  });

  it("Space opens «⋯» too; labels rename it", async () => {
    const user = userEvent.setup();
    layout(250);
    render(
      <Page.Root labels={{ more: "Действия" }}>
        <Bar />
      </Page.Root>,
    );
    const more = screen.getByRole("button", { name: "Действия" });
    more.focus();
    await user.keyboard(" ");
    expect(screen.getAllByRole("menuitem")).toHaveLength(2);
  });

  it("the primary never folds, however short the row", () => {
    layout(0);
    render(<Bar />);
    expect(screen.getByRole("button", { name: "Новый заказ" })).toBeVisible();
    expect(cell("Новый заказ")).not.toHaveAttribute("hidden");
  });

  it("in the flow actions never collapse or fold", () => {
    layout(10);
    render(
      <Page.Header>
        <Page.Actions>
          <Button.Root variant="soft">
            <Button.Icon>
              <Icon name="action.download" />
            </Button.Icon>
            Экспорт
          </Button.Root>
          <Button.Root>Создать</Button.Root>
        </Page.Actions>
      </Page.Header>,
    );
    expect(screen.queryByRole("button", { name: "Ещё действия" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Экспорт" }).closest("[data-button-label]")).toBe(
      null,
    );
  });

  it("CSS: the plan places the groups; only the heading's column gives", () => {
    expect(cssValue(cssRule(CSS, ".row"), "grid-template-columns")).toBe(
      "minmax(0, 1fr) auto auto",
    );
    expect(cssValue(cssRule(CSS, '.row:not([data-plan="one"]) > .tools'), "grid-area")).toBe(
      "2 / 1 / 3 / -1",
    );
    // A plan past `one`, or a row without tools, has no tools track: no empty column, no gap.
    expect(
      cssRules(CSS).some(
        (rule) =>
          rule.selector.includes('.row:not([data-plan="one"])') &&
          rule.selector.includes(".row:not(:has(> .tools))") &&
          cssValue(rule, "grid-template-columns") === "minmax(0, 1fr) auto",
      ),
    ).toBe(true);
  });
});

describe("Page body", () => {
  it("Section: a region named by its h2, description under it, Actions at the end of the heading", () => {
    render(
      <Page.Body>
        <Page.Section label="Последние счета" description="За октябрь">
          <Page.Actions>
            <a href="#invoices">Все счета</a>
          </Page.Actions>
          <p>Таблица</p>
        </Page.Section>
      </Page.Body>,
    );
    const region = screen.getByRole("region", { name: "Последние счета" });
    const heading = screen.getByRole("heading", { level: 2, name: "Последние счета" });
    expect(region).toContainElement(heading);
    const link = screen.getByRole("link", { name: "Все счета" });
    expect(heading.parentElement?.parentElement).toContainElement(link);
    expect(screen.getByText("Таблица").parentElement).not.toContainElement(link);
  });

  it("Section: layout aside sets data-layout; stack sets nothing", () => {
    const { rerender } = render(<Page.Section label="Компания" layout="aside" />);
    expect(screen.getByRole("region")).toHaveAttribute("data-layout", "aside");
    rerender(<Page.Section label="Компания" />);
    expect(screen.getByRole("region")).not.toHaveAttribute("data-layout");
  });

  it("Cell: span defaults to the full row; rows only when more than one", () => {
    render(
      <Page.Grid>
        <Page.Cell data-testid="full" />
        <Page.Cell data-testid="chart" span={8} rows={2} />
      </Page.Grid>,
    );
    expect(screen.getByTestId("full")).toHaveAttribute("data-span", "12");
    expect(screen.getByTestId("full")).not.toHaveAttribute("data-rows");
    expect(screen.getByTestId("chart")).toHaveAttribute("data-rows", "2");
  });

  it("CSS: blocks 24 apart, a section 40 from its neighbours, tiles 16 on both axes", () => {
    expect(cssValue(cssRule(CSS, ".body"), "gap")).toBe("var(--prime-space-6)");
    expect(
      cssValue(
        cssRule(CSS, ".body > .section:not(:first-child), .body > .section + *"),
        "margin-block-start",
      ),
    ).toBe("var(--prime-space-4)");
    const grid = cssRule(CSS, ".grid");
    expect(cssValue(grid, "container")).toBe("prime-grid / inline-size");
    expect(cssValue(grid, "gap")).toBe("var(--prime-space-4)");
  });

  it("CSS: the page takes its air from the host and resets it for what it holds", () => {
    const root = cssRule(CSS, ".root");
    expect(cssValue(root, "--page-inset")).toBe("var(--page-gutter, var(--prime-space-0))");
    expect(cssValue(root, "padding-inline")).toBe("var(--page-inset)");
    expect(cssValue(cssRule(CSS, ".root > *"), "--page-gutter")).toBe("initial");
  });

  it("fill marks the root that takes the panel's height", () => {
    const { container } = render(
      <Page.Root fill>
        <Page.Body />
      </Page.Root>,
    );
    expect(container.firstChild).toHaveAttribute("data-fill", "true");
  });
});

describe("Page.Split", () => {
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
      <Page.Split
        data-testid="split"
        open={chat !== null}
        onOpenChange={(open) => {
          if (!open) setChat(null);
        }}
      >
        <Page.List data-pane="list" aria-label="Диалоги">
          <button type="button" onClick={() => setChat("granit")}>
            ООО «Гранит»
          </button>
        </Page.List>
        <Page.Detail data-pane="detail" aria-label="Переписка">
          <Page.BackButton />
          <p>{chat ?? "Выберите диалог"}</p>
        </Page.Detail>
      </Page.Split>
    );
  }

  it("narrow: focus moves into the detail on open and back to the list item on close", async () => {
    const user = userEvent.setup();
    render(<Inbox />);
    const item = screen.getByRole("button", { name: "ООО «Гранит»" });
    await user.click(item);
    expect(screen.getByTestId("split")).toHaveAttribute("data-open", "true");
    expect(screen.getByLabelText("Переписка")).toHaveFocus();
    expect(screen.getByLabelText("Переписка")).toHaveClass(enterMotion.enterBase);
    await user.keyboard("{Tab}");
    expect(screen.getByRole("button", { name: "Назад к списку" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(item).toHaveFocus();
    expect(screen.getByTestId("split")).not.toHaveAttribute("data-open");
    await user.keyboard("{Enter}");
    await user.keyboard("{Tab}");
    await user.keyboard(" ");
    expect(screen.getByTestId("split")).not.toHaveAttribute("data-open");
    expect(item).toHaveFocus();
  });

  it("wide: both panes stay, nothing moves and focus stays where it is", async () => {
    const user = userEvent.setup();
    render(<Inbox narrow={false} />);
    const item = screen.getByRole("button", { name: "ООО «Гранит»" });
    await user.click(item);
    expect(item).toHaveFocus();
    expect(screen.getByLabelText("Переписка")).not.toHaveClass(enterMotion.enterBase);
  });

  it("panes throw outside a split", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Page.BackButton />)).toThrow(/inside `Page.Split`/);
  });
});
