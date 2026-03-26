import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ScrollContainer } from "./ScrollContainer";

describe("ScrollContainer", () => {
  it("рендерит дочерний контент", () => {
    render(<ScrollContainer>scroll-me</ScrollContainer>);
    expect(screen.getByText("scroll-me")).toBeInTheDocument();
  });

  it("поддерживает as=main", () => {
    render(<ScrollContainer as="main">main</ScrollContainer>);
    expect(screen.getByRole("main")).toHaveTextContent("main");
  });
});
