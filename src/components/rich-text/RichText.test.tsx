import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { RichText } from "./RichText";

describe("RichText", () => {
  it("renders the Markdown subset as elements in a div, never as HTML", () => {
    const { container } = render(
      <RichText>
        {"**Счёт** выставлен: [открыть](https://prime.app/i/1)\n> до пятницы <b>"}
      </RichText>,
    );
    const root = container.firstElementChild;
    expect(root?.tagName).toBe("DIV");
    expect(root?.querySelector("strong")).toHaveTextContent("Счёт");
    expect(screen.getByRole("link", { name: "открыть" })).toHaveAttribute(
      "href",
      "https://prime.app/i/1",
    );
    expect(root?.querySelector("blockquote")).toHaveTextContent("до пятницы <b>");
    expect(root?.querySelector("b")).toBeNull();
  });

  it("passes className, native attributes and ref to the root", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <RichText ref={ref} className="note" data-testid="text" id="welcome">
        текст
      </RichText>,
    );
    const root = screen.getByTestId("text");
    expect(ref.current).toBe(root);
    expect(root).toHaveClass("note");
    expect(root).toHaveAttribute("id", "welcome");
  });

  it("masks a spoiler as a button named by labels until it is pressed", () => {
    render(<RichText labels={{ spoiler: "Спойлер" }}>{"Код: ||4821||"}</RichText>);
    fireEvent.click(screen.getByRole("button", { name: "Спойлер" }));
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText("4821")).toBeInTheDocument();
  });

  it("Enter and Space reveal a spoiler and move the focus onto its text", () => {
    render(<RichText>{"||первый|| и ||второй||"}</RichText>);
    const [first, second] = screen.getAllByRole("button", { name: "Скрытый текст" });
    first.focus();
    fireEvent.keyDown(first, { key: "Enter" });
    expect(screen.getByText("первый")).toHaveFocus();
    second.focus();
    fireEvent.keyDown(second, { key: " " });
    expect(screen.getByText("второй")).toHaveFocus();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
