import { describe, expect, it } from "vitest";

import { highlightTsx } from "./highlightTsx";

type TsxToken = ReturnType<typeof highlightTsx>[number];

const kinds = (tokens: TsxToken[]) => tokens.filter((token) => token.kind !== "text");

describe("highlightTsx", () => {
  it("joins back into the source", () => {
    const source = 'const total = 1_200 + 3e-2; // сумма\n<Button size="s" />';
    expect(
      highlightTsx(source)
        .map((token) => token.text)
        .join(""),
    ).toBe(source);
  });

  it("keeps markup as text, never as HTML", () => {
    expect(highlightTsx('const x = "<div>"')).toEqual([
      { kind: "keyword", text: "const" },
      { kind: "text", text: " x = " },
      { kind: "string", text: '"<div>"' },
    ]);
  });

  it("reads comments and strings", () => {
    expect(highlightTsx("// hi")).toEqual([{ kind: "comment", text: "// hi" }]);
    expect(highlightTsx("/* a */ b")[0]).toEqual({ kind: "comment", text: "/* a */" });
    expect(highlightTsx("'a\\'b'")).toEqual([{ kind: "string", text: "'a\\'b'" }]);
  });

  it("reads JSX tags with an uppercase or intrinsic name", () => {
    expect(kinds(highlightTsx("<Button />"))).toEqual([{ kind: "tag", text: "<Button" }]);
    expect(kinds(highlightTsx("</div>"))).toEqual([{ kind: "tag", text: "</div" }]);
    expect(kinds(highlightTsx("a < b"))).toEqual([]);
  });

  describe("numbers", () => {
    it("takes a sign only after an exponent", () => {
      expect(kinds(highlightTsx("1-2"))).toEqual([
        { kind: "number", text: "1" },
        { kind: "number", text: "2" },
      ]);
      expect(kinds(highlightTsx("x = 4+5"))).toEqual([
        { kind: "number", text: "4" },
        { kind: "number", text: "5" },
      ]);
      expect(kinds(highlightTsx("1e-3 + 2E+4"))).toEqual([
        { kind: "number", text: "1e-3" },
        { kind: "number", text: "2E+4" },
      ]);
    });

    it("reads fractions, separators, hex and bigint", () => {
      expect(kinds(highlightTsx("0.25 1_000 0xFF 10n"))).toEqual([
        { kind: "number", text: "0.25" },
        { kind: "number", text: "1_000" },
        { kind: "number", text: "0xFF" },
        { kind: "number", text: "10n" },
      ]);
    });

    it("leaves digits inside a name to the name", () => {
      expect(kinds(highlightTsx("h1 x2"))).toEqual([]);
    });
  });
});
