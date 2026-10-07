import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Input } from "./Input";
import styles from "./Input.module.css";

// ─── Composable API ───────────────────────────────────────────────────────────

describe("Input composable API", () => {
  describe("basic composite render", () => {
    it("renders Root + Wrapper + Field", () => {
      render(
        <Input.Root size="l">
          <Input.Wrapper>
            <Input.Field placeholder="Enter text" />
          </Input.Wrapper>
        </Input.Root>,
      );

      expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
    });

    it("renders with size m by default", () => {
      const { container } = render(
        <Input.Root>
          <Input.Wrapper>
            <Input.Field placeholder="test" />
          </Input.Wrapper>
        </Input.Root>,
      );

      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-size", "m");
    });
  });

  describe("size variants", () => {
    it.each(["m", "l", "xl"] as const)("renders size %s", (size) => {
      const { container } = render(
        <Input.Root size={size}>
          <Input.Wrapper>
            <Input.Field placeholder="test" />
          </Input.Wrapper>
        </Input.Root>,
      );

      const root = container.firstElementChild;
      expect(root).toHaveAttribute("data-size", size);
    });

    it("passes size to Wrapper via context", () => {
      const { container } = render(
        <Input.Root size="xl">
          <Input.Wrapper>
            <Input.Field placeholder="test" />
          </Input.Wrapper>
        </Input.Root>,
      );

      const wrapper = container.querySelector("[data-size='xl']");
      expect(wrapper).not.toBeNull();
    });
  });

  describe("Icon sub-component", () => {
    it("renders start icon with data-side=start", () => {
      render(
        <Input.Root>
          <Input.Wrapper>
            <Input.Icon side="start">
              <svg data-testid="start-icon" />
            </Input.Icon>
            <Input.Field placeholder="test" />
          </Input.Wrapper>
        </Input.Root>,
      );

      const icon = screen.getByTestId("start-icon").parentElement;
      expect(icon).toHaveAttribute("data-side", "start");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("renders end icon with data-side=end", () => {
      render(
        <Input.Root>
          <Input.Wrapper>
            <Input.Field placeholder="test" />
            <Input.Icon side="end">
              <svg data-testid="end-icon" />
            </Input.Icon>
          </Input.Wrapper>
        </Input.Root>,
      );

      const icon = screen.getByTestId("end-icon").parentElement;
      expect(icon).toHaveAttribute("data-side", "end");
    });
  });

  describe("Affix sub-component", () => {
    it("renders start affix with data-side=start", () => {
      render(
        <Input.Root>
          <Input.Wrapper>
            <Input.Affix side="start">https://</Input.Affix>
            <Input.Field placeholder="your-company" />
          </Input.Wrapper>
        </Input.Root>,
      );

      expect(screen.getByText("https://")).toHaveAttribute("data-side", "start");
      expect(screen.getByText("https://")).toHaveAttribute("aria-hidden", "true");
    });

    it("renders end affix with data-side=end", () => {
      render(
        <Input.Root>
          <Input.Wrapper>
            <Input.Field placeholder="your-company" />
            <Input.Affix side="end">.com</Input.Affix>
          </Input.Wrapper>
        </Input.Root>,
      );

      expect(screen.getByText(".com")).toHaveAttribute("data-side", "end");
    });

    it("renders both start and end affixes", () => {
      render(
        <Input.Root>
          <Input.Wrapper>
            <Input.Affix side="start">https://</Input.Affix>
            <Input.Field placeholder="your-company" />
            <Input.Affix side="end">.com</Input.Affix>
          </Input.Wrapper>
        </Input.Root>,
      );

      expect(screen.getByText("https://")).toBeInTheDocument();
      expect(screen.getByText(".com")).toBeInTheDocument();
    });
  });

  describe("InlineAffix sub-component", () => {
    it("renders start inline affix", () => {
      render(
        <Input.Root>
          <Input.Wrapper>
            <Input.InlineAffix side="start">€</Input.InlineAffix>
            <Input.Field placeholder="0.00" />
          </Input.Wrapper>
        </Input.Root>,
      );

      const inlineAffix = screen.getByText("€");
      expect(inlineAffix).toHaveAttribute("data-side", "start");
      expect(inlineAffix).toHaveAttribute("aria-hidden", "true");
    });

    it("renders end inline affix", () => {
      render(
        <Input.Root>
          <Input.Wrapper>
            <Input.Field placeholder="0.00" />
            <Input.InlineAffix side="end">%</Input.InlineAffix>
          </Input.Wrapper>
        </Input.Root>,
      );

      expect(screen.getByText("%")).toHaveAttribute("data-side", "end");
    });
  });

  describe("invalid state", () => {
    it("sets aria-invalid on Field when invalid", () => {
      render(
        <Input.Root invalid>
          <Input.Wrapper>
            <Input.Field placeholder="Email" />
          </Input.Wrapper>
        </Input.Root>,
      );

      expect(screen.getByPlaceholderText("Email")).toHaveAttribute("aria-invalid", "true");
    });

    it("sets data-invalid on Wrapper when invalid", () => {
      const { container } = render(
        <Input.Root invalid>
          <Input.Wrapper>
            <Input.Field placeholder="Email" />
          </Input.Wrapper>
        </Input.Root>,
      );

      const wrapper = container.querySelector(`.${styles.wrapper}`);
      expect(wrapper).toHaveAttribute("data-invalid", "true");
    });

    it("sets aria-invalid when error prop is provided on Root", () => {
      render(
        <Input.Root error="Required field">
          <Input.Wrapper>
            <Input.Field placeholder="Email" />
          </Input.Wrapper>
        </Input.Root>,
      );

      expect(screen.getByPlaceholderText("Email")).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("disabled state", () => {
    it("passes disabled to Field", () => {
      render(
        <Input.Root>
          <Input.Wrapper>
            <Input.Field placeholder="Disabled" disabled />
          </Input.Wrapper>
        </Input.Root>,
      );

      expect(screen.getByPlaceholderText("Disabled")).toBeDisabled();
    });
  });

  describe("label, hint and error props", () => {
    it("renders label linked to Field via htmlFor", () => {
      render(
        <Input.Root label="Email address" id="email">
          <Input.Wrapper>
            <Input.Field placeholder="name@company.com" />
          </Input.Wrapper>
        </Input.Root>,
      );

      const label = screen.getByText("Email address");
      expect(label.tagName).toBe("LABEL");
      expect(label).toHaveAttribute("for", "email");
      expect(screen.getByPlaceholderText("name@company.com")).toHaveAttribute("id", "email");
    });

    it("renders the optional marker from labels.optional", () => {
      render(
        <Input.Root optional labels={{ optional: "(Optional)" }} label="Name">
          <Input.Wrapper>
            <Input.Field placeholder="test" />
          </Input.Wrapper>
        </Input.Root>,
      );

      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("(Optional)")).toBeInTheDocument();
    });

    it("renders hint text with id", () => {
      render(
        <Input.Root hint="Use your work email">
          <Input.Wrapper>
            <Input.Field placeholder="test" />
          </Input.Wrapper>
        </Input.Root>,
      );

      const hint = screen.getByText("Use your work email");
      expect(hint).toBeInTheDocument();
      expect(hint).toHaveAttribute("id");
    });

    it("renders error text with data-invalid", () => {
      render(
        <Input.Root error="This field is required">
          <Input.Wrapper>
            <Input.Field placeholder="test" />
          </Input.Wrapper>
        </Input.Root>,
      );

      const error = screen.getByText("This field is required");
      expect(error).toBeInTheDocument();
      expect(error).toHaveAttribute("data-invalid", "true");
    });
  });

  describe("aria-describedby", () => {
    it("sets aria-describedby from hint id via context", () => {
      render(
        <Input.Root hint="Hint text">
          <Input.Wrapper>
            <Input.Field placeholder="test" />
          </Input.Wrapper>
        </Input.Root>,
      );

      const input = screen.getByPlaceholderText("test");
      const hint = screen.getByText("Hint text");
      const describedBy = input.getAttribute("aria-describedby") ?? "";

      expect(hint).toHaveAttribute("id");
      expect(describedBy).toContain(hint.getAttribute("id"));
    });

    it("sets aria-describedby from error id via context", () => {
      render(
        <Input.Root error="Error text">
          <Input.Wrapper>
            <Input.Field placeholder="test" />
          </Input.Wrapper>
        </Input.Root>,
      );

      const input = screen.getByPlaceholderText("test");
      const error = screen.getByText("Error text");
      const describedBy = input.getAttribute("aria-describedby") ?? "";

      expect(error).toHaveAttribute("id");
      expect(describedBy).toContain(error.getAttribute("id"));
    });

    it("merges context describedBy with extra aria-describedby on Field", () => {
      render(
        <Input.Root hint="Hint">
          <Input.Wrapper>
            <Input.Field placeholder="test" aria-describedby="external-id" />
          </Input.Wrapper>
        </Input.Root>,
      );

      const input = screen.getByPlaceholderText("test");
      const describedBy = input.getAttribute("aria-describedby") ?? "";

      expect(describedBy).toContain("external-id");
      const hint = screen.getByText("Hint");
      expect(describedBy).toContain(hint.getAttribute("id"));
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to the underlying input element", () => {
      const ref = React.createRef<HTMLInputElement>();

      render(
        <Input.Root>
          <Input.Wrapper>
            <Input.Field ref={ref} placeholder="ref-test" />
          </Input.Wrapper>
        </Input.Root>,
      );

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.placeholder).toBe("ref-test");
    });
  });

  describe("context guard", () => {
    it("throws when Field is used outside Root", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

      expect(() => {
        render(<Input.Field placeholder="orphan" />);
      }).toThrow("[prime-ui-kit] `Input` sub-component must be used inside `Input.Root`.");

      consoleSpy.mockRestore();
    });

    it("throws when Wrapper is used outside Root", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

      expect(() => {
        render(
          <Input.Wrapper>
            <span>content</span>
          </Input.Wrapper>,
        );
      }).toThrow("[prime-ui-kit] `Input` sub-component must be used inside `Input.Root`.");

      consoleSpy.mockRestore();
    });
  });
});

describe("Input field system", () => {
  it("required: shows a decorative asterisk and sets native required", () => {
    render(
      <Input.Root label="Email" required>
        <Input.Wrapper>
          <Input.Field placeholder="req" />
        </Input.Wrapper>
      </Input.Root>,
    );
    expect(screen.getByPlaceholderText("req")).toBeRequired();
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByPlaceholderText("req")).toHaveAccessibleName("Email");
  });

  it("optional: renders the default marker", () => {
    render(
      <Input.Root label="Company" optional>
        <Input.Wrapper>
          <Input.Field />
        </Input.Wrapper>
      </Input.Root>,
    );
    expect(screen.getByText("необязательно")).toBeInTheDocument();
  });

  it("error replaces the hint in the same slot", () => {
    render(
      <Input.Root hint="Helper" error="Broken">
        <Input.Wrapper>
          <Input.Field placeholder="swap" />
        </Input.Wrapper>
      </Input.Root>,
    );
    expect(screen.queryByText("Helper")).toBeNull();
    const errorEl = screen.getByText("Broken");
    expect(screen.getByPlaceholderText("swap").getAttribute("aria-describedby")).toBe(errorEl.id);
  });

  it("renders a counter in the support row and flags overflow", () => {
    render(
      <Input.Root counter={<Input.Counter current={12} max={10} />}>
        <Input.Wrapper>
          <Input.Field />
        </Input.Wrapper>
      </Input.Root>,
    );
    expect(screen.getByText("12/10").parentElement).toHaveAttribute("data-invalid", "true");
    expect(screen.getByText("12 из 10 символов")).toBeInTheDocument();
  });

  it("calls onValueChange with the string value alongside onChange", () => {
    const onChange = vi.fn();
    const onValueChange = vi.fn();
    render(
      <Input.Root>
        <Input.Wrapper>
          <Input.Field placeholder="v" onChange={onChange} onValueChange={onValueChange} />
        </Input.Wrapper>
      </Input.Root>,
    );
    fireEvent.change(screen.getByPlaceholderText("v"), { target: { value: "abc" } });
    expect(onChange).toHaveBeenCalledOnce();
    expect(onValueChange).toHaveBeenCalledWith("abc");
  });

  it("takes the clear button name from labels.clear", () => {
    render(
      <Input.Root labels={{ clear: "Clear search" }}>
        <Input.Wrapper>
          <Input.Field defaultValue="x" />
          <Input.ClearButton />
        </Input.Wrapper>
      </Input.Root>,
    );
    expect(screen.getByRole("button", { name: "Clear search" })).toBeInTheDocument();
  });

  it("ClearButton calls onClick and returns focus to the field", () => {
    const onClick = vi.fn();
    render(
      <Input.Root>
        <Input.Wrapper>
          <Input.Field placeholder="clear" defaultValue="x" />
          <Input.ClearButton onClick={onClick} />
        </Input.Wrapper>
      </Input.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Очистить" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByPlaceholderText("clear")).toHaveFocus();
  });
});

describe("Input focusRing", () => {
  it("focusRing={false} marks the wrapper and keeps the invalid state", () => {
    render(
      <Input.Root focusRing={false} invalid>
        <Input.Wrapper>
          <Input.Field aria-label="Поиск" />
        </Input.Wrapper>
      </Input.Root>,
    );
    const wrapper = screen.getByRole("textbox", { name: "Поиск" }).parentElement;
    expect(wrapper).toHaveAttribute("data-focus-ring", "false");
    expect(wrapper).toHaveAttribute("data-invalid", "true");
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("omits the attribute by default", () => {
    render(
      <Input.Root>
        <Input.Wrapper>
          <Input.Field aria-label="Имя" />
        </Input.Wrapper>
      </Input.Root>,
    );
    expect(screen.getByRole("textbox").parentElement).not.toHaveAttribute("data-focus-ring");
  });
});

describe("Input.Badge", () => {
  it("renders a soft palette badge one tier down, after the field and before the end icon", () => {
    render(
      <Input.Root label="Статус" size="m">
        <Input.Wrapper>
          <Input.Field defaultValue="ИНН 7701234567" />
          <Input.Icon side="end">
            <svg />
          </Input.Icon>
          <Input.Badge color="green">Проверен</Input.Badge>
        </Input.Wrapper>
      </Input.Root>,
    );
    const badge = screen.getByText("Проверен");
    expect(badge).toHaveAttribute("data-variant", "soft");
    expect(badge).toHaveAttribute("data-color", "green");
    expect(badge).toHaveAttribute("data-tier", "s");
    expect(badge.className).toContain(styles.badge);
  });

  it("defaults to gray and follows the field tier", () => {
    render(
      <Input.Root size="l">
        <Input.Wrapper>
          <Input.Field aria-label="Поле" />
          <Input.Badge>Черновик</Input.Badge>
        </Input.Wrapper>
      </Input.Root>,
    );
    const badge = screen.getByText("Черновик");
    expect(badge).toHaveAttribute("data-color", "gray");
    expect(badge).toHaveAttribute("data-tier", "m");
  });
});
