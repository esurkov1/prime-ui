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

/**
 * Whether each click reached the document unprevented (the browser would follow the link); the
 * listener then stops the navigation jsdom cannot do.
 */
function followedClicks() {
  const seen: boolean[] = [];
  const listen = (event: MouseEvent) => {
    seen.push(!event.defaultPrevented);
    event.preventDefault();
  };
  window.addEventListener("click", listen);
  return {
    stop: () => {
      window.removeEventListener("click", listen);
      return seen;
    },
  };
}

describe("RichText headings, lists and relative links", () => {
  it("reads a heading line only at a line's start, as a bold paragraph, never an h tag", () => {
    expect(markup("## Итоги квартала\nВыручка выросла")).toBe(
      "<p><strong>Итоги квартала</strong></p><p>Выручка выросла</p>",
    );
    expect(markup("Задача #12 и ## не заголовок\n#тег")).toBe(
      "<p>Задача #12 и ## не заголовок\n#тег</p>",
    );
    const { container } = render(<RichText labels={LABELS} source="# Сделки" />);
    expect(container.querySelector("h1, h2, h3, h4, h5, h6, [role='heading']")).toBeNull();
  });

  it("reads `- ` and `* ` bullets and `1. ` numbers as lists, a `-` mid-line as text", () => {
    expect(markup("Открыто:\n- Вектор\n- Альфа\nИтого 2 - всё")).toBe(
      "<p>Открыто:</p><ul><li>Вектор</li><li>Альфа</li></ul><p>Итого 2 - всё</p>",
    );
    expect(markup("* один\n* два")).toBe("<ul><li>один</li><li>два</li></ul>");
    expect(markup("-5 °C и --- и -")).toBe("<p>-5 °C и --- и -</p>");
    expect(markup("- а\n* б\n1. в")).toBe(
      "<ul><li>а</li></ul><ul><li>б</li></ul><ol><li>в</li></ol>",
    );
  });

  it("starts a numbered list at its first number and keeps a blank line inside one list", () => {
    const { container } = render(
      <RichText labels={LABELS} source={"3. Счёт\n\n4. Акт\n9. Отгрузка"} />,
    );
    const list = container.querySelector("ol");
    expect(list).toHaveAttribute("start", "3");
    expect(list?.querySelectorAll("li")).toHaveLength(3);
    const first = render(<RichText labels={LABELS} source="1. Счёт" />).container;
    expect(first.querySelector("ol")).not.toHaveAttribute("start");
  });

  it("renders emphasis and links inside items and headings", () => {
    expect(markup("# Сделка **№ 12**\n- **Вектор** _в работе_\n- [открыть](/sales/deals/12)")).toBe(
      "<p><strong>Сделка <strong>№ 12</strong></strong></p>" +
        "<ul><li><strong>Вектор</strong> <em>в работе</em></li>" +
        '<li><a href="/sales/deals/12">открыть</a></li></ul>',
    );
  });

  it("puts `end` at the end of the last item", () => {
    const { container } = render(
      <RichText labels={LABELS} source={"- раз\n- два"} end={<i data-end="" />} />,
    );
    expect(container.querySelector("li:last-child")?.lastElementChild).toHaveAttribute("data-end");
    expect(container.querySelectorAll("p")).toHaveLength(0);
  });

  it("links relative addresses on the same origin only", () => {
    expect(markup("[a](/sales/deals/12) [b](./x) [c](../y) [d](#итог) [e](?tab=1)")).toBe(
      '<p><a href="/sales/deals/12">a</a> <a href="./x">b</a> <a href="../y">c</a> ' +
        '<a href="#итог">d</a> <a href="?tab=1">e</a></p>',
    );
    for (const unsafe of ["//evil.app/x", "/\\evil.app", "javascript:alert(1)", "deals/12"]) {
      expect(markup(`[x](${unsafe})`)).toBe(`<p>[x](${unsafe})</p>`);
    }
  });

  it("opens a relative link in the same tab and an absolute one in a new tab", () => {
    const { getByRole } = render(
      <RichText labels={LABELS} source="[сделка](/sales/deals/12) и [сайт](https://prime.app)" />,
    );
    const inside = getByRole("link", { name: "сделка" });
    expect(inside).not.toHaveAttribute("target");
    expect(inside).not.toHaveAttribute("rel");
    expect(getByRole("link", { name: "сайт" })).toHaveAttribute("target", "_blank");
  });

  it("calls `onLinkClick` with the address; a modified press is the browser's", () => {
    const routed: string[] = [];
    const { getByRole } = render(
      <RichText
        labels={LABELS}
        source="[сделка](/sales/deals/12)"
        onLinkClick={(href, event) => {
          routed.push(href);
          event.preventDefault();
        }}
      />,
    );
    const followed = followedClicks();
    const link = getByRole("link", { name: "сделка" });
    fireEvent.click(link);
    expect(routed).toEqual(["/sales/deals/12"]);
    fireEvent.click(link, { metaKey: true });
    fireEvent.click(link, { ctrlKey: true });
    expect(routed).toEqual(["/sales/deals/12"]);
    expect(followed.stop()).toEqual([false, true, true]);
  });

  it("follows the link without `onLinkClick`", () => {
    const { getByRole } = render(<RichText labels={LABELS} source="[сделка](/sales/deals/12)" />);
    const followed = followedClicks();
    fireEvent.click(getByRole("link"));
    expect(followed.stop()).toEqual([true]);
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

describe("getTextEntities of headings and lists", () => {
  it("writes a heading as its text in bold and keeps list markers as text", () => {
    expect(getTextEntities("# Итог\n- **Вектор**\n3. Альфа\n4. Бета")).toEqual({
      text: "Итог\n- Вектор\n3. Альфа\n4. Бета",
      entities: [
        { type: "bold", offset: 0, length: 4 },
        { type: "bold", offset: 7, length: 6 },
      ],
    });
  });

  it("keeps a relative link's address", () => {
    expect(getTextEntities("[сделка](/sales/deals/12)")).toEqual({
      text: "сделка",
      entities: [{ type: "link", offset: 0, length: 6, url: "/sales/deals/12" }],
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

  it("escapes text lines that would read as a heading or a list item", () => {
    expect(getRichTextSource({ text: "# 12\n- раз\n* два\n3. три\n#тег - да", entities: [] })).toBe(
      "\\# 12\n\\- раз\n\\* два\n3\\. три\n#тег - да",
    );
    const text = "## итог\n- раз\n10. десять";
    expect(roundTrip(text, [])).toEqual({ text, entities: [] });
  });

  it("drops an italic it cannot hold inside a word, keeping the text", () => {
    expect(
      getRichTextSource({ text: "полеИНН", entities: [{ type: "italic", offset: 0, length: 4 }] }),
    ).toBe("полеИНН");
  });
});
