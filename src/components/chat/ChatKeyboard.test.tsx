import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Dropdown } from "@/components/dropdown/Dropdown";
import { Message } from "@/components/message/Message";

import { Chat } from "./Chat";

const MESSAGES = [
  { id: "m1", text: "Счёт INV-2048 выставлен", mine: false },
  { id: "m2", text: "Проверьте реквизиты", mine: false },
  { id: "m3", text: "Счёт оплачен", mine: true },
];

function Conversation({
  onReactionToggle,
  ...rest
}: Omit<React.ComponentProps<typeof Chat.Root>, "children"> & {
  onReactionToggle?: (emoji: string) => void;
}) {
  return (
    <Chat.Root {...rest}>
      <Chat.Messages
        aria-label="Переписка"
        reactionOptions={[
          { emoji: "+1", label: "Нравится" },
          { emoji: "fire", label: "Огонь" },
        ]}
      >
        {MESSAGES.map((message) => (
          <Message.Root
            key={message.id}
            value={message.id}
            direction={message.mine ? "outgoing" : "incoming"}
            time="10:00"
            onReactionToggle={onReactionToggle}
          >
            <Message.Text>{message.text}</Message.Text>
            <Message.Menu>
              <Dropdown.Item>Ответить</Dropdown.Item>
            </Message.Menu>
          </Message.Root>
        ))}
      </Chat.Messages>
      <Chat.Footer>
        <textarea aria-label="Сообщение" />
      </Chat.Footer>
    </Chat.Root>
  );
}

const article = (id: string) =>
  document.querySelector<HTMLElement>(`[data-message-value="${id}"]`) as HTMLElement;

const settle = () =>
  act(async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 300));
  });

beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) =>
    window.setTimeout(() => callback(performance.now()), 0),
  );
  vi.stubGlobal("cancelAnimationFrame", (id: number) => window.clearTimeout(id));
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Chat.Messages from the keyboard", () => {
  it("Tab enters on the newest message, ↑ ↓ move between messages, Tab leaves for the footer", async () => {
    const user = userEvent.setup();
    render(<Conversation />);
    await user.tab();
    expect(article("m3")).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(article("m2")).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(article("m1")).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(article("m2")).toHaveFocus();
    // The tab stop follows the focus; the next Tab leaves the list.
    expect(article("m2")).toHaveAttribute("tabindex", "0");
    expect(article("m3")).toHaveAttribute("tabindex", "-1");
    await user.tab();
    expect(screen.getByRole("textbox", { name: "Сообщение" })).toHaveFocus();
  });

  it("in selection mode Space toggles the message and Shift+Space takes the range", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(<Conversation defaultSelected={[]} onSelectedChange={onSelectedChange} />);
    article("m1").focus();
    await user.keyboard(" ");
    expect(onSelectedChange).toHaveBeenLastCalledWith(["m1"]);
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(article("m3")).toHaveFocus();
    await user.keyboard("{Shift>} {/Shift}");
    expect([...(onSelectedChange.mock.calls.at(-1)?.[0] as string[])].sort()).toEqual([
      "m1",
      "m2",
      "m3",
    ]);
    await user.keyboard(" ");
    expect([...(onSelectedChange.mock.calls.at(-1)?.[0] as string[])].sort()).toEqual(["m1", "m2"]);
  });

  it("L puts the quick reaction, R opens the reaction bar", async () => {
    const user = userEvent.setup();
    const onReactionToggle = vi.fn();
    render(<Conversation onReactionToggle={onReactionToggle} />);
    article("m2").focus();
    await user.keyboard("l");
    expect(onReactionToggle).toHaveBeenLastCalledWith("👍");
    await user.keyboard("r");
    expect(await screen.findByRole("toolbar", { name: "Реакции" })).toBeInTheDocument();
  });

  it("the menu key and Shift+F10 open the focused message's menu; Escape returns to it", async () => {
    const user = userEvent.setup();
    render(<Conversation />);
    article("m2").focus();
    await user.keyboard("{ContextMenu}");
    expect(await screen.findByRole("menuitem", { name: "Ответить" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await settle();
    expect(article("m2")).toHaveFocus();
    await user.keyboard("{Shift>}{F10}{/Shift}");
    expect(await screen.findByRole("menuitem", { name: "Ответить" })).toBeInTheDocument();
  });
});
