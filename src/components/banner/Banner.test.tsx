import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import enterMotion from "@/internal/enterMotion.module.css";
import { headerRowStyles } from "@/internal/headerRow";
import { cssRule, cssRules, cssValue } from "@/test/css";
import { withMotion } from "@/test/motion";

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

    for (const size of ["xs", "s", "m", "l", "xl"] as const) {
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

  it("reaches the close button with Tab and dismisses with Enter and Space", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <Banner.Root onDismiss={onDismiss} labels={{ dismiss: "Скрыть объявление" }}>
        <Banner.Content>
          <Banner.Title>Тёмная тема</Banner.Title>
        </Banner.Content>
      </Banner.Root>,
    );

    await user.tab();
    const close = screen.getByRole("button", { name: "Скрыть объявление" });
    expect(close).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onDismiss).toHaveBeenCalledTimes(1);
    await user.keyboard(" ");
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });

  it("stands still when it mounts with the page and passes its ref to the block", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(
      <Banner.Root ref={ref}>
        <Banner.Content>X</Banner.Content>
      </Banner.Root>,
    );
    expect(ref.current).toBe(container.firstElementChild);
    expect(ref.current).not.toHaveClass(enterMotion.enter);
  });

  it("enters when it appears on a page already shown", async () => {
    const page = (shown: boolean) => (
      <main>
        {shown ? (
          <Banner.Root data-testid="banner">
            <Banner.Content>Счёт отправлен</Banner.Content>
          </Banner.Root>
        ) : null}
      </main>
    );
    const { rerender } = render(page(false));
    await act(async () => {});
    rerender(page(true));
    expect(screen.getByTestId("banner")).toHaveClass(enterMotion.enter);
  });

  it("hands focus to the next tab stop when it is dismissed", async () => {
    const user = userEvent.setup();
    function Page() {
      const [shown, setShown] = React.useState(true);
      return (
        <>
          {shown ? (
            <Banner.Root onDismiss={() => setShown(false)}>
              <Banner.Content>
                <Banner.Title>Тёмная тема</Banner.Title>
              </Banner.Content>
            </Banner.Root>
          ) : null}
          <button type="button">Открыть заказы</button>
        </>
      );
    }
    render(<Page />);
    await user.tab();
    await user.keyboard("{Enter}");
    expect(screen.queryByText("Тёмная тема")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Открыть заказы" })).toHaveFocus();
  });

  it("closes up in place when its parent unmounts it", async () => {
    const motion = withMotion();
    const { container, rerender } = render(
      <div>
        <Banner.Root>
          <Banner.Content>Квартал закрыт</Banner.Content>
        </Banner.Root>
      </div>,
    );
    const host = container.firstElementChild as HTMLElement;
    rerender(<div />);
    await Promise.resolve();
    const ghost = host.firstElementChild as HTMLElement;
    expect(ghost).toHaveAttribute("data-leaving");
    expect(ghost).toHaveAttribute("aria-hidden", "true");
    expect(ghost).toHaveTextContent("Квартал закрыт");
    const [glide] = motion.on(ghost);
    expect((glide.keyframes as Keyframe[])[1]).toMatchObject({ opacity: 0, height: "0px" });
    glide.finish();
    expect(host.children).toHaveLength(0);
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
    // With actions the dismiss ends their row, lined up with the other buttons.
    expect(root.children).toHaveLength(1);
    expect(root.children[0]).toHaveClass(styles.content);
    const close = within(root.children[0] as HTMLElement).getByRole("button", { name: "Закрыть" });
    expect(close.parentElement).toHaveClass(styles.actions);
    expect(close.parentElement?.lastElementChild).toBe(close);
    expect(screen.getByTestId("icon")).toHaveClass(styles.icon);
    expect(screen.getByText("Пробный период закончится 12 октября")).toHaveClass(
      headerRowStyles.title,
    );
    expect(screen.getByText("Выберите тариф.")).toHaveClass(styles.description);
    expect(screen.getByRole("button", { name: "Выбрать тариф" }).parentElement).toHaveClass(
      styles.actions,
    );
  });

  it("ends the row with a lone close button when there are no actions", () => {
    const { container } = render(
      <Banner.Root onDismiss={() => {}}>
        <Banner.Content>
          <Banner.Title>Изменения сохранены</Banner.Title>
        </Banner.Content>
      </Banner.Root>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.children).toHaveLength(1);
    const close = screen.getByRole("button", { name: "Закрыть" });
    expect(close.parentElement).toHaveClass(headerRowStyles.end);
    expect(close.parentElement?.parentElement).toBe(root.children[0]);
    expect(close).toHaveAttribute("data-variant", "ghost");
    // Takes the banner's text color from the host, so it reads on solid fills.
    expect(close).toHaveAttribute("data-tone", "inherit");
    // The banner's frame tier (m): as tall as the fields of the same surface.
    expect(close).toHaveAttribute("data-size", "m");
  });
});

describe("Banner narrow layout", () => {
  it("wraps only a banner that is its own size container (has actions)", () => {
    const css = "src/components/banner/Banner.module.css";
    const rules = cssRules(css).filter((rule) =>
      rule.parents.some((parent) => parent.startsWith("@container")),
    );
    expect(rules.length).toBeGreaterThan(0);
    const wrapping = rules.filter((rule) =>
      rule.decls.some((decl) => decl.prop === "flex-wrap" && decl.value === "wrap"),
    );
    expect(wrapping.length).toBeGreaterThan(0);
    for (const rule of wrapping) expect(rule.selector).toContain(":has(> .actions)");
    expect(cssValue(cssRule(css, ".root:has(.actions)"), "container-type")).toBe("inline-size");
  });
});
