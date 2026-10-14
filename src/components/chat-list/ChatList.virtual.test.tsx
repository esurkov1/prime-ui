import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Dropdown } from "@/components/dropdown/Dropdown";

import { ChatList } from "./ChatList";
import styles from "./ChatList.module.css";

type Dialog = { id: string; name: string };

const DIALOGS: Dialog[] = Array.from({ length: 1000 }, (_, index) => ({
  id: `d${index}`,
  name: `Клиент ${index}`,
}));

/** The view is 440px tall; rows have no CSS, so each stands at the row estimate. */
function sized(height = 440) {
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(height);
}

function Dialogs({ items = DIALOGS, menu = false }: { items?: Dialog[]; menu?: boolean }) {
  return (
    <ChatList.Root
      items={items}
      getKey={(item) => item.id}
      renderItem={(item) => (
        <ChatList.Item>
          <ChatList.ItemText>{item.name}</ChatList.ItemText>
          {menu ? (
            <ChatList.ItemMenu>
              <Dropdown.Item>Закрепить</Dropdown.Item>
            </ChatList.ItemMenu>
          ) : null}
        </ChatList.Item>
      )}
    />
  );
}

const scrollerOf = (container: HTMLElement) =>
  container.querySelector(`.${styles.scroller}`) as HTMLElement;

async function scrollTo(scroller: HTMLElement, top: number) {
  scroller.scrollTop = top;
  await act(async () => {
    fireEvent.scroll(scroller);
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  });
}

const rendered = () =>
  screen.getAllByRole("button").map((node) => Number(node.dataset.dndItem?.slice(1)));

afterEach(() => vi.restoreAllMocks());

describe("ChatList virtual rows", () => {
  it("renders only the rows around the view, a spacer standing for the rest", () => {
    sized();
    const { container } = render(<Dialogs />);
    const indexes = rendered();
    expect(indexes[0]).toBe(0);
    expect(indexes.length).toBeLessThan(30);
    const spacer = container.querySelector<HTMLElement>("li[aria-hidden='true']");
    expect(Number.parseFloat(spacer?.style.height ?? "0")).toBeGreaterThan(0);
  });

  it("follows the scroll of its own scroller", async () => {
    sized();
    const { container } = render(<Dialogs />);
    const first = rendered()[0] ?? 0;
    await scrollTo(scrollerOf(container), 60 * 500);
    const indexes = rendered();
    expect(indexes.some((index) => index > 300)).toBe(true);
    expect(indexes.length).toBeLessThan(40);
    // The list's Tab stop stays rendered wherever the list scrolls.
    expect(indexes).toContain(first);
  });

  it("walks to a row not rendered yet: End renders the last dialog and focuses it", async () => {
    sized();
    const user = userEvent.setup();
    render(<Dialogs />);
    await user.tab();
    expect(screen.getByRole("button", { name: "Клиент 0" })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("button", { name: "Клиент 999" })).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("button", { name: "Клиент 998" })).toHaveFocus();
  });

  it("keeps a row rendered while its menu is open, and lets it go once the menu closes", async () => {
    sized();
    const user = userEvent.setup();
    const { container } = render(<Dialogs menu />);
    fireEvent.contextMenu(screen.getByRole("button", { name: "Клиент 3" }), {
      clientX: 10,
      clientY: 10,
    });
    expect(await screen.findByRole("menuitem", { name: "Закрепить" })).toBeInTheDocument();
    await scrollTo(scrollerOf(container), 60 * 500);
    expect(rendered()).toContain(3);
    await user.keyboard("{Escape}");
    await scrollTo(scrollerOf(container), 0);
    await user.click(screen.getByRole("button", { name: "Клиент 5" }));
    await scrollTo(scrollerOf(container), 60 * 500);
    expect(rendered()).not.toContain(3);
  });

  it("renders every row of a short list", () => {
    sized();
    render(<Dialogs items={DIALOGS.slice(0, 80)} />);
    expect(rendered()).toHaveLength(80);
  });
});
