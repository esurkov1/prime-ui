import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { MediaViewer } from "@/components/media-viewer/MediaViewer";
import { Modal } from "@/components/modal/Modal";

import { captureOpener, focusBack, handoffFocus, tabStopBeside } from "./focus";

/**
 * Safari does not focus a button on a click: focus stays on the `tabindex="-1"` region around it
 * (or the body). A press is fired without moving focus, as Safari does.
 */
function safariPress(control: HTMLElement) {
  fireEvent.pointerDown(control);
  fireEvent.click(control);
}

describe("opener of a modal layer", () => {
  it("is the pressed control, not the region Safari left focused", () => {
    function Page() {
      const [open, setOpen] = React.useState(false);
      return (
        <main tabIndex={-1}>
          <button type="button" onClick={() => setOpen(true)}>
            Открыть фото
          </button>
          <MediaViewer
            items={[{ src: "/dock.jpg", alt: "Склад" }]}
            open={open}
            onOpenChange={setOpen}
          />
        </main>
      );
    }
    render(<Page />);
    const region = screen.getByRole("main");
    const opener = screen.getByRole("button", { name: "Открыть фото" });
    region.focus();
    safariPress(opener);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    const focus = vi.spyOn(opener, "focus");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
    // Opened by a press: back without the focus ring, though a key closed it.
    expect(focus).toHaveBeenCalledWith(expect.objectContaining({ focusVisible: false }));
    // Wherever `focusVisible` is not supported, the kit hides the ring itself until the next key.
    expect(opener).toHaveAttribute("data-focus-quiet");
    fireEvent.keyDown(document, { key: "Shift" });
    expect(opener).toHaveAttribute("data-focus-quiet");
    fireEvent.keyDown(document, { key: "Tab" });
    expect(opener).not.toHaveAttribute("data-focus-quiet");
  });

  it("is the focused element when a key opened the layer", () => {
    function Page() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Изменить заказ
          </button>
          <Modal.Root open={open} onOpenChange={setOpen}>
            <Modal.Content aria-label="Заказ">
              <Modal.Body>Текст</Modal.Body>
            </Modal.Content>
          </Modal.Root>
        </>
      );
    }
    render(<Page />);
    const opener = screen.getByRole("button", { name: "Изменить заказ" });
    opener.focus();
    fireEvent.click(opener);
    const focus = vi.spyOn(opener, "focus");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(opener).toHaveFocus();
    // Opened by a key: the ring shows where focus lands.
    expect(focus).not.toHaveBeenCalledWith(expect.objectContaining({ focusVisible: false }));
    expect(opener).not.toHaveAttribute("data-focus-quiet");
  });
});

describe("captureOpener", () => {
  it("keeps the element a press landed on, inside the control around it", () => {
    render(
      <button type="button">
        <img alt="Фото склада" src="/dock.jpg" />
      </button>,
    );
    const picture = screen.getByRole("img");
    fireEvent.pointerDown(picture);
    const opener = captureOpener();
    expect(opener.byPointer).toBe(true);
    expect(opener.element).toBe(screen.getByRole("button"));
    expect(opener.target).toBe(picture);
  });

  it("has no press target after a key", () => {
    render(<button type="button">Открыть</button>);
    const button = screen.getByRole("button");
    button.focus();
    fireEvent.keyDown(document, { key: "Enter" });
    expect(captureOpener()).toEqual({ element: button, target: null, byPointer: false });
  });
});

describe("focusBack", () => {
  it("falls back to the first tab stop of the page when the element is gone", () => {
    render(
      <>
        <a href="/orders">Заказы</a>
        <button type="button">Удалить</button>
      </>,
    );
    const gone = document.createElement("button");
    focusBack(gone);
    expect(screen.getByRole("link", { name: "Заказы" })).toHaveFocus();
  });
});

describe("handoffFocus", () => {
  it("moves focus to the part that takes the leaving one's place", () => {
    render(
      <>
        <div data-testid="old">
          <button type="button">Повторить</button>
        </div>
        <div data-testid="new">
          <p>Заказ оплачен</p>
          <button type="button">Открыть счёт</button>
        </div>
      </>,
    );
    screen.getByRole("button", { name: "Повторить" }).focus();
    expect(handoffFocus(screen.getByTestId("old"), screen.getByTestId("new"))).toBe(true);
    expect(screen.getByRole("button", { name: "Открыть счёт" })).toHaveFocus();
  });

  it("focuses a container without tab stops itself", () => {
    render(
      <>
        <button type="button">Закрыть</button>
        <section data-testid="region">Нет заказов</section>
      </>,
    );
    const button = screen.getByRole("button");
    button.focus();
    const region = screen.getByTestId("region");
    handoffFocus(button, region);
    expect(region).toHaveFocus();
    expect(region).toHaveAttribute("tabindex", "-1");
  });

  it("leaves focus alone when the leaving part does not hold it", () => {
    render(
      <>
        <input aria-label="Поиск" />
        <div data-testid="old">
          <button type="button">Повторить</button>
        </div>
        <button type="button">Далее</button>
      </>,
    );
    const search = screen.getByRole("textbox");
    search.focus();
    expect(
      handoffFocus(screen.getByTestId("old"), screen.getByRole("button", { name: "Далее" })),
    ).toBe(false);
    expect(search).toHaveFocus();
  });
});

describe("tabStopBeside", () => {
  it("is the first tab stop after the part, else the last one before it", () => {
    render(
      <>
        <button type="button">Назад</button>
        <div data-testid="banner">
          <button type="button">Скрыть</button>
        </div>
        <a href="#orders">Заказы</a>
      </>,
    );
    const banner = screen.getByTestId("banner");
    expect(tabStopBeside(banner)).toBe(screen.getByRole("link", { name: "Заказы" }));
    screen.getByRole("link").removeAttribute("href");
    expect(tabStopBeside(banner)).toBe(screen.getByRole("button", { name: "Назад" }));
  });
});
