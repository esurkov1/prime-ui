import { fireEvent, render, screen } from "@testing-library/react";
import type * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import enterMotion from "./enterMotion.module.css";
import { FieldCounter, FieldFrame, type FieldIds, useFieldFrame } from "./FieldFrame";

type ControlAriaOptions = Parameters<FieldIds["controlAria"]>[0];

import { FieldCellContext } from "./fieldCell";

function Frame({
  group,
  hint,
  error,
  counter,
  reserveSupportRow,
}: {
  group?: boolean;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  counter?: React.ReactNode;
  reserveSupportRow?: boolean;
}) {
  const ids = useFieldFrame("field", { hint, error });
  return (
    <FieldFrame
      size="m"
      ids={ids}
      label="Роль"
      hint={hint}
      error={error}
      counter={counter}
      reserveSupportRow={reserveSupportRow}
      optionalLabel="необязательно"
      group={group}
    >
      {group ? (
        <div role="radiogroup" aria-labelledby={ids.labelId} />
      ) : (
        <input id={ids.controlId} />
      )}
    </FieldFrame>
  );
}

/** A picker trigger: a `button` named by the label and its value text. */
function Trigger({
  label = "Дата отгрузки",
  required,
  aria,
}: {
  label?: string;
  required?: boolean;
  aria?: ControlAriaOptions;
}) {
  const ids = useFieldFrame("ship", { label, required });
  return (
    <FieldFrame
      size="m"
      ids={ids}
      label={label}
      required={required}
      optionalLabel="необязательно"
      requiredLabel="обязательное поле"
    >
      <button
        type="button"
        id={ids.controlId}
        {...ids.controlAria({ role: "button", textId: "ship-text", ...aria })}
      >
        <span id="ship-text">12.03.2026</span>
      </button>
    </FieldFrame>
  );
}

describe("FieldFrame", () => {
  it("points the label at the control", () => {
    render(<Frame />);
    expect(screen.getByLabelText("Роль")).toHaveAttribute("id", "field");
  });

  it("a group label has no htmlFor; the group names itself with aria-labelledby", () => {
    const { container } = render(<Frame group />);
    expect(container.querySelector("label")).not.toHaveAttribute("for");
    expect(screen.getByRole("radiogroup", { name: "Роль" })).toBeInTheDocument();
  });

  it("marks a group frame, so one disabled option does not dim the group label", () => {
    const { container, rerender } = render(<Frame group />);
    expect(container.firstElementChild).toHaveAttribute("data-group", "true");
    rerender(<Frame />);
    expect(container.firstElementChild).not.toHaveAttribute("data-group");
  });

  it("keeps an empty support row that takes no room without hint, error, counter or reserve", () => {
    render(<Frame />);
    const row = screen.getByRole("textbox").nextElementSibling;
    expect(row).toHaveAttribute("data-empty", "true");
    expect(row).toHaveTextContent("");
  });

  it("reserves the support row when asked", () => {
    const { container } = render(<Frame reserveSupportRow />);
    expect(container.querySelector('[data-reserve="true"]')).not.toBeNull();
  });

  it("shows the error instead of the hint, next to the counter", () => {
    render(
      <Frame
        hint="Подсказка"
        error="Ошибка"
        counter={<FieldCounter current={5} max={3} size="m" label="{current} из {max}" />}
      />,
    );
    expect(screen.queryByText("Подсказка")).toBeNull();
    expect(screen.getByText("Ошибка")).toHaveAttribute("id", "field-error");
    // The counter is read through its own polite region; the visible `5/3` is hidden from it.
    const spoken = screen.getByText("5 из 3");
    expect(spoken).toHaveAttribute("role", "status");
    expect(spoken.parentElement).toHaveAttribute("data-invalid", "true");
  });

  it("announces an error that arrives through the support slot, a polite region that stays", () => {
    const { rerender } = render(<Frame hint="Видна в профиле" />);
    const slot = screen.getByText("Видна в профиле").parentElement;
    expect(slot).toHaveAttribute("aria-live", "polite");
    rerender(<Frame hint="Видна в профиле" error="Укажите роль" />);
    expect(screen.getByText("Укажите роль").parentElement).toBe(slot);
  });
});

