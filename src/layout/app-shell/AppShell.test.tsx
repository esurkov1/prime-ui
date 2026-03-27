import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
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
      <MemoryRouter>
        <AppShell.Template nav={<span>sidebar</span>}>
          <span>page</span>
        </AppShell.Template>
      </MemoryRouter>,
    );

    expect(screen.getByText("sidebar")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("page");
  });

  it("Template sets data-layout-template=app on root", () => {
    render(
      <MemoryRouter>
        <AppShell.Template nav={<span>nav</span>}>
          <span>c</span>
        </AppShell.Template>
      </MemoryRouter>,
    );

    expect(screen.getByRole("main").parentElement).toHaveAttribute("data-layout-template", "app");
  });

  it("Template wraps route children in MainInset with data-app-shell-main-inset", () => {
    render(
      <MemoryRouter>
        <AppShell.Template nav={<span>nav</span>}>
          <span>inset-body</span>
        </AppShell.Template>
      </MemoryRouter>,
    );

    expect(document.querySelector("[data-app-shell-main-inset]")).toHaveTextContent("inset-body");
  });
});
