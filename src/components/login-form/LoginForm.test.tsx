import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";

import { LoginForm } from "./LoginForm";

function Sample({ size }: { size?: "xs" | "s" | "m" | "l" | "xl" }) {
  return (
    <LoginForm.Root size={size} data-testid="root">
      <LoginForm.Header>
        <LoginForm.Title>Войти</LoginForm.Title>
        <LoginForm.Description>Данные для входа</LoginForm.Description>
      </LoginForm.Header>
      <LoginForm.Body>
        <LoginForm.Form aria-label="Вход" onSubmit={(e) => e.preventDefault()}>
          <Input.Root label="Email">
            <Input.Wrapper>
              <Input.Field type="email" />
            </Input.Wrapper>
          </Input.Root>
          <Button.Root type="submit">Войти</Button.Root>
        </LoginForm.Form>
        <LoginForm.Footer>Нет аккаунта?</LoginForm.Footer>
      </LoginForm.Body>
    </LoginForm.Root>
  );
}

describe("LoginForm", () => {
  it("renders the title as h1 and the form as a named form landmark", () => {
    render(<Sample />);
    expect(screen.getByRole("heading", { level: 1, name: "Войти" })).toBeInTheDocument();
    expect(screen.getByRole("form", { name: "Вход" })).toBeInTheDocument();
  });

  it("lets the title be a lower heading level", () => {
    render(
      <LoginForm.Root>
        <LoginForm.Title as="h2">Вход</LoginForm.Title>
      </LoginForm.Root>,
    );
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("sets data-size (default m) and data-flat on the root", () => {
    const { rerender } = render(<Sample />);
    expect(screen.getByTestId("root")).toHaveAttribute("data-size", "m");
    expect(screen.getByTestId("root")).toHaveAttribute("data-flat", "false");

    rerender(<Sample size="l" />);
    expect(screen.getByTestId("root")).toHaveAttribute("data-size", "l");

    rerender(
      <LoginForm.Root flat data-testid="root">
        <LoginForm.Title>x</LoginForm.Title>
      </LoginForm.Root>,
    );
    expect(screen.getByTestId("root")).toHaveAttribute("data-flat", "true");
  });

  it("sets data-align (default start) from align", () => {
    const { rerender } = render(<Sample />);
    expect(screen.getByTestId("root")).toHaveAttribute("data-align", "start");
    rerender(
      <LoginForm.Root align="center" data-testid="root">
        <LoginForm.Title>x</LoginForm.Title>
      </LoginForm.Root>,
    );
    expect(screen.getByTestId("root")).toHaveAttribute("data-align", "center");
  });

  it("changes the title text role with the size", () => {
    const { rerender } = render(<Sample size="s" />);
    const small = screen.getByRole("heading").getAttribute("data-variant");
    rerender(<Sample size="xl" />);
    expect(screen.getByRole("heading").getAttribute("data-variant")).not.toBe(small);
  });

  it("submits through Enter and the submit button, with typed values", () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <LoginForm.Root>
        <LoginForm.Form aria-label="Вход" onSubmit={onSubmit}>
          <Input.Root label="Email">
            <Input.Wrapper>
              <Input.Field type="email" />
            </Input.Wrapper>
          </Input.Root>
          <Button.Root type="submit">Войти</Button.Root>
        </LoginForm.Form>
      </LoginForm.Root>,
    );
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@b.ru" } });
    fireEvent.click(screen.getByRole("button", { name: "Войти" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("forwards refs and extra classes", () => {
    const rootRef = { current: null as HTMLDivElement | null };
    const formRef = { current: null as HTMLFormElement | null };
    render(
      <LoginForm.Root ref={rootRef} className="custom">
        <LoginForm.Form ref={formRef} />
      </LoginForm.Root>,
    );
    expect(rootRef.current).toHaveClass("custom");
    expect(formRef.current?.tagName).toBe("FORM");
  });
});
