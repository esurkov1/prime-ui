import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Message } from "@/components/message/Message";
import { cssRule, cssValue } from "@/test/css";

import { Chat } from "./Chat";

const CSS = "src/components/chat/Chat.module.css";

/** The place of the match as the live region says it (the visible count is `aria-hidden`). */
const ANNOUNCED = { ignore: "[aria-hidden='true'], [aria-hidden='true'] *" };

const article = (id: string) =>
  document.querySelector<HTMLElement>(`[data-message-value="${id}"]`) as HTMLElement;

function Messages() {
  return (
    <Chat.Messages>
      <Message.Root value="m1" time="09:00">
        <Message.Text>Счёт INV-4120 выставлен</Message.Text>
      </Message.Root>
      <Message.Root value="m2" time="09:05">
        <Message.Text>Реквизиты в письме</Message.Text>
      </Message.Root>
      <Message.Root value="m3" direction="outgoing" time="09:10">
        <Message.Text>Счёт оплачен</Message.Text>
      </Message.Root>
    </Chat.Messages>
  );
}

describe("Chat.Root variant", () => {
  it("marks the frame with its variant, pane by default", () => {
    const { container, rerender } = render(
      <Chat.Root>
        <Messages />
      </Chat.Root>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-variant", "pane");
    rerender(
      <Chat.Root variant="inline">
        <Messages />
      </Chat.Root>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-variant", "inline");
  });

  it("inline drops the insets of the zones and bleeds the messages into the host's padding", () => {
    const inline = '.root[data-variant="inline"] >';
    expect(cssValue(cssRule(CSS, `${inline} .header`), "padding")).toBe("0 0 var(--prime-space-3)");
    expect(cssValue(cssRule(CSS, `${inline} .search`), "padding-inline")).toBe("0");
    expect(cssValue(cssRule(CSS, `${inline} .pinned`), "margin-inline")).toBe("0");
    expect(cssValue(cssRule(CSS, `${inline} .footer`), "padding")).toBe("var(--prime-space-2) 0 0");
    expect(cssValue(cssRule(CSS, `${inline} .messages`), "margin-inline")).toBe(
      "calc(var(--prime-space-4) * -1)",
    );
    // The air inside the list stays: the scroller keeps its own padding.
    expect(cssValue(cssRule(CSS, ".scroller"), "padding")).toBe(
      "var(--prime-space-2) var(--prime-space-2) var(--prime-space-3)",
    );
  });
});

describe("Chat.Header parts", () => {
  it("renders the title with its number, the badges and the actions at tier s", () => {
    render(
      <Chat.Root>
        <Chat.Header>
          <span data-testid="lead" />
          <Chat.Title number="#4120">Ольга Ветрова</Chat.Title>
          <Chat.Badges>
            <Badge.Root tone="warning">В работе</Badge.Root>
          </Chat.Badges>
          <Chat.Description>ООО «Северный ветер»</Chat.Description>
          <Chat.Actions>
            <Button.Root variant="ghost" aria-label="AI-ассистент" pressed>
              AI
            </Button.Root>
          </Chat.Actions>
        </Chat.Header>
        <Messages />
      </Chat.Root>,
    );
    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toHaveTextContent("Ольга Ветрова #4120");
    // The number is part of the list's name.
    expect(screen.getByRole("log", { name: "Ольга Ветрова #4120" })).toBeInTheDocument();
    expect(screen.getByText("В работе")).toBeInTheDocument();
    const toggle = screen.getByRole("button", { name: "AI-ассистент" });
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveAttribute("data-size", "s");
    // Anything else leads the row.
    expect(screen.getByTestId("lead").parentElement).not.toBe(title.parentElement);
  });

  it("the header's buttons are reached by Tab and pressed with Enter", async () => {
    render(
      <Chat.Root>
        <Chat.Header>
          <Chat.Title>Ольга Ветрова</Chat.Title>
          <Chat.Actions>
            <Chat.SearchButton />
          </Chat.Actions>
        </Chat.Header>
        <Chat.Search />
        <Messages />
      </Chat.Root>,
    );
    await userEvent.tab();
    const button = screen.getByRole("button", { name: "Поиск по переписке" });
    expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("searchbox")).toHaveFocus();
    expect(button).toHaveAttribute("aria-pressed", "true");
  });
});

describe("Chat.Search", () => {
  it("shows the place and the steps only once a query is typed", async () => {
    render(
      <Chat.Root defaultSearch="">
        <Chat.Search />
        <Messages />
      </Chat.Root>,
    );
    expect(screen.queryByRole("button", { name: "Предыдущее совпадение" })).toBeNull();
    await userEvent.type(screen.getByRole("searchbox"), "счёт");
    expect(screen.getByRole("button", { name: "Предыдущее совпадение" })).toBeInTheDocument();
    expect(screen.getByText("2 из 2", ANNOUNCED)).toBeInTheDocument();
    await userEvent.clear(screen.getByRole("searchbox"));
    await userEvent.type(screen.getByRole("searchbox"), "накладная");
    // No match: the badge reads «0/0», the live region says it in words, the steps are disabled.
    expect(screen.getByText("Нет совпадений", ANNOUNCED)).toBeInTheDocument();
    const badge = document
      .querySelector<HTMLElement>("[data-rolling-value]")
      ?.closest("[aria-hidden='true']") as HTMLElement;
    expect(badge).toHaveTextContent("0/0");
    // Each number rolls on its own.
    expect(badge.querySelectorAll("[data-rolling-value]")).toHaveLength(2);
    // One order in every state: the two steps, then the count badge last.
    const field = screen.getByRole("searchbox");
    const older = screen.getByRole("button", { name: "Предыдущее совпадение" });
    expect(field.compareDocumentPosition(older) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(older.compareDocumentPosition(badge) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(older).toHaveAttribute("aria-disabled", "true");
  });

  it("searches from two characters: a shorter query marks, counts and shows nothing", async () => {
    render(
      <Chat.Root defaultSearch="">
        <Chat.Search />
        <Messages />
      </Chat.Root>,
    );
    await userEvent.type(screen.getByRole("searchbox"), "с");
    expect(document.querySelectorAll("mark")).toHaveLength(0);
    expect(screen.queryByRole("button", { name: "Предыдущее совпадение" })).toBeNull();
    expect(document.querySelector("[data-rolling-value]")).toBeNull();
    await userEvent.type(screen.getByRole("searchbox"), "ч");
    expect(document.querySelectorAll("mark").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Предыдущее совпадение" })).toBeInTheDocument();
  });

  it("persistent: always there, steps by keys, an empty field is no search, Escape clears", async () => {
    let search: string | null | undefined;
    render(
      <Chat.Root onSearchChange={(next) => (search = next)}>
        <Chat.Search persistent>
          <button type="button">Канал</button>
        </Chat.Search>
        <Messages />
      </Chat.Root>,
    );
    const field = screen.getByRole("searchbox", { name: "Поиск по переписке" });
    // Mounted with the chat, the field never takes the focus by itself.
    expect(field).not.toHaveFocus();
    expect(screen.queryByRole("button", { name: "Следующее совпадение" })).toBeNull();
    // The start control stands before the field, in the tab order.
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Канал" })).toHaveFocus();
    await userEvent.tab();
    expect(field).toHaveFocus();

    await userEvent.type(field, "счёт");
    expect(screen.getByText("2 из 2", ANNOUNCED)).toBeInTheDocument();
    expect(article("m3")).toHaveAttribute("data-pointed");
    await userEvent.keyboard("{ArrowUp}");
    expect(screen.getByText("1 из 2", ANNOUNCED)).toBeInTheDocument();
    expect(article("m1")).toHaveAttribute("data-pointed");
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByText("2 из 2", ANNOUNCED)).toBeInTheDocument();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByText("1 из 2", ANNOUNCED)).toBeInTheDocument();
    await userEvent.keyboard("{Shift>}{Enter}{/Shift}");
    expect(screen.getByText("2 из 2", ANNOUNCED)).toBeInTheDocument();

    await userEvent.clear(field);
    expect(search).toBeNull();
    await userEvent.type(field, "реквизиты");
    fireEvent.keyDown(field, { key: "Escape" });
    expect(search).toBeNull();
    expect(field).toHaveValue("");
    // The bar stays, the focus too.
    expect(field).toHaveFocus();
    expect(screen.queryByRole("button", { name: "Предыдущее совпадение" })).toBeNull();
  });
});
