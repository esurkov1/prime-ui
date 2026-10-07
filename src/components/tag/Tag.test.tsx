import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { Tag } from "./Tag";

describe("Tag", () => {
  it("renders", () => {
    render(<Tag.Root>Label</Tag.Root>);
    expect(screen.getByText("Label")).toBeInTheDocument();
  });

  it.each(["s", "m", "l", "xl"] as const)("sets data-size=%s", (size) => {
    const { container } = render(<Tag.Root size={size}>x</Tag.Root>);
    expect(container.firstElementChild).toHaveAttribute("data-size", size);
  });

  it("defaults to size m, gray, soft", () => {
    const { container } = render(<Tag.Root>d</Tag.Root>);
    expect(container.firstElementChild).toHaveAttribute("data-size", "m");
    expect(container.firstElementChild).toHaveAttribute("data-color", "gray");
    expect(container.firstElementChild).toHaveAttribute("data-variant", "soft");
  });

  it("sets data-color and data-variant", () => {
    const { container } = render(
      <Tag.Root color="blue" variant="outline">
        c
      </Tag.Root>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-color", "blue");
    expect(container.firstElementChild).toHaveAttribute("data-variant", "outline");
  });

  it("does not show remove button without onRemove", () => {
    render(<Tag.Root>Only</Tag.Root>);
    expect(screen.queryByRole("button", { name: "Удалить" })).not.toBeInTheDocument();
  });

  it("shows remove button when onRemove is passed", () => {
    render(<Tag.Root onRemove={() => undefined}>Removable</Tag.Root>);
    expect(screen.getByRole("button", { name: "Удалить" })).toBeInTheDocument();
  });

  it("calls onRemove when remove button is clicked", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Tag.Root onRemove={onRemove}>X</Tag.Root>);
    await user.click(screen.getByRole("button", { name: "Удалить" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("sets disabled state on root and remove button", () => {
    const { container } = render(
      <Tag.Root disabled onRemove={() => undefined}>
        Off
      </Tag.Root>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-disabled", "true");
    expect(screen.getByRole("button", { name: "Удалить" })).toBeDisabled();
  });

  it("renders Icon", () => {
    render(
      <Tag.Root>
        <Tag.Icon>
          <svg data-testid="icon-svg" viewBox="0 0 1 1" />
        </Tag.Icon>
        Text
      </Tag.Root>,
    );
    expect(screen.getByTestId("icon-svg")).toBeInTheDocument();
  });

  it("merges className on Root", () => {
    const { container } = render(<Tag.Root className="custom-tag">t</Tag.Root>);
    expect(container.firstElementChild).toHaveClass("custom-tag");
  });

  it("uses labels.remove as the accessible name of the remove button", () => {
    render(
      <Tag.Root labels={{ remove: "Remove Design" }} onRemove={() => undefined}>
        Design
      </Tag.Root>,
    );
    expect(screen.getByRole("button", { name: "Remove Design" })).toBeInTheDocument();
  });

  it("supports size xs and steps down inside a control", () => {
    const { container } = render(
      <>
        <Tag.Root size="xs">a</Tag.Root>
        <ControlSizeProvider value="l">
          <Tag.Root>b</Tag.Root>
        </ControlSizeProvider>
      </>,
    );
    const [a, b] = Array.from(container.querySelectorAll("[data-size]"));
    expect(a).toHaveAttribute("data-tier", "xs");
    expect(b).toHaveAttribute("data-size", "l");
    expect(b).toHaveAttribute("data-tier", "m");
  });
});