describe("controlAria", () => {
  it("names a trigger by the label and its value text", () => {
    render(<Trigger />);
    expect(screen.getByRole("button")).toHaveAccessibleName("Дата отгрузки 12.03.2026");
  });

  it("a consumer aria-label replaces the label and keeps the value", () => {
    render(<Trigger aria={{ ariaLabel: "Отгрузка", text: "12.03.2026" }} />);
    const trigger = screen.getByRole("button", { name: "Отгрузка: 12.03.2026" });
    expect(trigger).not.toHaveAttribute("aria-labelledby");
  });

  it("describes a required button by the frame's required word: a button takes no aria-required", () => {
    render(<Trigger required />);
    const trigger = screen.getByRole("button");
    expect(trigger).not.toHaveAttribute("aria-required");
    expect(trigger).toHaveAccessibleDescription("обязательное поле");
  });

  it("sets aria-required on a role that takes it", () => {
    render(<Trigger required aria={{ role: "combobox" }} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-required", "true");
    expect(screen.queryByText("обязательное поле")).not.toBeNull();
    expect(screen.getByRole("button")).not.toHaveAccessibleDescription();
  });

  it("a required FieldList column makes the field in its cell required and names it", () => {
    render(
      <FieldCellContext value={{ label: "Количество", hidden: "wide", required: true }}>
        <Trigger label="" aria={{ role: "combobox" }} />
      </FieldCellContext>,
    );
    const trigger = screen.getByRole("button", { name: "Количество 12.03.2026" });
    expect(trigger).toHaveAttribute("aria-required", "true");
  });
});

describe("error shake", () => {
  const root = (container: HTMLElement) => container.firstElementChild as HTMLElement;

  it("does not shake for an error the field mounts with", () => {
    const { container } = render(<Frame error="Укажите роль" />);
    expect(root(container)).not.toHaveAttribute("data-shake");
  });

  it("shakes when the field turns invalid and again for a new message", () => {
    const { container, rerender } = render(<Frame />);
    expect(root(container)).not.toHaveAttribute("data-shake");
    rerender(<Frame error="Укажите роль" />);
    expect(root(container)).toHaveAttribute("data-shake", "odd");
    rerender(<Frame error="Укажите роль" />);
    expect(root(container), "the same message does not replay").toHaveAttribute(
      "data-shake",
      "odd",
    );
    rerender(<Frame error="Роль не найдена" />);
    expect(root(container), "a new message restarts the keyframes").toHaveAttribute(
      "data-shake",
      "even",
    );
    rerender(<Frame />);
    rerender(<Frame error="Укажите роль" />);
    expect(root(container), "an error that comes back shakes again").toHaveAttribute(
      "data-shake",
      "odd",
    );
  });
});

describe("leaving error", () => {
  afterEach(() => vi.restoreAllMocks());

  it("lets the fixed error leave before the hint takes the slot", () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) => ({ matches: false, media: query }) as MediaQueryList,
    );
    const { rerender } = render(<Frame hint="Видна в профиле" error="Укажите роль" />);
    rerender(<Frame hint="Видна в профиле" />);
    const leaving = screen.getByText("Укажите роль");
    expect(leaving).toHaveClass(enterMotion.exit);
    expect(leaving).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByText("Видна в профиле")).toBeNull();
    fireEvent.animationEnd(leaving);
    expect(screen.queryByText("Укажите роль")).toBeNull();
    expect(screen.getByText("Видна в профиле")).toBeInTheDocument();
  });

  it("drops the error at once under reduced motion", () => {
    const { rerender } = render(<Frame hint="Видна в профиле" error="Укажите роль" />);
    rerender(<Frame hint="Видна в профиле" />);
    expect(screen.queryByText("Укажите роль")).toBeNull();
    expect(screen.getByText("Видна в профиле")).toBeInTheDocument();
  });
});
