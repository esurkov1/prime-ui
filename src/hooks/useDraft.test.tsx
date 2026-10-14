import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useDraft } from "./useDraft";

function Field({ source }: { source: string }) {
  const { inputRef, draft, setDraft } = useDraft(source);
  return (
    <input
      ref={inputRef}
      aria-label="Цвет"
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
    />
  );
}

describe("useDraft", () => {
  it("follows the source while the input is not focused", () => {
    const { rerender } = render(<Field source="#FFFFFF" />);
    rerender(<Field source="#000000" />);
    expect(screen.getByRole("textbox")).toHaveValue("#000000");
  });

  it("keeps the person's text while the input is focused", () => {
    const { rerender } = render(<Field source="#FFFFFF" />);
    const input = screen.getByRole("textbox");
    act(() => input.focus());
    rerender(<Field source="#000000" />);
    expect(input).toHaveValue("#FFFFFF");
  });
});
