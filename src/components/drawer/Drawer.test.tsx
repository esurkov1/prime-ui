import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { Avatar } from "@/components/avatar/Avatar";
import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { SegmentedControl } from "@/components/segmented-control/SegmentedControl";
import { Tabs } from "@/components/tabs/Tabs";
import { Thumbnail } from "@/components/thumbnail/Thumbnail";
import { Tooltip } from "@/components/tooltip/Tooltip";
import enterMotion from "@/internal/enterMotion.module.css";
import { swipe } from "@/test/mobile";
import { describeOverlayConformance } from "@/test/overlayConformance";

import { Drawer, type DrawerContentProps, type DrawerRootProps } from "./Drawer";

/** The scrim: the sibling before the (topmost) drawer panel. */
function drawerScrim() {
  const dialogs = screen.getAllByRole("dialog");
  return dialogs[dialogs.length - 1]?.previousElementSibling as HTMLElement;
}

/** A scrim dismiss is a full click that starts and ends outside the panel. */
function clickScrim(scrim: HTMLElement) {
  fireEvent.pointerDown(scrim);
  fireEvent.click(scrim);
}

function BasicDrawer({
  side,
  size,
  ...rootProps
}: Omit<DrawerRootProps, "children"> & Pick<DrawerContentProps, "side" | "size">) {
  return (
    <Drawer.Root {...rootProps}>
      <Drawer.Trigger>
        <Button.Root>Open</Button.Root>
      </Drawer.Trigger>
      <Drawer.Content side={side} size={size}>
        <Drawer.Header>
          <Drawer.Icon tone="accent">
            <svg />
          </Drawer.Icon>
          <Drawer.Title>Drawer title</Drawer.Title>
          <Drawer.Description>Drawer description</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <p>Body content</p>
          <Button.Root>Focusable inside</Button.Root>
        </Drawer.Body>
        <Drawer.Footer data-testid="footer">
          <Drawer.Close>
            <Button.Root variant="outline" tone="neutral">
              Cancel
            </Button.Root>
          </Drawer.Close>
          <Button.Root>Confirm</Button.Root>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
}

function openDrawer() {
  fireEvent.click(screen.getByRole("button", { name: "Open" }));
}

async function expectClosed() {
  await waitFor(() => {
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
}

describe("Drawer", () => {
  it("Tab and Shift+Tab cycle inside the open drawer", async () => {
    const user = userEvent.setup();
    render(<BasicDrawer defaultOpen />);
    const close = screen.getByRole("button", { name: "Закрыть" });
    const confirm = screen.getByRole("button", { name: "Confirm" });
    confirm.focus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(confirm).toHaveFocus();
  });

  it("stacks the blocks of a tab panel in the body; a panel outside a dialog stays plain", () => {
    render(
      <>
        <Tabs.Root defaultValue="charts">
          <Tabs.List aria-label="Снаружи">
            <Tabs.Item value="charts">Снаружи</Tabs.Item>
          </Tabs.List>
          <Tabs.Panel value="charts">Вне диалога</Tabs.Panel>
        </Tabs.Root>
        <Drawer.Root defaultOpen>
          <Drawer.Content>
            <Tabs.Root defaultValue="analytics">
              <Drawer.Header>
                <Drawer.Title>Кресло «Орион»</Drawer.Title>
                <Tabs.List aria-label="Модель">
                  <Tabs.Item value="analytics">Аналитика</Tabs.Item>
                </Tabs.List>
              </Drawer.Header>
              <Drawer.Body>
                <Tabs.Panel value="analytics">
                  <div>Продажи</div>
                  <div>Возвраты</div>
                </Tabs.Panel>
              </Drawer.Body>
            </Tabs.Root>
          </Drawer.Content>
        </Drawer.Root>
      </>,
    );
    expect(screen.getByText("Вне диалога")).not.toHaveAttribute("data-stack");
    expect(screen.getByText("Продажи").parentElement).toHaveAttribute("data-stack", "true");
  });

  it("opens from Trigger", () => {
    render(<BasicDrawer />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    openDrawer();

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("data-state", "open");
    expect(dialog).toHaveAttribute("tabindex", "-1");
  });

  it("labels the dialog from Title and Description", () => {
    render(<BasicDrawer defaultOpen />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute(
      "aria-labelledby",
      screen.getByRole("heading", { name: "Drawer title" }).id,
    );
    expect(dialog).toHaveAttribute("aria-describedby", screen.getByText("Drawer description").id);
  });

  it("closes by the header close button", async () => {
    render(<BasicDrawer />);
    openDrawer();
    fireEvent.click(screen.getByRole("button", { name: "Закрыть" }));
    await expectClosed();
  });

  it("closes by Drawer.Close", async () => {
    render(<BasicDrawer />);
    openDrawer();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await expectClosed();
  });

  it("closes by Escape unless closeOnEscape={false}", async () => {
    const { unmount } = render(<BasicDrawer />);
    openDrawer();
    fireEvent.keyDown(document, { key: "Escape" });
    await expectClosed();
    unmount();

    render(<BasicDrawer closeOnEscape={false} />);
    openDrawer();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open");
  });

  it("closes by overlay click unless closeOnOutsideClick={false}", async () => {
    const { unmount } = render(<BasicDrawer />);
    openDrawer();
    clickScrim(drawerScrim());
    await expectClosed();
    unmount();

    render(<BasicDrawer closeOnOutsideClick={false} />);
    openDrawer();
    clickScrim(drawerScrim());
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open");
  });

  it("locks and restores body scroll", async () => {
    render(<BasicDrawer />);
    openDrawer();
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => {
      expect(document.body.style.overflow).toBe("");
    });
  });

  it("renders header parts, body and footer", () => {
    render(<BasicDrawer defaultOpen />);
    expect(screen.getByText("Body content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
    expect(screen.getByRole("dialog").querySelector("[data-tone]")).toHaveAttribute(
      "data-tone",
      "accent",
    );
  });

  it("Drawer.Icon around an Avatar or a Thumbnail draws no tile: data-media, no tone", () => {
    render(
      <Drawer.Root defaultOpen>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Icon tone="accent" data-testid="avatar-slot">
              <Avatar.Root>
                <Avatar.Fallback>АС</Avatar.Fallback>
              </Avatar.Root>
            </Drawer.Icon>
            <Drawer.Title>Анна Соколова</Drawer.Title>
          </Drawer.Header>
        </Drawer.Content>
      </Drawer.Root>,
    );
    const slot = screen.getByTestId("avatar-slot");
    expect(slot).toHaveAttribute("data-media", "true");
    expect(slot).not.toHaveAttribute("data-tone");
    expect(slot).toHaveAttribute("aria-hidden", "true");
    cleanup();

    render(
      <Drawer.Root defaultOpen>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Icon data-testid="thumb-slot">
              <Thumbnail.Root />
            </Drawer.Icon>
            <Drawer.Icon data-testid="icon-slot">
              <svg />
            </Drawer.Icon>
            <Drawer.Title>Склад №3</Drawer.Title>
          </Drawer.Header>
        </Drawer.Content>
      </Drawer.Root>,
    );
    expect(screen.getByTestId("thumb-slot")).toHaveAttribute("data-media", "true");
    expect(screen.getByTestId("icon-slot")).not.toHaveAttribute("data-media");
    expect(screen.getByTestId("icon-slot")).toHaveAttribute("data-tone", "neutral");
  });

  it("right-aligns footer actions by default", () => {
    render(<BasicDrawer defaultOpen />);
    expect(screen.getByTestId("footer")).toHaveAttribute("data-layout", "end");
  });

  it("exposes side and size, defaulting to right and m", () => {
    const { unmount } = render(<BasicDrawer defaultOpen />);
    expect(screen.getByRole("dialog")).toHaveAttribute("data-side", "right");
    expect(screen.getByRole("dialog")).toHaveAttribute("data-size", "m");
    unmount();

    render(<BasicDrawer defaultOpen side="left" size="xl" />);
    expect(screen.getByRole("dialog")).toHaveAttribute("data-side", "left");
    expect(screen.getByRole("dialog")).toHaveAttribute("data-size", "xl");
  });

  it("notifies onOpenChange(false) when controlled", () => {
    const onOpenChange = vi.fn();
    render(<BasicDrawer open onOpenChange={onOpenChange} />);
    clickScrim(drawerScrim());
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open");
  });

  it("uses labels.close for the header close button", () => {
    render(<BasicDrawer defaultOpen labels={{ close: "Закрыть панель" }} />);
    expect(screen.getByRole("button", { name: "Закрыть панель" })).toHaveAttribute(
      "data-size",
      "s",
    );
  });

  it("closes only the topmost nested drawer on Escape", async () => {
    function Nested() {
      const [inner, setInner] = React.useState(false);
      return (
        <Drawer.Root defaultOpen>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Outer</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Button.Root onClick={() => setInner(true)}>Open inner</Button.Root>
              <Drawer.Root open={inner} onOpenChange={setInner}>
                <Drawer.Content>
                  <Drawer.Header>
                    <Drawer.Title>Inner</Drawer.Title>
                  </Drawer.Header>
                </Drawer.Content>
              </Drawer.Root>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      );
    }

    render(<Nested />);
    fireEvent.click(screen.getByRole("button", { name: "Open inner" }));
    expect(screen.getAllByRole("dialog", { hidden: true })).toHaveLength(2);

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Inner", hidden: true }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByRole("heading", { name: "Outer", hidden: true })).toBeInTheDocument();
  });
});

describe("Drawer — no swipe", () => {
  it("has no grab handle and a touch swipe toward its edge does not close it", () => {
    render(<BasicDrawer defaultOpen />);
    const dialog = screen.getByRole("dialog");
    expect(dialog.querySelector("[data-swipe-handle]")).toBeNull();
    swipe(screen.getByText("Body content"), { x: 100, y: 0 }, { x: 400, y: 0 });
    swipe(dialog.querySelector("header") as HTMLElement, { x: 100, y: 0 }, { x: 400, y: 0 });
    expect(dialog).toHaveAttribute("data-state", "open");
    expect(dialog).not.toHaveAttribute("data-swiping");
  });
});

describe("Drawer — overlay contract", () => {
  function DrawerWithMenu() {
    return (
      <Drawer.Root defaultOpen>
        <Drawer.Content aria-label="With menu">
          <Drawer.Body>
            <Dropdown.Root>
              <Dropdown.Trigger>
                <Button.Root>Menu</Button.Root>
              </Dropdown.Trigger>
              <Dropdown.Content>
                <Dropdown.Item>Rename</Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Root>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    );
  }

  it("the scrim is not inert, so a click on it reaches the drawer", () => {
    render(<BasicDrawer defaultOpen />);
    expect(drawerScrim().closest("[inert]")).toBeNull();
  });

  it("a pointerdown outside the panel (not only on the scrim) closes it", async () => {
    render(<BasicDrawer />);
    openDrawer();
    clickScrim(document.body);
    await expectClosed();
  });

  it("a pointerdown inside a nested menu does not close the drawer", () => {
    render(<DrawerWithMenu />);
    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    fireEvent.pointerDown(screen.getByRole("menuitem", { name: "Rename" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("outside click and Escape close only the topmost layer", () => {
    render(<DrawerWithMenu />);
    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    clickScrim(drawerScrim());
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("focuses the panel itself on open; Tab goes on to the first control", async () => {
    const user = userEvent.setup();
    render(<BasicDrawer />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Закрыть" })).toHaveFocus();
  });

  it("an autoFocus field inside wins over the panel", () => {
    render(
      <Drawer.Root defaultOpen>
        <Drawer.Content aria-label="Новый клиент">
          <Drawer.Body>
            {/* biome-ignore lint/a11y/noAutofocus: the test checks that autoFocus wins */}
            <input aria-label="Компания" autoFocus />
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>,
    );
    expect(screen.getByRole("textbox", { name: "Компания" })).toHaveFocus();
  });

  it("a click that opens it shows no tooltip of a header action; keyboard focus does", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip.Provider delayDuration={0}>
        <Drawer.Root>
          <Drawer.Trigger>
            <Button.Root>Open</Button.Root>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Сделка №1042</Drawer.Title>
              <Drawer.Actions>
                <Tooltip.Root>
                  <Tooltip.Trigger>
                    <Button.Root variant="ghost" tone="neutral" aria-label="Другие действия">
                      ⋯
                    </Button.Root>
                  </Tooltip.Trigger>
                  <Tooltip.Content>Другие действия</Tooltip.Content>
                </Tooltip.Root>
              </Drawer.Actions>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer.Root>
      </Tooltip.Provider>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toHaveFocus();
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await user.tab();
    expect(screen.getByRole("button", { name: "Другие действия" })).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Другие действия");
  });

  it("returns focus to the trigger", async () => {
    render(<BasicDrawer />);
    const trigger = screen.getByRole("button", { name: "Open" });
    trigger.focus();
    fireEvent.click(trigger);
    clickScrim(drawerScrim());
    await expectClosed();
    expect(trigger).toHaveFocus();
  });
});

describe("Drawer — header actions, footer meta, exit snapshot", () => {
  it("places Actions in the header before the close button, one tier down", () => {
    render(
      <Drawer.Root defaultOpen>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Сделка №1042</Drawer.Title>
            <Drawer.Actions data-testid="actions">
              <Button.Root variant="ghost" tone="neutral">
                Ещё
              </Button.Root>
            </Drawer.Actions>
          </Drawer.Header>
        </Drawer.Content>
      </Drawer.Root>,
    );
    const actions = screen.getByTestId("actions");
    const close = screen.getByRole("button", { name: "Закрыть" });
    expect(actions.nextElementSibling).toBe(close);
    expect(screen.getByRole("button", { name: "Ещё" })).toHaveAttribute("data-size", "s");
  });

  it("holds a tab-wide switcher before the buttons at tier s; one shown later rises in", async () => {
    function Card({ lang }: { lang: boolean }) {
      return (
        <Drawer.Root defaultOpen>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Кресло «Орион»</Drawer.Title>
              <Drawer.Actions data-testid="actions">
                {lang ? (
                  <SegmentedControl.Root aria-label="Язык текстов" defaultValue="ru">
                    <SegmentedControl.Item value="ru">RU</SegmentedControl.Item>
                    <SegmentedControl.Item value="en">EN</SegmentedControl.Item>
                  </SegmentedControl.Root>
                ) : null}
                <Button.Root variant="ghost" tone="neutral" aria-label="Действия с моделью">
                  ⋯
                </Button.Root>
              </Drawer.Actions>
            </Drawer.Header>
          </Drawer.Content>
        </Drawer.Root>
      );
    }
    const { rerender } = render(<Card lang={false} />);
    const more = screen.getByRole("button", { name: "Действия с моделью" });
    // The next task: the drawer is on screen.
    await act(async () => {});
    rerender(<Card lang />);
    const radio = screen.getByRole("radio", { name: "RU" });
    const cells = [...screen.getByTestId("actions").children];
    const switcherCell = cells.find((cell) => cell.contains(radio));
    // The switcher comes first, the buttons keep their element and their cell's stillness.
    expect(cells[0]).toBe(switcherCell);
    expect(switcherCell).toHaveClass(enterMotion.enter);
    expect(screen.getByRole("button", { name: "Действия с моделью" })).toBe(more);
    expect(more.parentElement).not.toHaveClass(enterMotion.enter);
    expect(screen.getByRole("radiogroup", { name: "Язык текстов" })).toHaveAttribute(
      "data-size",
      "s",
    );
  });

  it("renders Meta as a footer paragraph that does not describe the dialog", () => {
    render(
      <Drawer.Root defaultOpen>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Сделка</Drawer.Title>
          </Drawer.Header>
          <Drawer.Footer>
            <Drawer.Meta>Есть несохранённые изменения</Drawer.Meta>
            <Button.Root>Сохранить</Button.Root>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>,
    );
    const meta = screen.getByText("Есть несохранённые изменения");
    expect(meta.tagName).toBe("P");
    expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-describedby");
  });

  it("puts Actions in the footer at the start, apart from the main pair, at the footer's tier", () => {
    render(
      <Drawer.Root defaultOpen>
        <Drawer.Content aria-label="Профиль">
          <Drawer.Footer>
            <Drawer.Actions data-testid="start">
              <Button.Root variant="ghost" tone="danger">
                Выйти
              </Button.Root>
            </Drawer.Actions>
            <Drawer.Close>
              <Button.Root variant="outline" tone="neutral">
                Закрыть
              </Button.Root>
            </Drawer.Close>
            <Button.Root>Сохранить</Button.Root>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>,
    );
    const start = screen.getByTestId("start");
    const footer = start.parentElement as HTMLElement;
    expect(footer.tagName).toBe("FOOTER");
    expect(footer.firstElementChild).toBe(start);
    // The main pair moves as one row at the end, primary last.
    const end = start.nextElementSibling as HTMLElement;
    expect(end.lastElementChild).toBe(screen.getByRole("button", { name: "Сохранить" }));
    // Not the header's tier `s`: the buttons keep the footer's.
    expect(screen.getByRole("button", { name: "Выйти" })).not.toHaveAttribute("data-size", "s");
  });

  it("holds the title line with a skeleton while the name loads", () => {
    function RecordByLink() {
      const [name, setName] = React.useState<string | null>(null);
      return (
        <Drawer.Root defaultOpen>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title loading={name === null}>{name}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Button.Root onClick={() => setName("Сделка №1042")}>Загрузить</Button.Root>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      );
    }
    render(<RecordByLink />);
    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toHaveAttribute("aria-busy", "true");
    expect(title.querySelector('[aria-hidden="true"]')).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Загрузить" }));
    const loaded = screen.getByRole("heading", { level: 2, name: "Сделка №1042" });
    expect(loaded).not.toHaveAttribute("aria-busy");
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Сделка №1042");
  });

  it("keeps the last open content while it slides out", async () => {
    function RecordDrawer() {
      const [record, setRecord] = React.useState<string | null>("Сделка №1042");
      return (
        <Drawer.Root open={record !== null} onOpenChange={(open) => !open && setRecord(null)}>
          <Drawer.Content aria-label="Карточка">
            <Drawer.Body>{record ?? "Пусто"}</Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close>
                <Button.Root>Закрыть карточку</Button.Root>
              </Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Root>
      );
    }
    // With motion: the panel stays mounted for its exit.
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
    try {
      render(<RecordDrawer />);
      fireEvent.click(screen.getByRole("button", { name: "Закрыть карточку" }));
      const panel = screen.getByRole("dialog", { hidden: true });
      expect(panel).toHaveAttribute("data-state", "closed");
      expect(screen.getByText("Сделка №1042")).toBeInTheDocument();
      expect(screen.queryByText("Пусто")).not.toBeInTheDocument();
      fireEvent.animationEnd(panel);
      await expectClosed();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describeOverlayConformance("Drawer", {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button.Root>Открыть</Button.Root>
      </Drawer.Trigger>
      <Drawer.Content aria-label="Новый клиент">
        <Drawer.Body>
          <input aria-label="Компания" />
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close>
            <Button.Root variant="soft" tone="neutral">
              Отмена
            </Button.Root>
          </Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  ),
  trigger: "Открыть",
  role: "dialog",
  modal: true,
});
