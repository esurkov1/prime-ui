import { fireEvent, render, screen } from "@testing-library/react";
import type * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Checkbox } from "@/components/checkbox/Checkbox";

import { FieldCounter, FieldFrame, useFieldFrame } from "./FieldFrame";

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

  it("renders no support row without hint, error, counter or reserve", () => {
    render(<Frame />);
    // The body holds the control alone.
    expect(screen.getByRole("textbox").parentElement?.children).toHaveLength(1);
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
    expect(screen.getByText("5 из 3")).toBeInTheDocument();
    expect(screen.getByText("5 из 3").closest("[aria-live]")).toHaveAttribute(
      "data-invalid",
      "true",
    );
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

  it("shakes a choice row (Checkbox) when its error arrives", () => {
    const { rerender } = render(
      <Checkbox.Root>
        <Checkbox.Label>Принимаю условия договора</Checkbox.Label>
      </Checkbox.Root>,
    );
    const row = () => screen.getByRole("checkbox").closest("label") as HTMLElement;
    expect(row()).not.toHaveAttribute("data-shake");
    rerender(
      <Checkbox.Root error="Без согласия не продолжить">
        <Checkbox.Label>Принимаю условия договора</Checkbox.Label>
      </Checkbox.Root>,
    );
    expect(row()).toHaveAttribute("data-shake", "odd");
  });
});

describe("leaving error", () => {
  afterEach(() => vi.restoreAllMocks());

  it("fades the fixed error out before the hint takes the slot", () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) => ({ matches: false, media: query }) as MediaQueryList,
    );
    const { rerender } = render(<Frame hint="Видна в профиле" error="Укажите роль" />);
    rerender(<Frame hint="Видна в профиле" />);
    const leaving = screen.getByText("Укажите роль");
    expect(leaving).toHaveAttribute("data-state", "closed");
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
