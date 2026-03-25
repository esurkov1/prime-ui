import { describe, expect, it } from "vitest";

import { highlightTsxHtml } from "./highlightTsxHtml";

describe("highlightTsxHtml", () => {
  it("escapes HTML and wraps keywords", () => {
    const out = highlightTsxHtml('const x = "<div>"');
    expect(out).toContain("&lt;div&gt;");
    expect(out).toContain('class="prime-tok-k">const</span>');
  });

  it("wraps strings and comments", () => {
    expect(highlightTsxHtml("// hi")).toContain('class="prime-tok-c">// hi</span>');
    expect(highlightTsxHtml('"a"')).toContain('class="prime-tok-s">"a"</span>');
  });

  it("detects JSX-like tags with uppercase name", () => {
    const out = highlightTsxHtml("<Button />");
    expect(out).toContain('class="prime-tok-x">&lt;Button</span>');
  });
});
