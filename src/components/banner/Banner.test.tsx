import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Banner } from "./Banner";

describe("Banner", () => {
  it("renders root with content", () => {
    render(
      <Banner.Root>
        <Banner.Content>Content</Banner.Content>
      </Banner.Root>,
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("sets data-status for all statuses", () => {
    const statuses = ["information", "warning", "error", "success", "feature"] as const;

    for (const status of statuses) {
      const { container, unmount } = render(
        <Banner.Root status={status}>
          <Banner.Content>S</Banner.Content>
        </Banner.Root>,
      );
      expect(container.firstElementChild).toHaveAttribute("data-status", status);
      unmount();
    }
  });

  it("defaults variant to filled and status to information", () => {
    const { container } = render(
      <Banner.Root>
        <Banner.Content>X</Banner.Content>
      </Banner.Root>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-variant", "filled");
    expect(container.firstElementChild).toHaveAttribute("data-status", "information");
  });

  it("defaults size to m and sets data-size for all sizes", () => {
    const { container, unmount } = render(
      <Banner.Root>
        <Banner.Content>X</Banner.Content>
      </Banner.Root>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-size", "m");
    unmount();

    for (const size of ["s", "m", "l", "xl"] as const) {
      const { container: c, unmount: u } = render(
        <Banner.Root size={size}>
          <Banner.Content>S</Banner.Content>
        </Banner.Root>,
      );
      expect(c.firstElementChild).toHaveAttribute("data-size", size);
      u();
    }
  });

  it("shows dismiss button when onDismiss is passed", () => {
    const onDismiss = vi.fn();
    render(
      <Banner.Root onDismiss={onDismiss}>
        <Banner.Content>Message</Banner.Content>
      </Banner.Root>,
    );

    const dismiss = screen.getByRole("button", { name: "Dismiss" });
    expect(dismiss).toBeInTheDocument();

    fireEvent.click(dismiss);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("hides dismiss button when onDismiss is omitted", () => {
    render(
      <Banner.Root>
        <Banner.Content>No close</Banner.Content>
      </Banner.Root>,
    );
    expect(screen.queryByRole("button", { name: "Dismiss" })).not.toBeInTheDocument();
  });

  it("does not inject dismiss when CloseButton is present", () => {
    const onDismiss = vi.fn();
    render(
      <Banner.Root onDismiss={onDismiss}>
        <Banner.Content>Text</Banner.Content>
        <Banner.CloseButton aria-label="Custom close" type="button" />
      </Banner.Root>,
    );
    expect(screen.queryByRole("button", { name: "Dismiss" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Custom close" })).toBeInTheDocument();
  });

  it("renders Icon, Title, Description, Actions inside Content", () => {
    render(
      <Banner.Root>
        <Banner.Content>
          <Banner.Icon>
            <svg data-testid="banner-icon" />
          </Banner.Icon>
          <Banner.Title>Title text</Banner.Title>
          <Banner.Description>Description text</Banner.Description>
          <Banner.Actions>
            <button type="button">Action</button>
          </Banner.Actions>
        </Banner.Content>
      </Banner.Root>,
    );

    expect(screen.getByTestId("banner-icon")).toBeInTheDocument();
    expect(screen.getByText("Title text")).toBeInTheDocument();
    expect(screen.getByText("Description text")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });
});
