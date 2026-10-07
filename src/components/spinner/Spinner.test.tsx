import { render, screen } from "@testing-library/react";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { iconBoxStyles as styles } from "@/internal/iconBox";

import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("is a status region named by labels.loading", () => {
    render(<Spinner />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Загрузка");
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
});
