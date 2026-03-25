import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ControlSizeProvider, useOptionalControlSize } from "./ControlSizeContext";

function Probe() {
  const v = useOptionalControlSize();
  return <span data-testid="probe">{v ?? "none"}</span>;
}

describe("ControlSizeContext", () => {
  it("передаёт value дочерним компонентам", () => {
    render(
      <ControlSizeProvider value="l">
        <Probe />
      </ControlSizeProvider>,
    );
    expect(screen.getByTestId("probe")).toHaveTextContent("l");
  });

  it("без провайдера возвращает undefined", () => {
    render(<Probe />);
    expect(screen.getByTestId("probe")).toHaveTextContent("none");
  });

  it("внутренний провайдер перекрывает внешний", () => {
    render(
      <ControlSizeProvider value="s">
        <ControlSizeProvider value="xl">
          <Probe />
        </ControlSizeProvider>
      </ControlSizeProvider>,
    );
    expect(screen.getByTestId("probe")).toHaveTextContent("xl");
  });
});
