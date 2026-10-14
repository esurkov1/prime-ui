import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import {
  flattenChildren,
  isPart,
  labelPlainText,
  splitParts,
  useTextPartId,
  useTextParts,
} from "./parts";

function Chips(props: { children?: React.ReactNode }) {
  return <div>{props.children}</div>;
}
function Action() {
  return <button type="button">Удалить</button>;
}

describe("parts", () => {
  it("isPart compares element types", () => {
    expect(isPart(<Chips />, Chips)).toBe(true);
    expect(isPart(<Action />, Chips)).toBe(false);
    expect(isPart("Chips", Chips)).toBe(false);
  });

  it("flattenChildren opens fragments with unique keys and drops empty nodes", () => {
    const nodes = flattenChildren(
      <>
        <Chips key="a" />
        {null}
        {false}
        <React.Fragment key="group">
          <Action key="a" />
        </React.Fragment>
      </>,
    );
    expect(nodes).toHaveLength(2);
    const keys = nodes.map((node) => (React.isValidElement(node) ? node.key : null));
    expect(new Set(keys).size).toBe(2);
    expect(isPart(nodes[1], Action)).toBe(true);
  });

  it("splitParts keeps the written order of both sides", () => {
    const { parts, rest } = splitParts(
      [<Chips key="1" />, "Счета", <Action key="2" />, <Chips key="3" />],
      Chips,
    );
    expect(parts.map((part) => part.key)).toEqual([".$1", ".$3"]);
    expect(rest).toHaveLength(2);
    const both = splitParts([<Chips key="1" />, <Action key="2" />, "Счета"], Chips, Action);
    expect(both.parts).toHaveLength(2);
    expect(both.rest).toEqual(["Счета"]);
  });
});

describe("labelPlainText", () => {
  it("wraps text children in the label part and leaves the rest", () => {
    function Label({ children }: { children: React.ReactNode }) {
      return <b>{children}</b>;
    }
    const out = React.Children.toArray(labelPlainText(["Счета", " ", <i key="i">3</i>], Label));
    expect(isPart(out[0], Label)).toBe(true);
    expect(out[1]).toBe(" ");
    expect(isPart(out[2], "i")).toBe(true);
  });
});

describe("useTextParts", () => {
  function Part({
    part,
    children,
  }: {
    part: Parameters<typeof useTextPartId>[0];
    children: React.ReactNode;
  }) {
    return <span id={useTextPartId(part)}>{children}</span>;
  }
  function Item({ children }: { children: React.ReactNode }) {
    const parts = useTextParts();
    return (
      <button type="button" aria-labelledby={parts.labelledBy} aria-describedby={parts.describedBy}>
        {parts.provide(children)}
      </button>
    );
  }

  it("names a two-line item by its label and count and describes it by the second line", () => {
    render(
      <Item>
        <Part part="label">Счета</Part>
        <Part part="count">3</Part>
        <Part part="description">за квартал</Part>
      </Item>,
    );
    const item = screen.getByRole("button", { name: "Счета 3" });
    expect(item).toHaveAccessibleDescription("за квартал");
  });

  it("leaves a one-line item to its content and never points at a missing part", () => {
    const { rerender } = render(
      <Item>
        <Part part="label">Счета</Part>
      </Item>,
    );
    const item = screen.getByRole("button", { name: "Счета" });
    expect(item).not.toHaveAttribute("aria-labelledby");
    expect(item).not.toHaveAttribute("aria-describedby");
    rerender(
      <Item>
        Счета
        <Part part="description">за квартал</Part>
      </Item>,
    );
    expect(item).not.toHaveAttribute("aria-labelledby");
    expect(item).toHaveAccessibleDescription("за квартал");
  });

  it("gives a part outside an item no id", () => {
    render(<Part part="label">Счета</Part>);
    expect(screen.getByText("Счета")).not.toHaveAttribute("id");
  });
});
