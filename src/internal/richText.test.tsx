import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { getRichTextSource, getTextEntities, RichText, type TextEntity } from "./richText";

const LABELS = { spoiler: "Скрытый текст" };

/**
 * The rendered markup of `source`: tags and text only, links with their href, a masked spoiler as
 * `<spoiler>` (its wrapper spans unwrapped).
 */
function markup(source: string, entities?: TextEntity[]) {
  const { container } = render(<RichText labels={LABELS} source={source} entities={entities} />);
  const serialize = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
    const element = node as Element;
    const inner = Array.from(element.childNodes, serialize).join("");
    const tag = element.tagName.toLowerCase();
    if (element.getAttribute("role") === "button") return `<spoiler>${inner}</spoiler>`;
    if (tag === "span") return inner;
    const href = tag === "a" ? ` href="${element.getAttribute("href")}"` : "";
    return `<${tag}${href}>${inner}</${tag}>`;
  };
  return Array.from(container.childNodes, serialize).join("");
}

describe("RichText markup", () => {
  it("renders bold, italic, strike and code", () => {
    expect(markup("**счёт** _срочно_ ~~вчера~~ `INV-204`")).toBe(
      "<p><strong>счёт</strong> <em>срочно</em> <s>вчера</s> <code>INV-204</code></p>",
    );
  });

  it("renders underline and backslash-escaped markers as text", () => {
    expect(markup("__акт__ и \\*\\*ИНН\\*\\*")).toBe("<p><u>акт</u> и **ИНН**</p>");
  });

  it("renders a plain text with its entities, never reading Markdown in it", () => {
    expect(
      markup("поле **ИНН** полеИНН\nцитата", [
        { type: "bold", offset: 17, length: 3 },
        { type: "underline", offset: 13, length: 4 },
        { type: "quote", offset: 21, length: 6 },
      ]),
    ).toBe("<p>поле **ИНН** <u>поле</u><strong>ИНН</strong></p><blockquote>цитата</blockquote>");
  });

  it("keeps underscores inside words and unmatched markers as text", () => {
    expect(markup("order_id и **нет")).toBe("<p>order_id и **нет</p>");
  });

  it("nests emphasis", () => {
    expect(markup("**очень _важно_**")).toBe("<p><strong>очень <em>важно</em></strong></p>");
  });

  it("links labelled and bare URLs, leaving trailing punctuation", () => {
    expect(markup("[договор](https://prime.app/d/1) и https://prime.app/i/2.")).toBe(
      '<p><a href="https://prime.app/d/1">договор</a> и ' +
        '<a href="https://prime.app/i/2">https://prime.app/i/2</a>.</p>',
    );
  });

  it("masks a spoiler with markup inside, never across a space at its edges", () => {
    expect(markup("код ||**4821**|| и || нет||")).toBe(
      "<p>код <spoiler><strong>4821</strong></spoiler> и || нет||</p>",
    );
  });

  it("never links unsafe protocols", () => {
    expect(markup("[x](javascript:alert(1))")).toBe("<p>[x](javascript:alert(1))</p>");
    expect(markup("[почта](mailto:team@prime.app)")).toBe(
      '<p><a href="mailto:team@prime.app">почта</a></p>',
    );
  });

  it("splits text, quotes and fenced code", () => {
    expect(markup("> Когда оплата?\nВ пятницу\n```\nnpm run build\n```")).toBe(
      "<blockquote>Когда оплата?</blockquote><p>В пятницу</p><pre><code>npm run build</code></pre>",
    );
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

describe("parseRichText", () => {
  it("reads underline `__` apart from italic `_`, and both at once", () => {
    expect(getTextEntities("__акт__ _срочно_ ___оба___")).toEqual({
      text: "акт срочно оба",
      entities: [
        { type: "underline", offset: 0, length: 3 },
        { type: "italic", offset: 4, length: 6 },
        { type: "italic", offset: 11, length: 3 },
        { type: "underline", offset: 11, length: 3 },
      ],
    });
    expect(getTextEntities("snake__case__name").entities).toEqual([]);
  });

  it("opens bold, strike and spoiler inside a word, italic only at its edges", () => {
    expect(getTextEntities("поле**ИНН** до~~вчера~~ order_id_x").entities).toEqual([
      { type: "bold", offset: 4, length: 3 },
      { type: "strikethrough", offset: 10, length: 5 },
    ]);
  });

  it("writes a backslashed punctuation mark as text, a closer included", () => {
    expect(getTextEntities("\\*\\*ИНН\\*\\* и \\_x\\_ и C:\\dir")).toEqual({
      text: "**ИНН** и _x_ и C:\\dir",
      entities: [],
    });
    expect(getTextEntities("**a\\**").text).toBe("**a**");
    expect(getTextEntities("**a\\\\**")).toEqual({
      text: "a\\",
      entities: [{ type: "bold", offset: 0, length: 2 }],
    });
    expect(getTextEntities("\\> не цитата")).toEqual({ text: "> не цитата", entities: [] });
  });

  it("keeps the language of a fence and the breaks around blocks", () => {
    expect(getTextEntities("Лог:\n\n```ts\nconst a = 1\n```\n> итог")).toEqual({
      text: "Лог:\n\nconst a = 1\nитог",
      entities: [
        { type: "pre", offset: 6, length: 11, language: "ts" },
        { type: "quote", offset: 18, length: 4 },
      ],
    });
  });

  it("gives links their address and leaves bare URLs to the messenger", () => {
    expect(getTextEntities("[счёт](https://prime.app/i/1) и https://prime.app/i/2")).toEqual({
      text: "счёт и https://prime.app/i/2",
      entities: [{ type: "link", offset: 0, length: 4, url: "https://prime.app/i/1" }],
    });
  });
});

describe("entities", () => {
  it("nest, and one that crosses another's end is cut", () => {
    expect(
      markup("ab cd", [
        { type: "bold", offset: 0, length: 4 },
        { type: "italic", offset: 3, length: 2 },
      ]),
    ).toBe("<p><strong>ab <em>c</em></strong><em>d</em></p>");
  });

  it("make blocks of pre and quote, and drop what is broken or unknown", () => {
    const entities = [
      { type: "quote", offset: 5, length: 6 },
      { type: "pre", offset: 12, length: 3, language: "sh" },
      { type: "bold", offset: 0, length: 0 },
      { type: "mention", offset: 0, length: 4 },
      { type: "link", offset: 0, length: 4, url: "javascript:alert(1)" },
    ] as unknown as TextEntity[];
    expect(markup("Итог\nстрока\nls\nконец", entities)).toBe(
      "<p>Итог</p><blockquote>строка</blockquote><pre><code>ls</code></pre><p>конец</p>",
    );
  });

  it("link a bare URL in plain text, a link without an address by its own text", () => {
    expect(markup("см. www.prime.app и сайт", [{ type: "link", offset: 20, length: 4 }])).toBe(
      '<p>см. <a href="https://www.prime.app">www.prime.app</a> и сайт</p>',
    );
  });
});

describe("getRichTextSource", () => {
  const roundTrip = (text: string, entities: TextEntity[]) =>
    getTextEntities(getRichTextSource({ text, entities }));

  it("writes entities as Markdown and escapes text that would read as markup", () => {
    expect(getRichTextSource({ text: "поле **ИНН** и snake_case", entities: [] })).toBe(
      "поле \\*\\*ИНН\\*\\* и snake_case",
    );
    expect(
      getRichTextSource({
        text: "Счёт оплачен",
        entities: [
          { type: "bold", offset: 0, length: 4 },
          { type: "underline", offset: 5, length: 7 },
        ],
      }),
    ).toBe("**Счёт** __оплачен__");
  });

  it("round-trips nested, adjacent and block entities", () => {
    const text = "Итог: полеИНН\nцитата\nnpm ci\nhttps://prime.app/a_b";
    const entities: TextEntity[] = [
      { type: "bold", offset: 6, length: 7 },
      { type: "spoiler", offset: 10, length: 3 },
      { type: "italic", offset: 14, length: 6 },
      { type: "quote", offset: 14, length: 6 },
      { type: "pre", offset: 21, length: 6, language: "sh" },
    ];
    expect(roundTrip(text, entities)).toEqual({ text, entities });
  });

  it("drops an italic it cannot hold inside a word, keeping the text", () => {
    expect(
      getRichTextSource({ text: "полеИНН", entities: [{ type: "italic", offset: 0, length: 4 }] }),
    ).toBe("полеИНН");
  });
});
