import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PageContent } from "./PageContent";

describe("PageContent", () => {
  it("renders title, description, and body", () => {
    render(
      <PageContent.Root>
        <PageContent.Header>
          <PageContent.Title>Заголовок</PageContent.Title>
          <PageContent.Description>Краткое описание страницы.</PageContent.Description>
        </PageContent.Header>
        <PageContent.Body>
          <span>Контент</span>
        </PageContent.Body>
      </PageContent.Root>,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Заголовок");
    expect(screen.getByText("Краткое описание страницы.")).toBeInTheDocument();
    expect(screen.getByText("Контент")).toBeInTheDocument();
  });

  it("sets data-max-width for readable and wide", () => {
    const { rerender, container } = render(
      <PageContent.Root maxWidth="readable">
        <PageContent.Body />
      </PageContent.Root>,
    );

    expect(container.firstChild).toHaveAttribute("data-max-width", "readable");

    rerender(
      <PageContent.Root maxWidth="wide">
        <PageContent.Body />
      </PageContent.Root>,
    );
    expect(container.firstChild).toHaveAttribute("data-max-width", "wide");
  });

  it("does not set data-max-width for full width", () => {
    const { container } = render(
      <PageContent.Root maxWidth="full">
        <PageContent.Body />
      </PageContent.Root>,
    );

    expect(container.firstChild).not.toHaveAttribute("data-max-width");
  });

  it("renders Section as semantic region", () => {
    render(
      <PageContent.Section aria-label="Doc">
        <PageContent.Header>
          <PageContent.Title>Doc</PageContent.Title>
        </PageContent.Header>
      </PageContent.Section>,
    );

    expect(document.querySelector("section")).toHaveAttribute("aria-label", "Doc");
  });

  it("sets data-measure on Description when measure is full", () => {
    render(<PageContent.Description measure="full">Wide lead</PageContent.Description>);

    expect(screen.getByText("Wide lead")).toHaveAttribute("data-measure", "full");
  });

  it("places Actions next to the heading block", () => {
    render(
      <PageContent.Header data-testid="header">
        <PageContent.Title>Projects</PageContent.Title>
        <PageContent.Description>All projects</PageContent.Description>
        <PageContent.Actions>
          <button type="button">New project</button>
        </PageContent.Actions>
      </PageContent.Header>,
    );

    const header = screen.getByTestId("header");
    expect(header).toHaveAttribute("data-has-actions", "true");
    const [heading, actions] = Array.from(header.children);
    expect(heading).toContainElement(screen.getByRole("heading", { level: 1 }));
    expect(heading).not.toContainElement(screen.getByRole("button", { name: "New project" }));
    expect(actions).toContainElement(screen.getByRole("button", { name: "New project" }));
  });
});
