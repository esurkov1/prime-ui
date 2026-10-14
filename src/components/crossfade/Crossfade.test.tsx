import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import swapMotion from "@/internal/swapMotion.module.css";
import { withMotion } from "@/test/motion";

import { Crossfade } from "./Crossfade";

const layerOf = (text: string) => screen.getByText(text).parentElement as HTMLElement;

describe("Crossfade", () => {
  it("is a plain region: the ref and the attributes reach its div", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Crossfade ref={ref} state="loading" aria-busy="true" aria-live="polite" className="panel">
        <p>Загрузка</p>
      </Crossfade>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("aria-busy", "true");
    expect(ref.current).toHaveAttribute("aria-live", "polite");
    expect(ref.current).toHaveClass("panel");
    expect(layerOf("Загрузка")).not.toHaveClass(swapMotion.swapIn);
  });

  it("cross-fades a new state: the old one leaves hidden from assistive tech and Tab", () => {
    withMotion();
    const { rerender } = render(
      <Crossfade state="loading">
        <p>Загрузка</p>
      </Crossfade>,
    );
    rerender(
      <Crossfade state="ready">
        <p>Данные</p>
      </Crossfade>,
    );
    const leaving = layerOf("Загрузка");
    expect(leaving).toHaveAttribute("aria-hidden", "true");
    expect(leaving).toHaveAttribute("inert");
    expect(layerOf("Данные")).toHaveClass(swapMotion.swapIn);
    fireEvent.animationEnd(leaving);
    expect(screen.queryByText("Загрузка")).toBeNull();
  });

  it("focus on the retry button of an error moves into the loaded state", () => {
    const { rerender } = render(
      <Crossfade state="error">
        <button type="button">Повторить</button>
      </Crossfade>,
    );
    const retry = screen.getByRole("button", { name: "Повторить" });
    retry.focus();
    rerender(
      <Crossfade state="ready">
        <button type="button">Разнести платежи</button>
      </Crossfade>,
    );
    expect(screen.getByRole("button", { name: "Разнести платежи" })).toHaveFocus();
  });

  it("fill: the region takes its parent's height", () => {
    const { container } = render(
      <Crossfade state="ready" fill>
        <p>Доска</p>
      </Crossfade>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-fill", "true");
  });
});
