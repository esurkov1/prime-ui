import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import enterMotion from "@/internal/enterMotion.module.css";

import { EmptyPage } from "./EmptyPage";

describe("EmptyPage", () => {
  it("renders title and description", () => {
    render(
      <EmptyPage.Root data-testid="empty">
        <EmptyPage.Title>Нет данных</EmptyPage.Title>
        <EmptyPage.Description>Добавьте записи, чтобы увидеть список.</EmptyPage.Description>
      </EmptyPage.Root>,
    );
    expect(screen.getByTestId("empty")).toHaveAttribute("data-size", "m");
    expect(screen.getByRole("heading", { level: 2, name: "Нет данных" })).toBeInTheDocument();
    expect(screen.getByText("Добавьте записи, чтобы увидеть список.")).toBeInTheDocument();
  });

  it("takes the host tier without its own size and hides the decorative icon tile", () => {
    render(
      <ControlSizeProvider value="s">
        <EmptyPage.Root data-testid="empty">
          <EmptyPage.Icon data-testid="tile">
            <svg />
          </EmptyPage.Icon>
          <EmptyPage.Title>Нет данных</EmptyPage.Title>
        </EmptyPage.Root>
      </ControlSizeProvider>,
    );
    expect(screen.getByTestId("empty")).toHaveAttribute("data-size", "s");
    expect(screen.getByTestId("tile")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders the title with the tag from `as`", () => {
    render(
      <EmptyPage.Root>
        <EmptyPage.Title as="p">Ничего не найдено</EmptyPage.Title>
        <EmptyPage.Title as="h3">Заказов нет</EmptyPage.Title>
      </EmptyPage.Root>,
    );
    expect(screen.queryByRole("heading", { name: "Ничего не найдено" })).toBeNull();
    expect(screen.getByText("Ничего не найдено").tagName).toBe("P");
    expect(screen.getByRole("heading", { level: 3, name: "Заказов нет" })).toBeInTheDocument();
  });

  it("marks the compact layout and leaves the default one unmarked", () => {
    const { rerender } = render(
      <EmptyPage.Root layout="compact" data-testid="empty">
        <EmptyPage.Title>Ничего не найдено</EmptyPage.Title>
      </EmptyPage.Root>,
    );
    expect(screen.getByTestId("empty")).toHaveAttribute("data-layout", "compact");
    rerender(
      <EmptyPage.Root data-testid="empty">
        <EmptyPage.Title>Ничего не найдено</EmptyPage.Title>
      </EmptyPage.Root>,
    );
    expect(screen.getByTestId("empty")).not.toHaveAttribute("data-layout");
  });

  it("parts rise in on first render, but not in the compact layout", () => {
    const { rerender } = render(
      <EmptyPage.Root data-testid="empty">
        <EmptyPage.Title>Нет данных</EmptyPage.Title>
      </EmptyPage.Root>,
    );
    expect(screen.getByTestId("empty")).toHaveClass(enterMotion.enterBaseChildren);
    rerender(
      <EmptyPage.Root layout="compact" data-testid="empty">
        <EmptyPage.Title>Нет данных</EmptyPage.Title>
      </EmptyPage.Root>,
    );
    expect(screen.getByTestId("empty")).not.toHaveClass(enterMotion.enterBaseChildren);
  });

  it("applies fill layout", () => {
    render(
      <EmptyPage.Root layout="fill" data-testid="empty">
        <EmptyPage.Title>Заголовок</EmptyPage.Title>
      </EmptyPage.Root>,
    );
    expect(screen.getByTestId("empty")).toHaveAttribute("data-layout", "fill");
  });

  it("sets icon tone, neutral by default", () => {
    render(
      <EmptyPage.Root>
        <EmptyPage.Icon data-testid="a">i</EmptyPage.Icon>
        <EmptyPage.Icon data-testid="b" tone="danger">
          i
        </EmptyPage.Icon>
      </EmptyPage.Root>,
    );
    expect(screen.getByTestId("a")).toHaveAttribute("data-tone", "neutral");
    expect(screen.getByTestId("b")).toHaveAttribute("data-tone", "danger");
  });

  it("puts the icon tile on the tier scale; the compact state takes the smallest tile", () => {
    render(
      <>
        <EmptyPage.Root size="l">
          <EmptyPage.Icon data-testid="large">i</EmptyPage.Icon>
        </EmptyPage.Root>
        <EmptyPage.Root size="l" layout="compact">
          <EmptyPage.Icon data-testid="compact">i</EmptyPage.Icon>
        </EmptyPage.Root>
      </>,
    );
    expect(screen.getByTestId("large")).toHaveAttribute("data-size", "l");
    expect(screen.getByTestId("compact")).toHaveAttribute("data-size", "xs");
  });
});

describe("EmptyPage error state", () => {
  it("announces a danger root and gives its tone to the icon", () => {
    render(
      <EmptyPage.Root tone="danger" data-testid="error">
        <EmptyPage.Icon data-testid="icon">!</EmptyPage.Icon>
        <EmptyPage.Title as="h3">Не удалось загрузить заказы</EmptyPage.Title>
      </EmptyPage.Root>,
    );
    expect(screen.getByRole("alert")).toBe(screen.getByTestId("error"));
    expect(screen.getByTestId("error")).toHaveAttribute("data-tone", "danger");
    expect(screen.getByTestId("icon")).toHaveAttribute("data-tone", "danger");
    expect(
      screen.getByRole("heading", { level: 3, name: "Не удалось загрузить заказы" }),
    ).toBeInTheDocument();
  });

  it("keeps a role the owner passes", () => {
    render(<EmptyPage.Root tone="danger" role="status" data-testid="error" />);
    expect(screen.getByTestId("error")).toHaveAttribute("role", "status");
  });

  it("retries from the keyboard and shows loading while the retry is pending", async () => {
    const user = userEvent.setup();
    let reject: (reason: unknown) => void = () => {};
    const onRetry = vi.fn(
      () =>
        new Promise<void>((_, fail) => {
          reject = fail;
        }),
    );
    render(
      <EmptyPage.Root tone="danger" labels={{ retry: "Загрузить снова" }}>
        <EmptyPage.Actions>
          <EmptyPage.RetryButton onRetry={onRetry} />
        </EmptyPage.Actions>
      </EmptyPage.Root>,
    );
    const button = screen.getByRole("button", { name: "Загрузить снова" });
    button.focus();
    await user.keyboard("{Enter}");
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute("aria-busy", "true");
    await user.keyboard("{Enter}");
    expect(onRetry).toHaveBeenCalledTimes(1);
    await act(async () => reject(new Error("offline")));
    expect(button).not.toHaveAttribute("aria-busy");
    await user.keyboard(" ");
    expect(onRetry).toHaveBeenCalledTimes(2);
  });

  it("takes a synchronous retry and its default label", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <EmptyPage.Root tone="danger">
        <EmptyPage.RetryButton onRetry={onRetry} />
      </EmptyPage.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Повторить" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
