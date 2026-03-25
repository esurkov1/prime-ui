import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
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

  it("defaults to data-size m", () => {
    const { container } = render(<Tag.Root>d</Tag.Root>);
    expect(container.firstElementChild).toHaveAttribute("data-size", "m");
  });

  it("does not show remove button without onRemove", () => {
    render(<Tag.Root>Only</Tag.Root>);
    expect(screen.queryByRole("button", { name: "Remove" })).not.toBeInTheDocument();
  });

  it("shows remove button when onRemove is passed", () => {
    render(<Tag.Root onRemove={() => undefined}>Removable</Tag.Root>);
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });

  it("calls onRemove when remove button is clicked", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Tag.Root onRemove={onRemove}>X</Tag.Root>);
    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("sets disabled state on root and remove button", () => {
    const { container } = render(
      <Tag.Root disabled onRemove={() => undefined}>
        Off
      </Tag.Root>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-disabled", "true");
    expect(screen.getByRole("button", { name: "Remove" })).toBeDisabled();
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
});
