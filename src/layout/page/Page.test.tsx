import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Breadcrumb } from "@/components/breadcrumb/Breadcrumb";
import { Button } from "@/components/button/Button";
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

describe("Page", () => {
  it("renders the title as the one h1, the description and the body", () => {
    render(
      <Page.Root>
        <Page.Header>
          <Page.Title>Заказы</Page.Title>
          <Page.Description>128 в работе</Page.Description>
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

  it("the header follows its place: compact in the bar, the document header in the flow", () => {
    render(
      <Page.Root>
        <Page.TopBar>
          <Page.Header data-testid="bar">
            <Page.Actions>
              <button type="button">Экспорт</button>
            </Page.Actions>
          </Page.Header>
        </Page.TopBar>
        <Page.Header data-testid="flow">
          <Page.Title>Настройки</Page.Title>
        </Page.Header>
      </Page.Root>,
    );
    expect(screen.getByTestId("bar")).toHaveAttribute("data-place", "bar");
    expect(screen.getByTestId("flow")).toHaveAttribute("data-place", "flow");
    expect(screen.getByTestId("flow")).not.toHaveAttribute("data-has-actions");
    expect(screen.getByTestId("bar")).toHaveAttribute("data-has-actions", "true");
  });

  it("header: the path first, then a separator and the title in the bar; actions at the end", () => {
    render(
      <Page.TopBar>
        <Page.Header data-testid="header">
          <Page.Actions>
            <button type="button">Написать</button>
          </Page.Actions>
          <Page.Title>ООО «Север»</Page.Title>
          <Breadcrumb.Root>
            <Breadcrumb.Item href="#clients">Клиенты</Breadcrumb.Item>
          </Breadcrumb.Root>
        </Page.Header>
      </Page.TopBar>,
    );
    const header = screen.getByTestId("header");
    const [heading, actions] = Array.from(header.children);
    const path = screen.getByRole("navigation");
    expect(heading?.firstElementChild).toContainElement(path);
    expect(heading?.querySelector('[role="separator"]')).not.toBeNull();
    expect(heading).toContainElement(screen.getByRole("heading", { level: 1 }));
    expect(actions).toContainElement(screen.getByRole("button", { name: "Написать" }));
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
            <Page.Header>
              <Page.Title>Заказы</Page.Title>
            </Page.Header>
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

  it("Tab follows the reading order: menu, the title row's actions, then the toolbar", async () => {
    render(
      <PhoneShell>
        <Page.Root>
          <Page.TopBar>
            <Page.Header>
              <Page.Title>Сделки</Page.Title>
              <Page.Actions>
                <Button.Root>Создать</Button.Root>
              </Page.Actions>
            </Page.Header>
            <Page.Toolbar>
              <Page.ToolbarView>
                <button type="button">Период</button>
              </Page.ToolbarView>
            </Page.Toolbar>
          </Page.TopBar>
        </Page.Root>
      </PhoneShell>,
    );
    // The closed panel before it is `inert` (jsdom does not skip inert content).
    screen.getByRole("button", { name: "Открыть меню" }).focus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Создать" })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Период" })).toHaveFocus();
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
          <Page.Header>
            <Page.Actions>
              <button type="button">Отчёт</button>
            </Page.Actions>
          </Page.Header>
        </Page.TopBar>
        <Page.Header>
          <Page.Title>Продажи</Page.Title>
          <Page.Description>На 14 октября</Page.Description>
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

  it("a bar without a header gets a title row of its own for the echo", () => {
    stubObserver();
    const { container } = render(
      <Page.Root>
        <Page.TopBar collapse>
          <Page.Toolbar />
        </Page.TopBar>
        <Page.Header>
          <Page.Title>Продажи</Page.Title>
        </Page.Header>
      </Page.Root>,
    );
    expect(container.querySelectorAll('[data-place="bar"]')).toHaveLength(1);
  });

  it("CSS: the echo moves on the movement clock and fades on the fade clock", () => {
    const transition = cssValue(cssRule(CSS, ".echo"), "transition") ?? "";
    expect(transition).toContain("transform var(--prime-motion-duration-fast)");
    expect(transition).toContain("opacity var(--prime-motion-fade-fast)");
  });
});

describe("Page.Actions in the bar", () => {
  const WIDTH = 100;

  /** jsdom has no layout: every action is 100 wide, the header as wide as `header`. */
  function layout(header: number) {
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.dataset.key !== undefined ? WIDTH : 0;
    });
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.getAttribute("data-place") === "bar" ? header : 0;
    });
  }

  afterEach(() => vi.restoreAllMocks());

  function Bar({ onExport }: { onExport?: () => void }) {
    return (
      <Page.TopBar>
        <Page.Header>
          <Page.Title>Заказы</Page.Title>
          <Page.Actions>
            <Button.Root variant="soft" tone="neutral" onClick={onExport}>
              Экспорт
            </Button.Root>
            <Button.Root variant="soft" tone="neutral">
              Печать
            </Button.Root>
            <Button.Root>Новый заказ</Button.Root>
          </Page.Actions>
        </Page.Header>
      </Page.TopBar>
    );
  }

  it("all actions stay while the row has room", () => {
    layout(2000);
    render(<Bar />);
    expect(screen.queryByRole("button", { name: "Ещё действия" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Экспорт" })).toBeVisible();
  });

  it("trailing secondary actions fold into «⋯»; the primary stays; the menu runs their click", async () => {
    const user = userEvent.setup();
    const onExport = vi.fn();
    // Room for the title (144) and two actions: the primary and «⋯».
    layout(144 + 12 + 100 + 8 + 40);
    render(<Bar onExport={onExport} />);
    const more = screen.getByRole("button", { name: "Ещё действия" });
    expect(screen.getByRole("button", { name: "Новый заказ" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Экспорт" })).not.toBeInTheDocument();
    more.focus();
    await user.keyboard("{Enter}");
    const items = screen.getAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual(["Экспорт", "Печать"]);
    await user.click(items[0] as HTMLElement);
    expect(onExport).toHaveBeenCalledTimes(1);
  });

  it("in the flow actions never fold", () => {
    layout(10);
    render(
      <Page.Header>
        <Page.Actions>
          <Button.Root variant="soft">Экспорт</Button.Root>
          <Button.Root>Создать</Button.Root>
        </Page.Actions>
      </Page.Header>,
    );
    expect(screen.queryByRole("button", { name: "Ещё действия" })).not.toBeInTheDocument();
  });
});

describe("Page.Toolbar", () => {
  it("renders the slots in the reading order whatever the JSX order", () => {
    render(
      <Page.Toolbar>
        <Page.ToolbarChips data-testid="chips">Фильтры</Page.ToolbarChips>
        <Page.ToolbarActions data-testid="actions" />
        <Page.ToolbarView data-testid="view" />
        <Page.ToolbarTools data-testid="tools" />
        <Page.ToolbarSections data-testid="sections" />
      </Page.Toolbar>,
    );
    const ids = ["tools", "sections", "view", "actions", "chips"].map((id) =>
      screen.getByTestId(id),
    );
    for (let i = 1; i < ids.length; i++) {
      expect(
        (ids[i - 1] as HTMLElement).compareDocumentPosition(ids[i] as HTMLElement) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    }
  });

  it("is a group when named, a plain div otherwise", () => {
    const { rerender, container } = render(<Page.Toolbar aria-label="Заказы" />);
    expect(screen.getByRole("group", { name: "Заказы" })).toBeInTheDocument();
    rerender(<Page.Toolbar />);
    expect(container.firstElementChild).not.toHaveAttribute("role");
  });

  it("puts the chips row under the bar, whatever its place in JSX", () => {
    const { container } = render(
      <Page.Toolbar>
        <Page.ToolbarChips data-testid="chips" />
        <Page.ToolbarTools data-testid="tools" />
      </Page.Toolbar>,
    );
    const layout = container.firstElementChild?.firstElementChild as HTMLElement;
    const bar = layout.firstElementChild as HTMLElement;
    expect(bar).toContainElement(screen.getByTestId("tools"));
    expect(bar).not.toContainElement(screen.getByTestId("chips"));
    expect(layout.lastElementChild).toBe(screen.getByTestId("chips"));
  });

  it("CSS: one row from 56rem of its own width", () => {
    expect(cssValue(cssRule(CSS, ".toolbar"), "container")).toBe("prime-page-tools / inline-size");
    expect(
      cssRules(CSS).some(
        (rule) => rule.parents[0] === "@container prime-page-tools (min-width: 56rem)",
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
