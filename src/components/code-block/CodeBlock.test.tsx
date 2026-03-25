import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CodeBlock } from "./CodeBlock";

describe("CodeBlock", () => {
  it("renders highlighted code", () => {
    const { container } = render(<CodeBlock.Root code="const a = 1" colorScheme="light" />);
    const pre = container.querySelector("pre");
    expect(pre).toBeTruthy();
    expect(pre?.innerHTML).toContain("prime-tok-k");
  });
});
