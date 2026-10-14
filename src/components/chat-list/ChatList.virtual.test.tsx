import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ChatList } from "./ChatList";

type Dialog = { id: string; name: string };

const DIALOGS: Dialog[] = Array.from({ length: 1000 }, (_, index) => ({
  id: `d${index}`,
  name: `Клиент ${index}`,
}));

/** The view is 440px tall; rows have no CSS, so each stands at the row estimate. */
function sized(height = 440) {
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(height);
}

function Dialogs({ items = DIALOGS }: { items?: Dialog[] }) {
  return (
    <ChatList.Root
      items={items}
      getKey={(item) => item.id}
      renderItem={(item) => (
        <ChatList.Item>
          <ChatList.ItemText>{item.name}</ChatList.ItemText>
        </ChatList.Item>
      )}
    />
  );
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
    const scroller = container.querySelector("ul")?.closest("[class*='scroller']") as HTMLElement;
    const first = rendered()[0] ?? 0;
    scroller.scrollTop = 60 * 500;
    await act(async () => {
      fireEvent.scroll(scroller);
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    });
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

  it("renders every row of a short list", () => {
    sized();
    render(<Dialogs items={DIALOGS.slice(0, 80)} />);
    expect(rendered()).toHaveLength(80);
  });
});
