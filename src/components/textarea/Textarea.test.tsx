import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Textarea } from "./Textarea";

/** The visible counter («10/100»): its digits are separate odometer columns. */
const counterText = (text: string) =>
  screen.getByText(
    (_, el) => el?.getAttribute("aria-hidden") === "true" && el.textContent === text,
  );

const { Root, Counter } = Textarea;

describe("Textarea.Root", () => {
  it("renders hint and placeholder", () => {
    render(<Root placeholder="Type details..." hint="Describe the issue" />);
    expect(screen.getByPlaceholderText("Type details...")).toBeInTheDocument();
    expect(screen.getByText("Describe the issue")).toBeInTheDocument();
  });

  it("a non-empty error implies invalid", () => {
    render(<Root placeholder="Type details..." error="Required field" />);
    const textarea = screen.getByPlaceholderText("Type details...");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("sets invalid state when invalid", () => {
    const { container } = render(<Root invalid placeholder="Invalid" />);
    expect(screen.getByPlaceholderText("Invalid")).toHaveAttribute("aria-invalid", "true");
    expect(container.firstElementChild).toHaveAttribute("data-invalid", "true");
  });

  it("native props cannot override the invalid state", () => {
    render(<Root label="Детали" error="Обязательно" aria-invalid={false} />);
    expect(screen.getByRole("textbox", { name: "Детали" })).toHaveAttribute("aria-invalid", "true");
  });

  it("forwards ref to textarea element", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Root ref={ref} placeholder="ref test" />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("renders disabled state", () => {
    render(<Root disabled placeholder="Disabled" />);
    expect(screen.getByPlaceholderText("Disabled")).toBeDisabled();
  });

  it("renders readonly state", () => {
    render(<Root readOnly defaultValue="Read only content" placeholder="Readonly" />);
    expect(screen.getByPlaceholderText("Readonly")).toHaveAttribute("readonly");
  });

  it("renders a label linked to the textarea with the required asterisk", () => {
    render(<Root label="Comment" required placeholder="labelled" />);
    const textarea = screen.getByPlaceholderText("labelled");
    expect(textarea).toHaveAccessibleName("Comment");
    expect(textarea).toBeRequired();
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders the optional marker from labels.optional", () => {
    const { rerender } = render(<Root label="Comment" optional placeholder="opt" />);
    expect(screen.getByText("необязательно")).toBeInTheDocument();
    rerender(<Root label="Comment" optional labels={{ optional: "optional" }} placeholder="opt" />);
    expect(screen.getByText("optional")).toBeInTheDocument();
  });

  it("hides the hint while an error is shown (error takes the hint slot)", () => {
    render(<Root placeholder="swap" hint="Helper" error="Broken" />);
    expect(screen.queryByText("Helper")).toBeNull();
    const textarea = screen.getByPlaceholderText("swap");
    expect(textarea.getAttribute("aria-describedby")).toBe(screen.getByText("Broken").id);
  });

  it("calls onValueChange and onChange with the new value", () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    render(<Root placeholder="typed" onValueChange={onValueChange} onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText("typed"), { target: { value: "abc" } });
    expect(onValueChange).toHaveBeenCalledWith("abc");
    expect(onChange).toHaveBeenCalledOnce();
  });

  it.each(["xs", "s", "m", "l", "xl"] as const)("renders size=%s", (size) => {
    const { container } = render(<Root size={size} placeholder={`size-${size}`} />);
    expect(container.firstElementChild).toHaveAttribute("data-size", size);
  });

  describe("autoResize", () => {
    it("wraps textarea in autoResize container when autoResize=true (default)", () => {
      const { container } = render(<Root placeholder="auto" />);
      expect(container.querySelector("[data-value]")).toBeInTheDocument();
    });

    it("rows sets the minimum lines (three by default) and maxRows caps the growth", () => {
      const { rerender } = render(<Root aria-label="Комментарий" />);
      const control = () => screen.getByRole("textbox").parentElement?.parentElement as HTMLElement;
      expect(control().style.getPropertyValue("--textarea-rows")).toBe("3");
      expect(control()).not.toHaveAttribute("data-capped");
      rerender(<Root aria-label="Комментарий" rows={1} maxRows={8} />);
      expect(screen.getByRole("textbox")).toHaveAttribute("rows", "1");
      expect(control().style.getPropertyValue("--textarea-rows")).toBe("1");
      expect(control().style.getPropertyValue("--textarea-max-rows")).toBe("8");
      expect(control()).toHaveAttribute("data-capped", "true");
    });

    it("maxRows does nothing on a fixed-height field", () => {
      render(<Root aria-label="Условия" autoResize={false} maxRows={4} />);
      expect(screen.getByRole("textbox").parentElement).not.toHaveAttribute("data-capped");
    });

    it("does not wrap textarea when autoResize=false", () => {
      const { container } = render(<Root autoResize={false} placeholder="manual" />);
      expect(container.querySelector("[data-value]")).toBeNull();
    });

    it("updates data-value on textarea input", () => {
      const { container } = render(<Root placeholder="auto resize" />);
      const textarea = screen.getByPlaceholderText("auto resize");
      const wrapper = container.querySelector("[data-value]") as HTMLElement;
      fireEvent.input(textarea, { target: { value: "hello world" } });
      expect(wrapper.dataset.value).toBe("hello world");
    });

    it("syncs data-value with a controlled value", () => {
      const { container } = render(<Root placeholder="ctl" value="from props" readOnly />);
      const wrapper = container.querySelector("[data-value]") as HTMLElement;
      expect(wrapper.dataset.value).toBe("from props");
    });

    it("calls onInput prop in addition to updating data-value", () => {
      const onInput = vi.fn();
      render(<Root placeholder="with handler" onInput={onInput} />);
      fireEvent.input(screen.getByPlaceholderText("with handler"), { target: { value: "test" } });
      expect(onInput).toHaveBeenCalledOnce();
    });
  });

  describe("aria", () => {
    it("associates hint with aria-describedby and keeps caller ids", () => {
      render(<Root placeholder="described" hint="Hint text" aria-describedby="external" />);
      const describedBy = screen.getByPlaceholderText("described").getAttribute("aria-describedby");
      expect(describedBy).toContain("external");
      expect(describedBy).toContain(screen.getByText("Hint text").id);
    });

    it("associates error with aria-describedby", () => {
      render(<Root placeholder="described-error" error="Error text" />);
      const textarea = screen.getByPlaceholderText("described-error");
      expect(textarea.getAttribute("aria-describedby")).toContain(
        screen.getByText("Error text").id,
      );
    });
  });
});

describe("Textarea.Counter", () => {
  const renderCounter = (current: number, max: number) =>
    render(<Root placeholder="Counted" counter={<Counter current={current} max={max} />} />);

  it("renders current and max with screen-reader text", () => {
    renderCounter(10, 100);
    expect(counterText("10/100")).toBeInTheDocument();
    expect(screen.getByText("10 из 100 символов")).toBeInTheDocument();
  });

  it("sets data-invalid only when current > max", () => {
    const { unmount } = renderCounter(100, 100);
    expect(counterText("100/100").parentElement).not.toHaveAttribute("data-invalid");
    unmount();
    renderCounter(101, 100);
    expect(counterText("101/100").parentElement).toHaveAttribute("data-invalid", "true");
  });

  // The counter lives in the support row under the field (foundation §6), not inside the
  // field box, so it never becomes part of the textarea's accessible name.
  it("renders outside the field box", () => {
    const { container } = renderCounter(3, 10);
    const counter = counterText("3/10");
    const textarea = screen.getByPlaceholderText("Counted");
    expect(container.querySelector("label")).toBeNull();
    expect(textarea.parentElement?.parentElement).not.toContainElement(counter);
    expect(textarea).toHaveAccessibleName("");
  });
});

describe("Textarea focusRing", () => {
  it("focusRing={false} marks the field box and keeps the invalid state", () => {
    render(<Root aria-label="Заметка" focusRing={false} invalid />);
    const box = screen.getByRole("textbox").closest("[data-focus-ring]");
    expect(box).toHaveAttribute("data-focus-ring", "false");
    expect(box).toHaveAttribute("data-invalid", "true");
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });
});

describe("Textarea onCommit (inline save)", () => {
  it("commits on Mod+Enter and blur, not on a plain Enter; Escape reverts", () => {
    const onCommit = vi.fn();
    render(<Textarea.Root label="Комментарий" defaultValue="Позвонить" onCommit={onCommit} />);
    const field = screen.getByLabelText<HTMLTextAreaElement>("Комментарий");
    fireEvent.focus(field);
    fireEvent.change(field, { target: { value: "Позвонить завтра" } });
    fireEvent.keyDown(field, { key: "Enter" });
    expect(onCommit).not.toHaveBeenCalled();
    fireEvent.keyDown(field, { key: "Enter", ctrlKey: true });
    expect(onCommit).toHaveBeenCalledWith("Позвонить завтра");

    fireEvent.change(field, { target: { value: "Черновик" } });
    fireEvent.keyDown(field, { key: "Escape" });
    expect(field.value).toBe("Позвонить завтра");
    fireEvent.blur(field);
    expect(onCommit).toHaveBeenCalledTimes(1);
  });

  it("a rejected save restores the committed value", async () => {
    let fail!: () => void;
    const onCommit = () =>
      new Promise<void>((_, reject) => {
        fail = () => reject(new Error("500"));
      });
    render(<Textarea.Root label="Комментарий" defaultValue="Позвонить" onCommit={onCommit} />);
    const field = screen.getByLabelText<HTMLTextAreaElement>("Комментарий");
    fireEvent.focus(field);
    fireEvent.change(field, { target: { value: "Не сохранится" } });
    fireEvent.blur(field);
    expect(field).toHaveAttribute("aria-busy", "true");
    await act(async () => fail());
    expect(field.value).toBe("Позвонить");
  });
});

describe("Textarea edge actions", () => {
  it("CopyButton and Action sit in the field and copy the text", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const onClick = vi.fn();
    render(
      <Textarea.Root label="Ответ" readOnly defaultValue="Счёт отправлен">
        <Textarea.Action label="Переписать" onClick={onClick}>
          <svg />
        </Textarea.Action>
        <Textarea.CopyButton />
      </Textarea.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Переписать" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Копировать" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("Счёт отправлен"));
    expect(await screen.findByRole("button", { name: "Скопировано" })).toBeInTheDocument();
  });

  it("a press on an action does not move focus into the textarea", () => {
    render(
      <Textarea.Root label="Ответ" defaultValue="Текст">
        <Textarea.CopyButton />
      </Textarea.Root>,
    );
    const down = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
    screen.getByRole("button", { name: "Копировать" }).dispatchEvent(down);
    expect(down.defaultPrevented).toBe(false);
  });
});
