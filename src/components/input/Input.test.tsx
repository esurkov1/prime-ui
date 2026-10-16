import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { DisabledProvider } from "@/internal/disabledContext";

import { Input } from "./Input";
import styles from "./Input.module.css";
import { getPasswordStrength } from "./passwordStrength";

/** The visible counter («10/100»): its digits are separate odometer columns. */
const counterText = (text: string) =>
  screen.getByText(
    (_, el) => el?.getAttribute("aria-hidden") === "true" && el.textContent === text,
  );

describe("Input size from the host", () => {
  it("takes the host tier without its own size; an explicit size wins", () => {
    render(
      <ControlSizeProvider value="l">
        <Input.Root label="Почта">
          <Input.Wrapper>
            <Input.Field />
          </Input.Wrapper>
        </Input.Root>
        <Input.Root label="Пароль" size="xs">
          <Input.Wrapper>
            <Input.Field />
          </Input.Wrapper>
        </Input.Root>
      </ControlSizeProvider>,
    );
    expect(screen.getByLabelText("Почта").closest("[data-invalid], [data-size]")).toHaveAttribute(
      "data-size",
      "l",
    );
    expect(screen.getByLabelText("Пароль").closest("[data-size]")).toHaveAttribute(
      "data-size",
      "xs",
    );
  });
});

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
    it("the unit describes the input; an aria-label on it is what is heard", () => {
      const { rerender } = render(
        <Input.Root label="Бюджет" hint="Без НДС">
          <Input.Wrapper>
            <Input.Field inputMode="decimal" />
            <Input.InlineAffix side="end">₽</Input.InlineAffix>
          </Input.Wrapper>
        </Input.Root>,
      );
      const field = screen.getByRole("textbox", { name: "Бюджет" });
      expect(field).toHaveAccessibleDescription("₽ Без НДС");
      rerender(
        <Input.Root label="Бюджет" hint="Без НДС">
          <Input.Wrapper>
            <Input.Field inputMode="decimal" />
            <Input.InlineAffix side="end" aria-label="рублей">
              ₽
            </Input.InlineAffix>
          </Input.Wrapper>
        </Input.Root>,
      );
      expect(field).toHaveAccessibleDescription("рублей Без НДС");
      rerender(
        <Input.Root label="Бюджет" hint="Без НДС">
          <Input.Wrapper>
            <Input.Field inputMode="decimal" />
          </Input.Wrapper>
        </Input.Root>,
      );
      expect(field).toHaveAccessibleDescription("Без НДС");
    });

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
    expect(counterText("12/10").parentElement).toHaveAttribute("data-invalid", "true");
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

  it("ClearButton finds its field through a ref, even outside the document", () => {
    const host = document.createElement("div");
    const shadow = host.attachShadow({ mode: "open" });
    const container = document.createElement("div");
    shadow.appendChild(container);
    document.body.appendChild(host);
    render(
      <Input.Root>
        <Input.Wrapper>
          <Input.Field placeholder="shadow" defaultValue="x" />
          <Input.ClearButton />
        </Input.Wrapper>
      </Input.Root>,
      { container },
    );
    const field = shadow.querySelector("input") as HTMLInputElement;
    fireEvent.click(shadow.querySelector("button") as HTMLButtonElement);
    expect(shadow.activeElement).toBe(field);
    host.remove();
  });

  it("Field props cannot break the label link or the invalid state", () => {
    render(
      <Input.Root label="Почта" error="Неверный адрес">
        <Input.Wrapper>
          <Input.Field aria-invalid={false} />
        </Input.Wrapper>
      </Input.Root>,
    );
    const field = screen.getByRole("textbox", { name: "Почта" });
    expect(field).toHaveAttribute("aria-invalid", "true");
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

describe("Input support row", () => {
  it("keeps an empty support row without hint, error, counter or reserve", () => {
    render(
      <Input.Root label="Имя">
        <Input.Wrapper>
          <Input.Field />
        </Input.Wrapper>
      </Input.Root>,
    );
    // The row stays mounted for its live region but shows nothing and takes no room.
    const row = screen.getByRole("textbox").parentElement?.nextElementSibling;
    expect(row).toHaveAttribute("data-empty", "true");
    expect(row).toHaveTextContent("");
  });

  it("reserveSupportRow keeps an empty row of the field tier", () => {
    render(
      <Input.Root label="Промокод" size="l" reserveSupportRow>
        <Input.Wrapper>
          <Input.Field />
        </Input.Wrapper>
      </Input.Root>,
    );
    const row = screen.getByRole("textbox").parentElement?.nextElementSibling;
    expect(row).toHaveAttribute("data-reserve", "true");
    expect(row).toHaveAttribute("data-size", "l");
  });
});

describe("Input strength", () => {
  const meter = () => screen.getByRole("progressbar", { name: "Надёжность пароля" });

  it("follows the typed value with the kit's estimate and names the level", () => {
    render(
      <Input.Root label="Пароль" strength>
        <Input.Wrapper>
          <Input.Field type="password" defaultValue="" />
        </Input.Wrapper>
      </Input.Root>,
    );
    expect(meter()).toHaveAttribute("value", "0");
    const field = screen.getByLabelText("Пароль");
    fireEvent.change(field, { target: { value: "graphite" } });
    expect(meter()).toHaveAttribute("value", "1");
    expect(screen.getByText("Слабый")).toBeInTheDocument();
    fireEvent.change(field, { target: { value: "Graphite2026!" } });
    expect(meter()).toHaveAttribute("value", "4");
    expect(screen.getByText("Сложный")).toBeInTheDocument();
  });

  it("reads a controlled value and a custom estimate", () => {
    render(
      <Input.Root label="Пароль" strength getStrength={(v) => (v === "ok" ? 3 : 1)}>
        <Input.Wrapper>
          <Input.Field type="password" value="ok" onChange={() => {}} />
        </Input.Wrapper>
      </Input.Root>,
    );
    expect(meter()).toHaveAttribute("value", "3");
    expect(screen.getByText("Средний")).toBeInTheDocument();
  });
});

describe("Input minStrength", () => {
  const meter = () => screen.getByRole("progressbar", { name: "Надёжность пароля" });

  function Policy({ onSubmit }: { onSubmit: () => void }) {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Input.Root label="Пароль" strength minStrength={3}>
          <Input.Wrapper>
            <Input.Field type="password" defaultValue="" />
          </Input.Wrapper>
        </Input.Root>
      </form>
    );
  }

  it("turns the meter and the word danger below the threshold; an empty value is valid", () => {
    render(<Policy onSubmit={() => {}} />);
    const field = screen.getByLabelText<HTMLInputElement>("Пароль");
    expect(field.validity.valid).toBe(true);
    fireEvent.change(field, { target: { value: "Graphite7" } }); // easy
    expect(screen.getByText("Лёгкий").closest("[data-tone]")).toHaveAttribute(
      "data-tone",
      "danger",
    );
    expect(meter().closest("[data-tone]")).toHaveAttribute("data-tone", "danger");
    expect(field.validationMessage).toBe("Пароль недостаточно надёжный");
    fireEvent.change(field, { target: { value: "graphite7!" } }); // medium
    expect(screen.getByText("Средний").closest("[data-tone]")).toHaveAttribute(
      "data-tone",
      "accent",
    );
    expect(field.validity.valid).toBe(true);
  });

  it("a weak password stops the submit and shows the error until the value is fixed", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const { container } = render(<Policy onSubmit={onSubmit} />);
    const form = container.querySelector("form") as HTMLFormElement;
    const field = screen.getByLabelText("Пароль");
    await user.type(field, "Graphite7");
    expect(field).not.toHaveAttribute("aria-invalid");
    act(() => form.requestSubmit());
    expect(onSubmit).not.toHaveBeenCalled();
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAccessibleDescription(/Пароль недостаточно надёжный/);
    await user.type(field, "!");
    expect(field).not.toHaveAttribute("aria-invalid");
    act(() => form.requestSubmit());
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});

describe("Input valid", () => {
  function Repeat({ value, invalid }: { value: string; invalid?: boolean }) {
    return (
      <Input.Root label="Повторите пароль" valid={value === "Graphite2026"} invalid={invalid}>
        <Input.Wrapper data-testid="box">
          <Input.Field type="password" value={value} onChange={() => {}} />
        </Input.Wrapper>
      </Input.Root>
    );
  }

  it("draws the success ring and the check, and says so to assistive tech", () => {
    const { rerender } = render(<Repeat value="Graph" />);
    const field = screen.getByLabelText("Повторите пароль");
    const box = screen.getByTestId("box");
    expect(box).not.toHaveAttribute("data-valid");
    expect(screen.getByRole("status")).toHaveTextContent("");
    expect(field).not.toHaveAccessibleDescription(/Значение подходит/);

    rerender(<Repeat value="Graphite2026" />);
    expect(box).toHaveAttribute("data-valid", "true");
    expect(box.querySelector(`.${styles.validMark}`)).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Значение подходит");
    expect(field).toHaveAccessibleDescription("Значение подходит");
  });

  it("invalid wins over valid", () => {
    render(<Repeat value="Graphite2026" invalid />);
    const box = screen.getByTestId("box");
    expect(box).toHaveAttribute("data-invalid", "true");
    expect(box).not.toHaveAttribute("data-valid");
    expect(box.querySelector(`.${styles.validMark}`)).toBeNull();
  });

  it("renders no live region for a field that takes no valid", () => {
    render(
      <Input.Root label="Город">
        <Input.Wrapper>
          <Input.Field />
        </Input.Wrapper>
      </Input.Root>,
    );
    expect(screen.queryByRole("status")).toBeNull();
  });
});

describe("getPasswordStrength", () => {
  it("is empty only for an empty value", () => {
    expect(getPasswordStrength("")).toBe(0);
  });

  it("adds a point for every trait on its own, in any order", () => {
    expect(getPasswordStrength("graphite")).toBe(1); // lowercase
    expect(getPasswordStrength("Graphite")).toBe(1); // + uppercase
    expect(getPasswordStrength("Graphite7")).toBe(2); // + digit → easy
    expect(getPasswordStrength("7Graphite")).toBe(2); // the order does not matter
    expect(getPasswordStrength("Graphite7!")).toBe(4); // + symbol, 10 chars → hard
    expect(getPasswordStrength("graphite7!")).toBe(3); // no uppercase → medium
    expect(getPasswordStrength("!7etihparG")).toBe(4);
  });

  it("rewards length alone", () => {
    expect(getPasswordStrength("graphiteprime")).toBe(1); // lowercase, 10+
    expect(getPasswordStrength("graphiteprimekit")).toBe(2); // lowercase, 10+, 14+
  });

  it("keeps a short password at most easy, whatever it is made of", () => {
    expect(getPasswordStrength("Ab1!")).toBe(2);
    expect(getPasswordStrength("Ab1!xyz")).toBe(2);
    expect(getPasswordStrength("Ab1!xyzw")).toBe(3);
  });
});

describe("Input onCommit (inline save)", () => {
  function deferred() {
    let resolve!: () => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<void>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  }

  function CommitField({ onCommit }: { onCommit: (value: string) => void | Promise<void> }) {
    const [value, setValue] = React.useState("Ромашка");
    return (
      <Input.Root label="Компания" onCommit={onCommit}>
        <Input.Wrapper>
          <Input.Field value={value} onValueChange={setValue} />
        </Input.Wrapper>
      </Input.Root>
    );
  }

  it("commits a changed value on blur and Enter, never an unchanged one", () => {
    const onCommit = vi.fn();
    render(<CommitField onCommit={onCommit} />);
    const field = screen.getByLabelText("Компания");
    fireEvent.focus(field);
    fireEvent.blur(field);
    fireEvent.keyDown(field, { key: "Enter" });
    expect(onCommit).not.toHaveBeenCalled();

    fireEvent.focus(field);
    fireEvent.change(field, { target: { value: "Ромашка Плюс" } });
    fireEvent.keyDown(field, { key: "Enter" });
    expect(onCommit).toHaveBeenCalledWith("Ромашка Плюс");
    fireEvent.blur(field);
    expect(onCommit, "already committed by Enter").toHaveBeenCalledTimes(1);
  });

  it("Escape reverts to the committed value and is consumed", () => {
    const onCommit = vi.fn();
    render(<CommitField onCommit={onCommit} />);
    const field = screen.getByLabelText<HTMLInputElement>("Компания");
    fireEvent.focus(field);
    fireEvent.change(field, { target: { value: "Черновик" } });
    const press = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });
    field.dispatchEvent(press);
    expect(field.value).toBe("Ромашка");
    expect(press.defaultPrevented).toBe(true);
    fireEvent.blur(field);
    expect(onCommit).not.toHaveBeenCalled();
  });

  it("stays editable while pending, shows the spinner, then a check", async () => {
    const save = deferred();
    render(<CommitField onCommit={() => save.promise} />);
    const field = screen.getByLabelText<HTMLInputElement>("Компания");
    fireEvent.focus(field);
    fireEvent.change(field, { target: { value: "Ромашка Плюс" } });
    fireEvent.blur(field);
    expect(field).toHaveAttribute("aria-busy", "true");
    expect(field).not.toBeDisabled();
    expect(document.querySelector('[data-commit="pending"]')).not.toBeNull();
    expect(screen.getByText("Сохранение")).toBeInTheDocument();
    await act(async () => save.resolve());
    expect(field).not.toHaveAttribute("aria-busy");
    expect(field.value).toBe("Ромашка Плюс");
    expect(document.querySelector('[data-commit="saved"]')).not.toBeNull();
    expect(screen.getByText("Сохранено")).toBeInTheDocument();
  });

  it("a rejected save restores the committed value", async () => {
    const save = deferred();
    render(<CommitField onCommit={() => save.promise} />);
    const field = screen.getByLabelText<HTMLInputElement>("Компания");
    fireEvent.focus(field);
    fireEvent.change(field, { target: { value: "Ошибка" } });
    fireEvent.blur(field);
    await act(async () => save.reject(new Error("409")));
    await waitFor(() => expect(field.value).toBe("Ромашка"));
    expect(field).not.toHaveAttribute("aria-busy");
  });

  it("a rejected save keeps what the person typed after it", async () => {
    const save = deferred();
    render(<CommitField onCommit={() => save.promise} />);
    const field = screen.getByLabelText<HTMLInputElement>("Компания");
    fireEvent.focus(field);
    fireEvent.change(field, { target: { value: "Первое" } });
    fireEvent.keyDown(field, { key: "Enter" });
    fireEvent.change(field, { target: { value: "Второе" } });
    await act(async () => save.reject(new Error("409")));
    expect(field.value).toBe("Второе");
  });

  it("an uncontrolled field reverts too", () => {
    render(
      <Input.Root label="Город" onCommit={() => {}}>
        <Input.Wrapper>
          <Input.Field defaultValue="Казань" />
        </Input.Wrapper>
      </Input.Root>,
    );
    const field = screen.getByLabelText<HTMLInputElement>("Город");
    fireEvent.focus(field);
    fireEvent.change(field, { target: { value: "Самара" } });
    fireEvent.keyDown(field, { key: "Escape" });
    expect(field.value).toBe("Казань");
  });

  it("native focus, blur and keydown handlers still reach the input", () => {
    const onBlur = vi.fn();
    const onKeyDown = vi.fn();
    render(
      <Input.Root label="Город" onCommit={() => {}}>
        <Input.Wrapper>
          <Input.Field defaultValue="Казань" onBlur={onBlur} onKeyDown={onKeyDown} />
        </Input.Wrapper>
      </Input.Root>,
    );
    const field = screen.getByLabelText("Город");
    fireEvent.keyDown(field, { key: "a" });
    fireEvent.blur(field);
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});

describe("Input edge actions", () => {
  it("Input.Action is a named button with a tooltip; asChild renders a link", async () => {
    const onClick = vi.fn();
    render(
      <Input.Root label="Телефон">
        <Input.Wrapper>
          <Input.Field defaultValue="+7 900 000-00-00" />
          <Input.Action label="Открыть профиль" onClick={onClick}>
            <svg />
          </Input.Action>
          <Input.Action label="Позвонить" asChild>
            <a href="tel:+79000000000">
              <svg />
            </a>
          </Input.Action>
        </Input.Wrapper>
      </Input.Root>,
    );
    const button = screen.getByRole("button", { name: "Открыть профиль" });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute("data-field-action");
    expect(screen.getByRole("link", { name: "Позвонить" })).toHaveAttribute(
      "href",
      "tel:+79000000000",
    );
    fireEvent.focus(button);
    expect(await screen.findByText("Открыть профиль")).toBeInTheDocument();
  });

  it("Input.CopyButton copies the value and says so", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(
      <Input.Root label="ИНН">
        <Input.Wrapper>
          <Input.Field defaultValue="7701234567" readOnly />
          <Input.CopyButton />
        </Input.Wrapper>
      </Input.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Копировать" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("7701234567"));
    expect(await screen.findByRole("button", { name: "Скопировано" })).toBeInTheDocument();
  });

  it("Tab reaches the field, then its segments; Enter and Space run a segment", async () => {
    const user = userEvent.setup();
    function Search() {
      const [value, setValue] = React.useState("счёт 418");
      return (
        <Input.Root label="Поиск">
          <Input.Wrapper>
            <Input.Field type="password" value={value} onValueChange={setValue} />
            {value ? <Input.ClearButton onClick={() => setValue("")} /> : null}
            <Input.RevealButton />
          </Input.Wrapper>
        </Input.Root>
      );
    }
    render(<Search />);
    const field = screen.getByLabelText<HTMLInputElement>("Поиск");
    await user.tab();
    expect(field).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Очистить" })).toHaveFocus();
    await user.tab();
    const reveal = screen.getByRole("button", { name: "Показать пароль" });
    expect(reveal).toHaveFocus();
    await user.keyboard(" ");
    expect(reveal).toHaveAttribute("aria-pressed", "true");
    await user.keyboard("{Enter}");
    expect(reveal).toHaveAttribute("aria-pressed", "false");
    await user.tab({ shift: true });
    await user.keyboard(" ");
    expect(field).toHaveValue("");
    expect(field).toHaveFocus();
  });

  it("Input.RevealButton toggles a password field and keeps the selection", () => {
    render(
      <Input.Root label="Пароль">
        <Input.Wrapper>
          <Input.Field type="password" defaultValue="secret-42" />
          <Input.RevealButton />
        </Input.Wrapper>
      </Input.Root>,
    );
    const field = screen.getByLabelText<HTMLInputElement>("Пароль");
    const toggle = screen.getByRole("button", { name: "Показать пароль" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(field).toHaveAttribute("type", "password");
    field.focus();
    field.setSelectionRange(2, 5);
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(field).toHaveAttribute("type", "text");
    expect([field.selectionStart, field.selectionEnd]).toEqual([2, 5]);
    fireEvent.click(toggle);
    expect(field).toHaveAttribute("type", "password");
  });

  it("a pointer press on RevealButton keeps focus in the field", () => {
    render(
      <Input.Root label="Пароль">
        <Input.Wrapper>
          <Input.Field type="password" />
          <Input.RevealButton />
        </Input.Wrapper>
      </Input.Root>,
    );
    const field = screen.getByLabelText("Пароль");
    field.focus();
    const down = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
    screen.getByRole("button", { name: "Показать пароль" }).dispatchEvent(down);
    expect(down.defaultPrevented).toBe(true);
  });
});

describe("Input inside a disabled Fieldset", () => {
  it("takes disabled from the Fieldset around it", () => {
    render(
      <DisabledProvider disabled>
        <Input.Root label="Название проекта">
          <Input.Wrapper>
            <Input.Field />
          </Input.Wrapper>
        </Input.Root>
      </DisabledProvider>,
    );
    expect(screen.getByLabelText("Название проекта")).toBeDisabled();
  });
});

describe("Input suggestions", () => {
  const LOCATIONS = ["Дома (Чалонг)", "Офис (Раваи)", "Сервис (Чалонг)"];

  function Suggested({ onValue }: { onValue?: (value: string) => void }) {
    const [value, setValue] = React.useState("");
    return (
      <Input.Root label="Где стоит" suggestions={LOCATIONS}>
        <Input.Wrapper>
          <Input.Field
            value={value}
            onValueChange={(next) => {
              setValue(next);
              onValue?.(next);
            }}
          />
        </Input.Wrapper>
      </Input.Root>
    );
  }

  it("is a combobox that lists the suggestions containing the typed text", async () => {
    const user = userEvent.setup();
    render(<Suggested />);
    const field = screen.getByRole("combobox", { name: "Где стоит" });
    expect(field).toHaveAttribute("aria-expanded", "false");
    expect(field).toHaveAttribute("aria-autocomplete", "list");
    await user.type(field, "чалонг");
    expect(field).toHaveAttribute("aria-expanded", "true");
    const listbox = screen.getByRole("listbox", { name: "Где стоит" });
    expect(field).toHaveAttribute("aria-controls", listbox.id);
    expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual([
      "Дома (Чалонг)",
      "Сервис (Чалонг)",
    ]);
  });

  it("the arrows move the highlight, Enter puts it into the field as typing would", async () => {
    const user = userEvent.setup();
    const onValue = vi.fn();
    render(<Suggested onValue={onValue} />);
    const field = screen.getByRole("combobox");
    field.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(field).toHaveAttribute("aria-activedescendant", screen.getAllByRole("option")[0]?.id);
    await user.keyboard("{ArrowDown}");
    const second = screen.getAllByRole("option")[1];
    expect(second).toHaveAttribute("aria-selected", "true");
    expect(field).toHaveAttribute("aria-activedescendant", second?.id);
    await user.keyboard("{ArrowUp}{ArrowUp}");
    expect(screen.getAllByRole("option")[2]).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{Enter}");
    expect(field).toHaveValue("Сервис (Чалонг)");
    expect(onValue).toHaveBeenLastCalledWith("Сервис (Чалонг)");
    expect(field).toHaveAttribute("aria-expanded", "false");
    expect(field).toHaveFocus();
  });

  it("Alt + ArrowDown opens the list without a highlight", async () => {
    const user = userEvent.setup();
    render(<Suggested />);
    const field = screen.getByRole("combobox");
    field.focus();
    await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
    expect(field).toHaveAttribute("aria-expanded", "true");
    expect(field).not.toHaveAttribute("aria-activedescendant");
    await user.keyboard("{Enter}");
    expect(field).toHaveValue("");
    expect(field).toHaveAttribute("aria-expanded", "false");
  });

  it("Escape closes the list and keeps the typed text; free text stays the value", async () => {
    const user = userEvent.setup();
    render(<Suggested />);
    const field = screen.getByRole("combobox");
    await user.type(field, "Офис");
    expect(field).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{Escape}");
    expect(field).toHaveAttribute("aria-expanded", "false");
    expect(field).toHaveValue("Офис");
    await user.type(field, " на складе");
    expect(field).toHaveValue("Офис на складе");
    expect(field).toHaveAttribute("aria-expanded", "false");
  });

  it("a press on an option picks it and keeps the focus in the field", async () => {
    const user = userEvent.setup();
    render(<Suggested />);
    const field = screen.getByRole("combobox");
    await user.type(field, "ра");
    await user.click(screen.getByRole("option", { name: "Офис (Раваи)" }));
    expect(field).toHaveValue("Офис (Раваи)");
    expect(field).toHaveFocus();
    expect(field).toHaveAttribute("aria-expanded", "false");
  });

  it("Tab closes the list and moves on", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Suggested />
        <button type="button">Дальше</button>
      </>,
    );
    const field = screen.getByRole("combobox");
    await user.type(field, "о");
    expect(field).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{Tab}");
    expect(screen.getByRole("button", { name: "Дальше" })).toHaveFocus();
    expect(field).toHaveAttribute("aria-expanded", "false");
  });

  it("a field without suggestions is a plain textbox", () => {
    render(
      <Input.Root label="Имя">
        <Input.Wrapper>
          <Input.Field />
        </Input.Wrapper>
      </Input.Root>,
    );
    const field = screen.getByRole("textbox", { name: "Имя" });
    expect(field).not.toHaveAttribute("aria-expanded");
  });
});

describe("Input autofill", () => {
  it("keeps autofill and the password managers off without a token", () => {
    render(
      <Input.Root label="Поиск">
        <Input.Wrapper>
          <Input.Field type="search" placeholder="Название или @username" />
        </Input.Wrapper>
      </Input.Root>,
    );
    const field = screen.getByRole("searchbox", { name: "Поиск" });
    expect(field).toHaveAttribute("autocomplete", "off");
    expect(field).toHaveAttribute("data-1p-ignore");
    expect(field).toHaveAttribute("data-lpignore", "true");
    expect(field).toHaveAttribute("data-bwignore");
    expect(field).toHaveAttribute("data-form-type", "other");
  });

  it("passes a token through and drops the opt-outs", () => {
    render(
      <Input.Root label="Новый пароль">
        <Input.Wrapper>
          <Input.Field type="password" autoComplete="new-password" />
        </Input.Wrapper>
      </Input.Root>,
    );
    const field = screen.getByLabelText("Новый пароль");
    expect(field).toHaveAttribute("autocomplete", "new-password");
    expect(field).not.toHaveAttribute("data-1p-ignore");
    expect(field).not.toHaveAttribute("data-lpignore");
    expect(field).not.toHaveAttribute("data-bwignore");
    expect(field).not.toHaveAttribute("data-form-type");
  });

  it("keeps autofill off under the kit's own suggestions, whatever the token", () => {
    render(
      <Input.Root label="Город" suggestions={["Москва", "Казань"]}>
        <Input.Wrapper>
          <Input.Field autoComplete="address-level2" />
        </Input.Wrapper>
      </Input.Root>,
    );
    const field = screen.getByRole("combobox", { name: "Город" });
    expect(field).toHaveAttribute("autocomplete", "off");
    expect(field).toHaveAttribute("data-1p-ignore");
  });
});
