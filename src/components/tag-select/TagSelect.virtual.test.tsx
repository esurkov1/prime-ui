import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TagSelect } from "./TagSelect";

const OPTIONS = Array.from({ length: 500 }, (_, index) => ({
  value: `tag-${index}`,
  label: `Тег ${index}`,
}));

/** The panel is 360px tall; options have no CSS, so each is the 36px estimate. */
function sized(height = 360) {
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(height);
}

const nextFrame = () =>
  act(async () => {
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  });

afterEach(() => vi.restoreAllMocks());

describe("TagSelect long list", () => {
  it("renders only the options around the view, each with its place in the whole list", async () => {
    sized();
    render(<TagSelect options={OPTIONS} aria-label="Теги" />);
    fireEvent.focus(screen.getByRole("combobox"));
    await nextFrame();
    const options = screen.getAllByRole("option");
    expect(options.length).toBeLessThan(40);
    expect(options[0]).toHaveAttribute("aria-posinset", "1");
    expect(options[0]).toHaveAttribute("aria-setsize", "500");
  });

  it("the keyboard reaches an option outside the window and keeps it rendered", async () => {
    sized();
    render(<TagSelect options={OPTIONS} aria-label="Теги" />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    await nextFrame();
    // Up from the first option wraps to the last one.
    fireEvent.keyDown(input, { key: "ArrowUp" });
    await nextFrame();
    const last = screen.getByRole("option", { name: "Тег 499" });
    expect(input).toHaveAttribute("aria-activedescendant", last.id);
    expect(last).toHaveAttribute("aria-posinset", "500");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByRole("button", { name: /Тег 499/ })).toBeInTheDocument();
  });

  it("renders every option of a short list", () => {
    render(<TagSelect options={OPTIONS.slice(0, 60)} aria-label="Теги" />);
    fireEvent.focus(screen.getByRole("combobox"));
    expect(screen.getAllByRole("option")).toHaveLength(60);
    expect(screen.getAllByRole("option")[0]).not.toHaveAttribute("aria-setsize");
  });
});
