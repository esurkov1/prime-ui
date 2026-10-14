import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RichText } from "./richText";

const LABELS = { spoiler: "Скрытый текст" };

/**
 * The rendered markup of `source`: tags and text only, links with their href, a masked spoiler as
 * `<spoiler>` (its wrapper spans unwrapped).
 */
function markup(source: string) {
  const { container } = render(<RichText labels={LABELS} source={source} />);
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
