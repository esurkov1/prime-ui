import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("renders nav and main regions", () => {
    render(
      <AppShell.Root>
        <AppShell.Nav aria-label="Nav">aside</AppShell.Nav>
        <AppShell.Main>main body</AppShell.Main>
      </AppShell.Root>,
    );

    expect(screen.getByText("aside")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("main body");
  });

  it("sets data-fill-viewport when fillViewport is true", () => {
    render(
      <AppShell.Root fillViewport>
        <AppShell.Main />
      </AppShell.Root>,
    );

    expect(screen.getByRole("main").parentElement).toHaveAttribute("data-fill-viewport", "true");
  });

  it("merges className on root", () => {
    render(
      <AppShell.Root className="shell-custom">
        <AppShell.Main />
      </AppShell.Root>,
    );

    expect(screen.getByRole("main").parentElement).toHaveClass("shell-custom");
  });

  it("Template composes nav slot and main", () => {
    render(
      <AppShell.Template nav={<span>sidebar</span>}>
        <span>page</span>
      </AppShell.Template>,
    );

    expect(screen.getByText("sidebar")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("page");
  });

  it("Template sets data-layout-template=app on root", () => {
    render(
      <AppShell.Template nav={<span>nav</span>}>
        <span>c</span>
      </AppShell.Template>,
    );

    expect(screen.getByRole("main").parentElement).toHaveAttribute("data-layout-template", "app");
  });
});
