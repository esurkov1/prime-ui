import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Textarea } from "./Textarea";

const { Root, CharCounter, Hint, Error: TextareaError } = Textarea;

describe("Textarea.Root", () => {
  it("renders hint and placeholder", () => {
    render(
      <Root placeholder="Type details...">
        <Hint>Describe the issue</Hint>
      </Root>,
    );

    expect(screen.getByPlaceholderText("Type details...")).toBeInTheDocument();
    expect(screen.getByText("Describe the issue")).toBeInTheDocument();
  });

  it("sets invalid state when Textarea.Error is rendered", () => {
    render(
      <Root placeholder="Type details...">
        <TextareaError>Required field</TextareaError>
      </Root>,
    );

    const textarea = screen.getByPlaceholderText("Type details...");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("sets invalid state when variant=error", () => {
    render(<Root variant="error" placeholder="Error variant" />);
    expect(screen.getByPlaceholderText("Error variant")).toHaveAttribute("aria-invalid", "true");
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

  it.each(["m", "l", "xl"] as const)("renders size=%s", (size) => {
    render(<Root size={size} placeholder={`size-${size}`} />);
    expect(screen.getByPlaceholderText(`size-${size}`)).toBeInTheDocument();
  });

  describe("autoResize", () => {
    it("wraps textarea in autoResize container when autoResize=true (default)", () => {
      const { container } = render(<Root placeholder="auto" />);
      const wrapper = container.querySelector("[data-value]");
      expect(wrapper).toBeInTheDocument();
    });

    it("does not wrap textarea when autoResize=false", () => {
      const { container } = render(<Root autoResize={false} placeholder="manual" />);
      const wrapper = container.querySelector("[data-value]");
      expect(wrapper).toBeNull();
    });

    it("updates data-value on textarea input", () => {
      const { container } = render(<Root placeholder="auto resize" />);
      const textarea = screen.getByPlaceholderText("auto resize");
      const wrapper = container.querySelector("[data-value]") as HTMLElement;

      fireEvent.input(textarea, { target: { value: "hello world" } });

      expect(wrapper.dataset.value).toBe("hello world");
    });

    it("calls onInput prop in addition to updating data-value", () => {
      const onInput = vi.fn();
      render(<Root placeholder="with handler" onInput={onInput} />);
      const textarea = screen.getByPlaceholderText("with handler");

      fireEvent.input(textarea, { target: { value: "test" } });

      expect(onInput).toHaveBeenCalledOnce();
    });

    it("does not update data-value when autoResize=false", () => {
      const { container } = render(<Root autoResize={false} placeholder="no auto" />);
      const textarea = screen.getByPlaceholderText("no auto");

      fireEvent.input(textarea, { target: { value: "hello" } });

      const wrapper = container.querySelector("[data-value]");
      expect(wrapper).toBeNull();
    });
  });

  describe("aria", () => {
    it("associates hint with aria-describedby", () => {
      render(
        <Root placeholder="described">
          <Hint>Hint text</Hint>
        </Root>,
      );
      const textarea = screen.getByPlaceholderText("described");
      const hintEl = screen.getByText("Hint text");
      expect(textarea.getAttribute("aria-describedby")).toContain(hintEl.id);
    });

    it("associates error with aria-describedby", () => {
      render(
        <Root placeholder="described-error">
          <TextareaError>Error text</TextareaError>
        </Root>,
      );
      const textarea = screen.getByPlaceholderText("described-error");
      const errorEl = screen.getByText("Error text");
      expect(textarea.getAttribute("aria-describedby")).toContain(errorEl.id);
    });
  });
});

describe("Textarea.CharCounter", () => {
  it("renders current and max", () => {
    render(<CharCounter current={10} max={100} />);
    expect(screen.getByText("10/100")).toBeInTheDocument();
  });

  it("does not set data-overflow when under limit", () => {
    render(<CharCounter current={50} max={100} />);
    const el = screen.getByText("50/100");
    expect(el).not.toHaveAttribute("data-overflow");
  });

  it("sets data-overflow=true when current > max", () => {
    render(<CharCounter current={101} max={100} />);
    const el = screen.getByText("101/100");
    expect(el).toHaveAttribute("data-overflow", "true");
  });

  it("does not set data-overflow when current === max", () => {
    render(<CharCounter current={100} max={100} />);
    const el = screen.getByText("100/100");
    expect(el).not.toHaveAttribute("data-overflow");
  });

  it("renders counter inside control when passed as child of Root", () => {
    const { container } = render(
      <Root placeholder="Counted">
        <CharCounter current={3} max={10} />
      </Root>,
    );
    const control = container.querySelector("label");
    expect(control).toContainElement(screen.getByText("3/10"));
  });
});
