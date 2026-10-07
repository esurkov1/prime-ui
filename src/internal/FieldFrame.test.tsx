import { render, screen } from "@testing-library/react";
import type * as React from "react";
import { describe, expect, it } from "vitest";

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
