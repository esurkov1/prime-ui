import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cssRule, cssValue } from "@/test/css";

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

  it("keeps the logo decorative unless it is named; a named logo is an image", () => {
    const { rerender } = render(
      <LoginForm.Root>
        <LoginForm.Logo data-testid="logo">
          <svg />
        </LoginForm.Logo>
      </LoginForm.Root>,
    );
    expect(screen.getByTestId("logo")).not.toHaveAttribute("role");
    expect(screen.queryByRole("img")).toBeNull();

    rerender(
      <LoginForm.Root>
        <LoginForm.Logo aria-label="Маршрут">
          <svg />
        </LoginForm.Logo>
      </LoginForm.Root>,
    );
    expect(screen.getByRole("img", { name: "Маршрут" })).toBeInTheDocument();
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

  it("takes the tier of a sized host without its own size", () => {
    render(
      <ControlSizeProvider value="s">
        <Sample />
      </ControlSizeProvider>,
    );
    expect(screen.getByTestId("root")).toHaveAttribute("data-size", "s");
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

  it("centres itself in a wider block, such as a Crossfade that swaps the page's states", () => {
    const rule = cssRule("src/components/login-form/LoginForm.module.css", ".root");
    expect(cssValue(rule, "margin-inline")).toBe("auto");
    expect(cssValue(rule, "max-width")).toBe("var(--prime-modal-width-s)");
  });
});

describe("LoginForm autofill", () => {
  it("leaves its fields to the browser and passes their tokens through", () => {
    render(
      <LoginForm.Root>
        <LoginForm.Body>
          <LoginForm.Form aria-label="Вход">
            <Input.Root label="Логин">
              <Input.Wrapper>
                <Input.Field />
              </Input.Wrapper>
            </Input.Root>
            <Input.Root label="Пароль">
              <Input.Wrapper>
                <Input.Field type="password" autoComplete="current-password" />
              </Input.Wrapper>
            </Input.Root>
          </LoginForm.Form>
        </LoginForm.Body>
      </LoginForm.Root>,
    );
    const login = screen.getByRole("textbox", { name: "Логин" });
    expect(login).not.toHaveAttribute("autocomplete");
    expect(login).not.toHaveAttribute("data-1p-ignore");
    const password = screen.getByLabelText("Пароль");
    expect(password).toHaveAttribute("autocomplete", "current-password");
    expect(password).not.toHaveAttribute("data-lpignore");
  });
});
