import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { parseInline, parseRichText, RichText, safeHref } from "./richText";

const LABELS = { spoiler: "Скрытый текст" };

describe("parseInline", () => {
  it("parses bold, italic, strike and code", () => {
    expect(parseInline("**счёт** _срочно_ ~~вчера~~ `INV-204`")).toEqual([
      { type: "bold", children: [{ type: "text", text: "счёт" }] },
      { type: "text", text: " " },
      { type: "italic", children: [{ type: "text", text: "срочно" }] },
      { type: "text", text: " " },
      { type: "strike", children: [{ type: "text", text: "вчера" }] },
      { type: "text", text: " " },
      { type: "code", text: "INV-204" },
    ]);
  });

  it("keeps underscores inside words and unmatched markers as text", () => {
    expect(parseInline("order_id и **нет")).toEqual([{ type: "text", text: "order_id и **нет" }]);
  });

  it("nests emphasis", () => {
    expect(parseInline("**очень _важно_**")).toEqual([
      {
        type: "bold",
        children: [
          { type: "text", text: "очень " },
          { type: "italic", children: [{ type: "text", text: "важно" }] },
        ],
      },
    ]);
  });

  it("links labelled and bare URLs, leaving trailing punctuation", () => {
    expect(parseInline("[договор](https://prime.app/d/1) и https://prime.app/i/2.")).toEqual([
      {
        type: "link",
        href: "https://prime.app/d/1",
        children: [{ type: "text", text: "договор" }],
      },
      { type: "text", text: " и " },
      {
        type: "link",
        href: "https://prime.app/i/2",
        children: [{ type: "text", text: "https://prime.app/i/2" }],
      },
      { type: "text", text: "." },
    ]);
  });

  it("parses a spoiler with markup inside, never across a space at its edges", () => {
    expect(parseInline("код ||**4821**|| и || нет||")).toEqual([
      { type: "text", text: "код " },
      { type: "spoiler", children: [{ type: "bold", children: [{ type: "text", text: "4821" }] }] },
      { type: "text", text: " и || нет||" },
    ]);
  });

  it("never links unsafe protocols", () => {
    expect(parseInline("[x](javascript:alert(1))")[0]).toEqual({
      type: "text",
      text: "[x](javascript:alert(1))",
    });
    expect(safeHref("javascript:alert(1)")).toBeNull();
    expect(safeHref("mailto:team@prime.app")).toBe("mailto:team@prime.app");
  });
});

describe("parseRichText", () => {
  it("splits text, quotes and fenced code", () => {
    const blocks = parseRichText("> Когда оплата?\nВ пятницу\n```\nnpm run build\n```");
    expect(blocks.map((block) => block.type)).toEqual(["quote", "text", "code"]);
    expect(blocks[2]).toEqual({ type: "code", text: "npm run build" });
  });
});

describe("RichText", () => {
  it("renders elements, never HTML", () => {
    const { container } = render(
      <RichText labels={LABELS} source={'<img src=x onerror="alert(1)"> **жирный**'} />,
    );
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("strong")?.textContent).toBe("жирный");
    expect(container.textContent).toContain("<img");
  });

  it("opens links in a new tab without the opener", () => {
    const { getByRole } = render(<RichText labels={LABELS} source="https://prime.app" />);
    const link = getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("puts `end` at the end of the last text line", () => {
    const { container } = render(
      <RichText labels={LABELS} source={"Привет\nкак дела"} end={<i data-end="" />} />,
    );
    const paragraph = container.querySelector("p");
    expect(paragraph?.lastElementChild).toHaveAttribute("data-end");
  });

  it("puts `end` on its own line after a code block", () => {
    const { container } = render(
      <RichText labels={LABELS} source={"```\nls\n```"} end={<i data-end="" />} />,
    );
    expect(container.lastElementChild?.tagName).toBe("P");
    expect(container.querySelector("p [data-end]")).not.toBeNull();
  });
});

describe("RichText highlight", () => {
  it("marks every match, inside emphasis too, case-insensitively", () => {
    const { container } = render(
      <RichText labels={LABELS} source="Счёт **INV-2048** и ещё счёт: inv-2049" highlight="inv" />,
    );
    const marks = Array.from(container.querySelectorAll("mark")).map((mark) => mark.textContent);
    expect(marks).toEqual(["INV", "inv"]);
    expect(container.textContent).toBe("Счёт INV-2048 и ещё счёт: inv-2049");
  });

  it("marks nothing without a query", () => {
    const { container } = render(
      <RichText labels={LABELS} source="Счёт INV-2048" highlight="  " />,
    );
    expect(container.querySelector("mark")).toBeNull();
  });
});

describe("RichText spoiler", () => {
  it("is a button named «Скрытый текст» that hides its words until pressed", () => {
    const { container } = render(
      <RichText labels={LABELS} source="Пароль: ||Prime-2048|| до пятницы" />,
    );
    const spoiler = screen.getByRole("button", { name: "Скрытый текст" });
    expect(spoiler).toHaveAttribute("tabindex", "0");
    expect(spoiler).toHaveAttribute("data-state", "masked");
    expect(spoiler.firstElementChild).toHaveAttribute("aria-hidden", "true");
    fireEvent.click(spoiler);
    expect(screen.queryByRole("button")).toBeNull();
    const revealed = container.querySelector('[data-state="revealed"]');
    expect(revealed?.textContent).toBe("Prime-2048");
    expect(revealed).not.toHaveAttribute("aria-hidden");
  });

  it("Enter and Space reveal it and move the focus onto the text", () => {
    const { container } = render(<RichText labels={LABELS} source="||первый|| и ||второй||" />);
    const [first, second] = screen.getAllByRole("button", { name: "Скрытый текст" });
    first.focus();
    fireEvent.keyDown(first, { key: "Enter" });
    expect(container.querySelector('[data-state="revealed"]')).toHaveFocus();
    second.focus();
    const space = fireEvent.keyDown(second, { key: " " });
    expect(space).toBe(false);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("keeps links and search marks out of the mask, then shows them", () => {
    const { container } = render(
      <RichText
        labels={LABELS}
        source="||[счёт](https://prime.app/i/1) к оплате||"
        highlight="счёт"
      />,
    );
    expect(container.querySelector("a")).toBeNull();
    expect(container.querySelector("mark")).toBeNull();
    expect(screen.getAllByRole("button")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("link", { name: "счёт" })).toBeInTheDocument();
    expect(container.querySelector("mark")?.textContent).toBe("счёт");
  });

  it("takes its name from labels", () => {
    render(<RichText source="||секрет||" labels={{ spoiler: "Спойлер" }} />);
    expect(screen.getByRole("button", { name: "Спойлер" })).toBeInTheDocument();
  });
});
