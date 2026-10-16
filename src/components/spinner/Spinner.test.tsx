import { act, render, screen } from "@testing-library/react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import enterMotion from "@/internal/enterMotion.module.css";
import { iconBoxStyles as styles } from "@/internal/iconBox";

import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("is a status region named by labels.loading", () => {
    render(<Spinner />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Загрузка");
  });

  it("draws the kit ring with the share unknown: a turning quarter arc at the line weight", () => {
    render(<Spinner />);
    const ring = screen.getByRole("status").querySelector("svg");
    expect(ring).toHaveAttribute("aria-hidden", "true");
    expect(ring).toHaveAttribute("data-spin", "true");
    expect(ring).toHaveAttribute("data-weight", "line");
    expect(ring?.style.getPropertyValue("--ring-value")).toBe("0.25");
  });

  it("takes custom labels", () => {
    render(<Spinner labels={{ loading: "Загружаем счета" }} />);
    expect(screen.getByRole("status")).toHaveTextContent("Загружаем счета");
  });

  it("can be hidden when the host already announces it is busy", () => {
    render(
      <button type="button" aria-busy="true">
        <Spinner aria-hidden="true" />
        Сохранить
      </button>,
    );
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("explicit size uses the icon scale", () => {
    render(<Spinner size="l" data-testid="s" />);
    const el = screen.getByTestId("s");
    expect(el).toHaveAttribute("data-size", "l");
    expect(el).toHaveClass(styles.l);
    expect(el).not.toHaveClass(styles.inherit);
  });

  it("without size follows the nearest control tier", () => {
    render(
      <ControlSizeProvider value="xs">
        <Spinner data-testid="s" />
      </ControlSizeProvider>,
    );
    const el = screen.getByTestId("s");
    expect(el).toHaveAttribute("data-size", "xs");
    expect(el).toHaveClass(styles.inherit);
  });

  it("sets data-tone only for a non-default tone", () => {
    const { rerender } = render(<Spinner data-testid="s" />);
    expect(screen.getByTestId("s")).not.toHaveAttribute("data-tone");
    rerender(<Spinner data-testid="s" tone="muted" />);
    expect(screen.getByTestId("s")).toHaveAttribute("data-tone", "muted");
  });

  it("fades itself in when it appears on a shown host, not when it mounts with it", async () => {
    const host = (loading: boolean) => <div>{loading ? <Spinner data-testid="s" /> : null}</div>;
    const { rerender } = render(host(true));
    expect(screen.getByTestId("s")).not.toHaveClass(enterMotion.enterFade);
    rerender(host(false));
    await act(async () => {});
    rerender(host(true));
    expect(screen.getByTestId("s")).toHaveClass(enterMotion.enterFade);
  });
});
