import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PageShell } from "./PageShell";

describe("PageShell", () => {
  it("renders nav and content regions", () => {
    render(
      <PageShell.Root>
        <PageShell.NavArea aria-label="Nav">aside</PageShell.NavArea>
        <PageShell.ContentArea>main body</PageShell.ContentArea>
      </PageShell.Root>,
    );

    expect(screen.getByText("aside")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("main body");
  });

  it("sets data-fill-viewport when fillViewport is true", () => {
    render(
      <PageShell.Root fillViewport>
        <PageShell.ContentArea />
      </PageShell.Root>,
    );

    expect(screen.getByRole("main").parentElement).toHaveAttribute("data-fill-viewport", "true");
  });

  it("merges className on root", () => {
    render(
      <PageShell.Root className="shell-custom">
        <PageShell.ContentArea />
      </PageShell.Root>,
    );

    expect(screen.getByRole("main").parentElement).toHaveClass("shell-custom");
  });

  it("Application composes nav slot and main", () => {
    render(
      <PageShell.Application nav={<span>sidebar</span>}>
        <span>page</span>
      </PageShell.Application>,
    );

    expect(screen.getByText("sidebar")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("page");
  });
});
