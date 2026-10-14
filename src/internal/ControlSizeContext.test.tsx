import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ControlSizeProvider, useHostTier, useOptionalControlSize } from "./ControlSizeContext";
import type { ControlSize } from "./states";

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

  it("useHostTier: its own size, else the host's, else m — and provides it inside", () => {
    function Root({ size }: { size?: ControlSize }) {
      const tier = useHostTier(size);
      return tier.provide(
        <div data-testid="root" data-size={tier.size}>
          <Probe />
        </div>,
      );
    }
    const { rerender } = render(<Root />);
    expect(screen.getByTestId("root")).toHaveAttribute("data-size", "m");
    expect(screen.getByTestId("probe")).toHaveTextContent("m");
    rerender(
      <ControlSizeProvider value="s">
        <Root />
      </ControlSizeProvider>,
    );
    expect(screen.getByTestId("root")).toHaveAttribute("data-size", "s");
    expect(screen.getByTestId("probe")).toHaveTextContent("s");
    rerender(
      <ControlSizeProvider value="s">
        <Root size="xl" />
      </ControlSizeProvider>,
    );
    expect(screen.getByTestId("probe")).toHaveTextContent("xl");
  });

  it("useHostTier: its own size, else the host's, else m — and provides it inside", () => {
    function Root({ size }: { size?: ControlSize }) {
      const tier = useHostTier(size);
      return tier.provide(
        <div data-testid="root" data-size={tier.size}>
          <Probe />
        </div>,
      );
    }
    const { rerender } = render(<Root />);
    expect(screen.getByTestId("root")).toHaveAttribute("data-size", "m");
    expect(screen.getByTestId("probe")).toHaveTextContent("m");
    rerender(
      <ControlSizeProvider value="s">
        <Root />
      </ControlSizeProvider>,
    );
    expect(screen.getByTestId("root")).toHaveAttribute("data-size", "s");
    expect(screen.getByTestId("probe")).toHaveTextContent("s");
    rerender(
      <ControlSizeProvider value="s">
        <Root size="xl" />
      </ControlSizeProvider>,
    );
    expect(screen.getByTestId("probe")).toHaveTextContent("xl");
  });
});
