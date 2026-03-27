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

  it("applies fill layout", () => {
    render(
      <EmptyPage.Root layout="fill" data-testid="empty">
        <EmptyPage.Title>Заголовок</EmptyPage.Title>
      </EmptyPage.Root>,
    );
    expect(screen.getByTestId("empty")).toHaveAttribute("data-layout", "fill");
  });
});
