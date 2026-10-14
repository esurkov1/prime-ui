import * as React from "react";
import { describe, expect, it } from "vitest";

import { flattenChildren, isPart, splitParts } from "./parts";

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
