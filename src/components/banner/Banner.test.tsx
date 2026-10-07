import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Banner } from "./Banner";
import styles from "./Banner.module.css";

describe("Banner", () => {
  it("renders root with content", () => {
    render(
      <Banner.Root>
        <Banner.Content>Content</Banner.Content>
      </Banner.Root>,
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("sets data-tone and data-variant", () => {
    const tones = ["neutral", "accent", "info", "warning", "danger", "success"] as const;

    for (const tone of tones) {
      for (const variant of ["soft", "solid", "outline"] as const) {
        const { container, unmount } = render(
          <Banner.Root tone={tone} variant={variant}>
            <Banner.Content>S</Banner.Content>
          </Banner.Root>,
        );
        expect(container.firstElementChild).toHaveAttribute("data-tone", tone);
        expect(container.firstElementChild).toHaveAttribute("data-variant", variant);
        unmount();
      }
    }
  });

  it("defaults variant to soft and tone to info", () => {
    const { container } = render(
      <Banner.Root>
        <Banner.Content>X</Banner.Content>
      </Banner.Root>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-variant", "soft");
    expect(container.firstElementChild).toHaveAttribute("data-tone", "info");
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

    const dismiss = screen.getByRole("button", { name: "Закрыть" });
    expect(dismiss).toBeInTheDocument();

    fireEvent.click(dismiss);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("takes the close button name from labels", () => {
    render(
      <Banner.Root onDismiss={() => {}} labels={{ dismiss: "Скрыть" }}>
        <Banner.Content>Message</Banner.Content>
      </Banner.Root>,
    );
    expect(screen.getByRole("button", { name: "Скрыть" })).toBeInTheDocument();
  });

  it("hides dismiss button when onDismiss is omitted", () => {
    render(
      <Banner.Root>
        <Banner.Content>No close</Banner.Content>
      </Banner.Root>,
    );
    expect(screen.queryByRole("button", { name: "Закрыть" })).not.toBeInTheDocument();
  });

  it("renders Icon, Title, Description, Actions inside Content", () => {
    render(
      <Banner.Root>
        <Banner.Content>
          <Banner.Icon data-testid="banner-icon">
            <svg />
          </Banner.Icon>
          <Banner.Title>Title text</Banner.Title>
          <Banner.Description>Description text</Banner.Description>
          <Banner.Actions>
            <button type="button">Action</button>
          </Banner.Actions>
        </Banner.Content>
      </Banner.Root>,
    );

    expect(screen.getByTestId("banner-icon")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Title text")).toBeInTheDocument();
    expect(screen.getByText("Description text")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  it("defaults placement to inset and sets page placement", () => {
    const { container, rerender } = render(
      <Banner.Root>
        <Banner.Content>X</Banner.Content>
      </Banner.Root>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-placement", "inset");
    rerender(
      <Banner.Root placement="page">
        <Banner.Content>X</Banner.Content>
      </Banner.Root>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-placement", "page");
  });

  it("moves dismiss into the actions row as the last square button when actions exist", () => {
    const { container } = render(
      <Banner.Root onDismiss={() => {}}>
        <Banner.Content>
          <Banner.Icon data-testid="icon" />
          <Banner.Title>Пробный период закончится 12 октября</Banner.Title>
          <Banner.Description>Выберите тариф.</Banner.Description>
          <Banner.Actions>
            <button type="button">Выбрать тариф</button>
          </Banner.Actions>
        </Banner.Content>
      </Banner.Root>,
    );
    const root = container.firstElementChild as HTMLElement;
    // With actions there is no corner close: dismiss lines up with the other buttons.
    expect(root.children).toHaveLength(1);
    expect(root.children[0]).toHaveClass(styles.content);
    const close = screen.getByRole("button", { name: "Закрыть" });
    expect(close).toHaveClass(styles.actionsClose);
    expect(close.parentElement).toHaveClass(styles.actions);
    expect(screen.getByTestId("icon")).toHaveClass(styles.icon);
    expect(screen.getByText("Пробный период закончится 12 октября")).toHaveClass(styles.title);
    expect(screen.getByText("Выберите тариф.")).toHaveClass(styles.description);
    expect(screen.getByRole("button", { name: "Выбрать тариф" }).parentElement).toHaveClass(
      styles.actions,
    );
  });

  it("keeps the small corner close when there are no actions", () => {
    const { container } = render(
      <Banner.Root onDismiss={() => {}}>
        <Banner.Content>
          <Banner.Title>Изменения сохранены</Banner.Title>
        </Banner.Content>
      </Banner.Root>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.children).toHaveLength(2);
    expect(root.children[1]).toHaveClass(styles.close);
    expect(root.children[1]).toHaveAttribute("data-variant", "ghost");
    // Takes the banner's text color from the host, so it reads on solid fills.
    expect(root.children[1]).toHaveAttribute("data-tone", "inherit");
    expect(root.children[1]).toHaveAttribute("data-size", "xs");
  });
});
