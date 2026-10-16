import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Badge } from "@/components/badge/Badge";
import { Message } from "@/components/message/Message";
import { Icon } from "@/icons";
import enterMotion from "@/internal/enterMotion.module.css";

import { Chat } from "./Chat";

type Item = { id: string; at: Date; text: string; service?: boolean };

const at = (hour: number, minute: number) => new Date(2026, 9, 15, hour, minute);

const ITEMS: Item[] = [
  { id: "m1", at: at(10, 12), text: "Ищу склад под аренду" },
  { id: "s1", at: at(10, 12), text: "ИИ-агент взял клиента", service: true },
  { id: "s2", at: at(10, 12), text: "ИИ-агент перевёл клиента", service: true },
  { id: "m2", at: at(10, 13), text: "Есть склад 120 м²" },
];

function Dialog({ items, search }: { items: Item[]; search?: string }) {
  return (
    <Chat.Root defaultSearch={search ?? null}>
      <Chat.Search />
      <Chat.Messages
        aria-label="Диалог"
        items={items}
        getKey={(item) => item.id}
        getAuthor={(item) => (item.service ? "system" : "client")}
        getDate={(item) => item.at}
        isService={(item) => item.service === true}
        timeZone="Asia/Vladivostok"
        now={at(11, 0)}
        renderMessage={(item) =>
          item.service ? (
            <Chat.Service time={item.at} data-testid={item.id}>
              {item.text}
            </Chat.Service>
          ) : (
            <Message.Root time={item.at}>
              <Message.Text>{item.text}</Message.Text>
            </Message.Root>
          )
        }
      />
    </Chat.Root>
  );
}

const rowOf = (id: string) => screen.getByTestId(id).parentElement as HTMLElement;

beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Chat.Service: an event of the chat", () => {
  it("draws the glyph, the words, the change and the time; the change reads as one phrase", () => {
    render(
      <Chat.Service time="10:12">
        <Chat.ServiceIcon data-testid="icon">
          <Icon name="object.funnel" />
        </Chat.ServiceIcon>
        ИИ-агент перевёл клиента
        <Chat.ServiceChange
          data-testid="change"
          from={<Badge.Root color="gray">Лид</Badge.Root>}
          to={<Badge.Root color="green">Арендатор</Badge.Root>}
        />
      </Chat.Service>,
    );
    expect(screen.getByTestId("icon")).toHaveAttribute("aria-hidden", "true");
    const change = screen.getByTestId("change");
    // The drawing (two badges and the arrow) is hidden; a hidden line says the change.
    expect(within(change).getByText("Лид").closest("[aria-hidden='true']")).not.toBeNull();
    expect(within(change).getByText("с «Лид» на «Арендатор»")).toBeInTheDocument();
    expect(screen.getByText("10:12").tagName).toBe("TIME");
    // The badges inside take the compact tier.
    expect(within(change).getByText("Лид").closest("[data-tier]")).toHaveAttribute(
      "data-tier",
      "xs",
    );
  });

  it("takes the change phrase from labels", () => {
    render(
      <Chat.Service>
        Этап
        <Chat.ServiceChange
          from="Лид"
          to="Арендатор"
          labels={{ change: "изменён: {from} → {to}" }}
        />
      </Chat.Service>,
    );
    expect(screen.getByText("изменён: Лид → Арендатор")).toBeInTheDocument();
  });

  it("is a row of the list, not a message; its time reads in the list's zone", () => {
    render(<Dialog items={ITEMS} />);
    const log = screen.getByRole("log", { name: "Диалог" });
    expect(within(log).getAllByRole("article")).toHaveLength(2);
    const event = screen.getByTestId("s1");
    expect(event.closest("[data-message-article]")).toBeNull();
    // 10:12 in the browser's zone is another hour in Vladivostok; the event follows the list.
    const time = event.querySelector("time") as HTMLTimeElement;
    expect(time).toHaveAttribute("dateTime", at(10, 12).toISOString());
    expect(time.textContent).toBe(
      at(10, 12).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Vladivostok",
      }),
    );
  });

  it("stands consecutive events in adjacent rows (one group)", () => {
    render(<Dialog items={ITEMS} />);
    expect(rowOf("s1").nextElementSibling).toBe(rowOf("s2"));
  });

  it("stays still on the first render and rises in when it arrives at the end", () => {
    const { rerender } = render(<Dialog items={ITEMS} />);
    expect(rowOf("s1")).not.toHaveClass(enterMotion.enter);
    expect(rowOf("s2")).not.toHaveClass(enterMotion.enter);
    const joined = { id: "s3", at: at(10, 16), text: "Менеджер подключилась", service: true };
    rerender(<Dialog items={[...ITEMS, joined]} />);
    expect(rowOf("s3")).toHaveClass(enterMotion.enter);
    expect(rowOf("s2")).not.toHaveClass(enterMotion.enter);
    // Another render while it plays keeps the class until its keyframe ends.
    rerender(<Dialog items={[...ITEMS, joined]} />);
    expect(rowOf("s3")).toHaveClass(enterMotion.enter);
    rowOf("s3").dispatchEvent(new Event("animationend"));
    expect(rowOf("s3")).not.toHaveClass(enterMotion.enter);
  });

  it("is not searched: a match is a message", () => {
    render(<Dialog items={ITEMS} search="взял клиента" />);
    expect(screen.getByText("Нет совпадений")).toBeInTheDocument();
  });
});
