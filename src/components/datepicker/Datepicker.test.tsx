import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Datepicker } from "./Datepicker";

describe("Datepicker", () => {
  it("Calendar рендерит сетку дней", () => {
    render(<Datepicker.Calendar mode="single" />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("Shell с пресетами показывает кнопки пресетов", () => {
    render(
      <Datepicker.Shell
        presets={
          <Datepicker.Presets
            mode="single"
            presets={[{ label: "Сегодня", date: new Date() }]}
            onSelect={() => {}}
          />
        }
      >
        <span>календарь</span>
      </Datepicker.Shell>,
    );
    expect(screen.getByRole("button", { name: "Сегодня" })).toBeInTheDocument();
    expect(screen.getByText("календарь")).toBeInTheDocument();
  });
});
