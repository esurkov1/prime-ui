import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { TEXT_FORMATTING_LABELS } from "./textFormatting";
import { useTextFormatting } from "./textFormattingToolbar";

type FieldProps = {
  enabled?: boolean;
  readOnly?: boolean;
  onInput?: (value: string) => void;
};

/** A textarea with the formatting hotkeys and toolbar, the way Textarea and Composer wire them. */
function Field({ enabled = true, readOnly = false, onInput }: FieldProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const formatting = useTextFormatting({
    textareaRef,
    enabled,
    toolbar: !readOnly,
    labels: TEXT_FORMATTING_LABELS,
    size: "m",
    controlsId: "note",
  });
  return (
    <div {...formatting.anchorProps}>
      <textarea
        id="note"
        ref={textareaRef}
        aria-label="Комментарий"
        defaultValue="Счёт оплачен"
        readOnly={readOnly}
        onSelect={formatting.onSelect}
        onKeyDown={(event) => formatting.onKeyDown(event)}
        onInput={(event) => onInput?.(event.currentTarget.value)}
      />
      {formatting.toolbar}
    </div>
  );
}

/** Focuses the field and selects «оплачен». */
function selectWord() {
  const field = screen.getByRole("textbox", { name: "Комментарий" }) as HTMLTextAreaElement;
  act(() => {
    field.focus();
    field.setSelectionRange(5, 12);
  });
  fireEvent.select(field);
  return field;
}

describe("useTextFormatting", () => {
  it("Mod+B wraps the selection, keeps it selected and reports the edit as input", async () => {
    const onInput = vi.fn();
    render(<Field onInput={onInput} />);
    const field = selectWord();
    await userEvent.keyboard("{Control>}b{/Control}");
    expect(field.value).toBe("Счёт **оплачен**");
    expect(field.value.slice(field.selectionStart, field.selectionEnd)).toBe("оплачен");
    expect(onInput).toHaveBeenLastCalledWith("Счёт **оплачен**");
  });

  it("Mod+Shift+X strikes the selection through; other keys type as usual", async () => {
    render(<Field />);
    const field = selectWord();
    await userEvent.keyboard("{Control>}{Shift>}x{/Shift}{/Control}");
    expect(field.value).toBe("Счёт ~~оплачен~~");
  });

  it("shows a toolbar over a selection while the focus is in the field", () => {
    render(<Field />);
    expect(screen.queryByRole("toolbar")).toBeNull();
    selectWord();
    const toolbar = screen.getByRole("toolbar", { name: "Форматирование" });
    expect(toolbar).toHaveAttribute("aria-controls", "note");
    expect(screen.getByRole("button", { name: "Жирный" })).toHaveAttribute(
      "aria-keyshortcuts",
      "Control+B",
    );
  });

  it("a tool applies its format to the selection", async () => {
    render(<Field />);
    const field = selectWord();
    await userEvent.click(screen.getByRole("button", { name: "Курсив" }));
    expect(field.value).toBe("Счёт _оплачен_");
  });

  it("arrow keys move between the tools", async () => {
    render(<Field />);
    selectWord();
    const bold = screen.getByRole("button", { name: "Жирный" });
    expect(bold).toHaveAttribute("tabindex", "0");
    act(() => bold.focus());
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Курсив" })).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(bold).toHaveFocus();
  });

  it("Escape drops the selection and with it the toolbar", async () => {
    render(<Field />);
    const field = selectWord();
    await userEvent.keyboard("{Escape}");
    expect(field.selectionStart).toBe(field.selectionEnd);
    expect(screen.queryByRole("toolbar")).toBeNull();
  });

  it("does nothing in a read-only field or when turned off", async () => {
    const { unmount } = render(<Field readOnly />);
    let field = selectWord();
    expect(screen.queryByRole("toolbar")).toBeNull();
    await userEvent.keyboard("{Control>}b{/Control}");
    expect(field.value).toBe("Счёт оплачен");
    unmount();
    render(<Field enabled={false} />);
    field = selectWord();
    expect(screen.queryByRole("toolbar")).toBeNull();
    await userEvent.keyboard("{Control>}b{/Control}");
    expect(field.value).toBe("Счёт оплачен");
  });
});
