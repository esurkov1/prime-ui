import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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
});
