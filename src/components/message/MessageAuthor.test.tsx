import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MessageList } from "@/components/chat/MessageList";
import { hueOf } from "@/internal/palette";
import { paletteColors } from "@/internal/states";

import { Message } from "./Message";

type Row = { id: string; position: "single" | "first" | "middle" | "last"; media?: boolean };

const RUN: Row[] = [
  { id: "a", position: "first" },
  { id: "b", position: "middle" },
  { id: "c", position: "last" },
];

function Messages({
  rows,
  group = false,
  authors,
  direction,
}: {
  rows: Row[];
  group?: boolean;
  authors?: "outgoing";
  direction?: "incoming" | "outgoing";
}) {
  return (
    <MessageList aria-label="Чат" group={group} authors={authors}>
      {rows.map((row) => (
        <Message.Root
          key={row.id}
          value={row.id}
          position={row.position}
          direction={direction}
          time="10:00"
        >
          <Message.Avatar>
            <span data-testid={`avatar-${row.id}`} />
          </Message.Avatar>
          <Message.Author tag="Логистика">
            Анна Котова
            <Message.AuthorIcon>
              <span data-testid={`icon-${row.id}`} />
            </Message.AuthorIcon>
          </Message.Author>
          {row.media ? (
            <Message.Media
              items={[{ src: "/rack.jpg", alt: "Стеллаж", width: 800, height: 600 }]}
            />
          ) : (
            <Message.Text>{`Сообщение ${row.id}`}</Message.Text>
          )}
        </Message.Root>
      ))}
    </MessageList>
  );
}

const header = (id: string) =>
  document.querySelector(`[data-message-value="${id}"] [data-message-fit="row"]`);

describe("Message.Author: the author's header of a group chat", () => {
  it("heads only the first message of a run; the avatar stands on the last", () => {
    render(<Messages rows={RUN} group />);
    expect(header("a")).not.toBeNull();
    expect(header("b")).toBeNull();
    expect(header("c")).toBeNull();
    expect(screen.queryByTestId("avatar-a")).toBeNull();
    expect(screen.queryByTestId("avatar-b")).toBeNull();
    expect(screen.getByTestId("avatar-c")).toBeInTheDocument();
    // Hidden or not, the author names every message of the run.
    expect(screen.getAllByRole("article", { name: "Анна Котова, 10:00" })).toHaveLength(3);
  });

  it("shows no header and no avatar in a direct chat", () => {
    render(<Messages rows={RUN} group={false} />);
    for (const id of ["a", "b", "c"]) expect(header(id)).toBeNull();
    expect(screen.queryByTestId("avatar-c")).toBeNull();
  });

  it("renders the name, then the icon, then the tag, in the author's hue", () => {
    render(<Messages rows={[{ id: "a", position: "single" }]} group />);
    const row = header("a") as HTMLElement;
    const [name, icon, tag] = Array.from(row.children) as HTMLElement[];
    expect(name).toHaveTextContent("Анна Котова");
    expect(icon).toContainElement(screen.getByTestId("icon-a"));
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(tag).toHaveTextContent("Логистика");
    expect(row).toHaveAttribute("data-color", hueOf("Анна Котова"));
  });

  it("stands on a pill over a picture without a caption", () => {
    render(<Messages rows={[{ id: "a", position: "first", media: true }]} group />);
    const row = header("a") as HTMLElement;
    const bubble = document.querySelector("[data-message-bubble]");
    expect(bubble).toHaveAttribute("data-shell", "media");
    expect(row.parentElement?.parentElement).toBe(bubble);
  });

  it("keeps a hue per id: the same id always, every person hue but gray", () => {
    const ids = Array.from({ length: 40 }, (_, i) => `user-${i}`);
    for (const id of ids) {
      expect(hueOf(id)).toBe(hueOf(id));
      expect(hueOf(id)).not.toBe("gray");
      expect(paletteColors).toContain(hueOf(id));
    }
    expect(new Set(ids.map(hueOf)).size).toBeGreaterThan(4);
  });

  it("an explicit color wins over the hue of the name", () => {
    render(
      <Message.Root time="10:00">
        <Message.Author color="purple">Олег Смирнов</Message.Author>
        <Message.Text>Готово</Message.Text>
      </Message.Root>,
    );
    expect(document.querySelector('[data-message-fit="row"]')).toHaveAttribute(
      "data-color",
      "purple",
    );
  });

  it("a press on a picture presses the whole message, never the gallery alone", () => {
    render(
      <Message.Root time="10:00">
        <Message.Media items={[{ src: "/rack.jpg", alt: "Стеллаж", width: 800, height: 600 }]} />
        <Message.Text>Подпись</Message.Text>
      </Message.Root>,
    );
    const tile = screen.getByRole("button", { name: "Открыть: Стеллаж" });
    const bubble = document.querySelector("[data-message-bubble]") as HTMLElement;
    const column = bubble.parentElement as HTMLElement;
    fireEvent.pointerDown(tile);
    expect(column).toHaveAttribute("data-pressed");
    expect(tile.closest("[data-count]")).not.toHaveAttribute("data-pressed");
    fireEvent.pointerUp(tile);
    expect(column).not.toHaveAttribute("data-pressed");
  });

  it('authors="outgoing" heads outgoing runs only, without avatars or a gutter', () => {
    const { unmount } = render(<Messages rows={RUN} authors="outgoing" direction="outgoing" />);
    expect(header("a")).not.toBeNull();
    expect(header("b")).toBeNull();
    unmount();
    render(<Messages rows={RUN} authors="outgoing" direction="incoming" />);
    expect(header("a")).toBeNull();
    expect(screen.queryByTestId("avatar-c")).toBeNull();
  });
});
