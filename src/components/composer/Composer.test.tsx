import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Modal } from "@/components/modal/Modal";
import { type UploadItem, useUploadQueue } from "@/hooks/useUploadQueue";
import { DisabledProvider } from "@/internal/disabledContext";
import { Composer, type ComposerQueue } from "./Composer";
import styles from "./Composer.module.css";

const field = () => screen.getByRole("textbox", { name: "Сообщение" });

function fakeQueue(items: UploadItem[] = []): ComposerQueue {
  return {
    items,
    add: vi.fn(() => []),
    retry: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
    move: vi.fn(),
  };
}

/** A composer over a queue that really reorders (`move`) and removes, for the tray order. */
function Ordered({
  initial,
  onSend,
}: {
  initial: UploadItem[];
  onSend?: (message: unknown) => void;
}) {
  const [items, setItems] = React.useState(initial);
  const queue: ComposerQueue = {
    ...fakeQueue(items),
    remove: (id) => setItems((current) => current.filter((entry) => entry.id !== id)),
    move: (id, beforeId) =>
      setItems((current) => {
        const item = current.find((entry) => entry.id === id);
        if (!item) return current;
        const rest = current.filter((entry) => entry !== item);
        const at = beforeId === null ? rest.length : rest.findIndex((e) => e.id === beforeId);
        return [...rest.slice(0, at), item, ...rest.slice(at)];
      }),
  };
  return <Composer.Root queue={queue} onSend={onSend} />;
}

const doneItem = (name: string): UploadItem => ({
  id: name,
  file: new File(["x"], name, { type: "application/pdf" }),
  status: "done",
  progress: 1,
});

const mediaItem = (name: string, type: string): UploadItem => ({
  id: name,
  file: new File(["x"], name, { type }),
  status: "done",
  progress: 1,
  preview: `blob:${name}`,
});

/** The tile names of the tray, in order. */
const trayNames = () =>
  Array.from(
    screen.getByRole("list", { name: "Вложения" }).querySelectorAll("[data-dnd-item]"),
  ).map((tile) => tile.getAttribute("aria-label"));

describe("Composer.Root", () => {
  it("is a named form with a message field", () => {
    render(<Composer.Root />);
    expect(screen.getByRole("form", { name: "Новое сообщение" })).toBeInTheDocument();
    expect(field()).toHaveAttribute("placeholder", "Сообщение");
  });

  it("Enter sends the trimmed text, clears the field and keeps focus", () => {
    const onSend = vi.fn();
    render(<Composer.Root onSend={onSend} />);
    const textarea = field();
    textarea.focus();
    fireEvent.change(textarea, { target: { value: "  Счёт отправлен  " } });
    fireEvent.keyDown(textarea, { key: "Enter" });
    expect(onSend).toHaveBeenCalledWith({ text: "Счёт отправлен", albums: [], files: [] });
    expect(textarea).toHaveValue("");
    expect(textarea).toHaveFocus();
  });

  it("Shift+Enter is a new line; Mod+Enter always sends", () => {
    const onSend = vi.fn();
    render(<Composer.Root onSend={onSend} />);
    fireEvent.change(field(), { target: { value: "Привет" } });
    fireEvent.keyDown(field(), { key: "Enter", shiftKey: true });
    expect(onSend).not.toHaveBeenCalled();
    fireEvent.keyDown(field(), { key: "Enter", ctrlKey: true });
    expect(onSend).toHaveBeenCalledTimes(1);
  });

  it("does not send an empty message", () => {
    const onSend = vi.fn();
    render(<Composer.Root onSend={onSend} />);
    fireEvent.change(field(), { target: { value: "   " } });
    fireEvent.keyDown(field(), { key: "Enter" });
    expect(onSend).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Отправить" })).toBeDisabled();
  });

  it("an async send keeps the text while pending and clears it on resolve", async () => {
    let resolve: () => void = () => {};
    const onSend = vi.fn(() => new Promise<void>((r) => (resolve = r)));
    render(<Composer.Root onSend={onSend} />);
    fireEvent.change(field(), { target: { value: "Договор во вложении" } });
    fireEvent.click(screen.getByRole("button", { name: "Отправить" }));
    expect(field()).toHaveValue("Договор во вложении");
    expect(field()).toHaveAttribute("readonly");
    expect(screen.getByRole("button", { name: "Отправить" })).toHaveAttribute("aria-busy", "true");
    await act(async () => resolve());
    expect(field()).toHaveValue("");
    expect(field()).not.toHaveAttribute("readonly");
  });

  it("a rejected send leaves the text", async () => {
    let reject: () => void = () => {};
    const onSend = vi.fn(() => new Promise<void>((_, r) => (reject = r)));
    render(<Composer.Root onSend={onSend} />);
    fireEvent.change(field(), { target: { value: "Черновик" } });
    fireEvent.keyDown(field(), { key: "Enter" });
    await act(async () => reject());
    expect(field()).toHaveValue("Черновик");
    expect(field()).not.toHaveAttribute("readonly");
  });

  it("is controlled through value / onValueChange", () => {
    function Controlled() {
      const [value, setValue] = React.useState("Итог");
      return <Composer.Root value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);
    expect(field()).toHaveValue("Итог");
    fireEvent.change(field(), { target: { value: "Итог: 4 800 ₽" } });
    expect(field()).toHaveValue("Итог: 4 800 ₽");
  });

  it("sends uploaded files and clears the queue", () => {
    const onSend = vi.fn();
    const queue = fakeQueue([doneItem("akt.pdf")]);
    render(<Composer.Root onSend={onSend} queue={queue} />);
    fireEvent.click(screen.getByRole("button", { name: "Отправить" }));
    expect(onSend).toHaveBeenCalledWith({ text: "", albums: [], files: queue.items });
    expect(queue.clear).toHaveBeenCalled();
  });

  it("waits for uploads before sending", () => {
    const queue = fakeQueue([{ ...doneItem("akt.pdf"), status: "loading", progress: 0.4 }]);
    render(<Composer.Root onSend={vi.fn()} queue={queue} defaultValue="Акт" />);
    expect(screen.getByRole("button", { name: "Отправить" })).toBeDisabled();
  });

  it("↑ in an empty field asks to edit the last message", () => {
    const onEditLast = vi.fn();
    render(<Composer.Root onEditLast={onEditLast} />);
    fireEvent.keyDown(field(), { key: "ArrowUp" });
    expect(onEditLast).toHaveBeenCalledTimes(1);
    fireEvent.change(field(), { target: { value: "текст" } });
    fireEvent.keyDown(field(), { key: "ArrowUp" });
    expect(onEditLast).toHaveBeenCalledTimes(1);
  });

  it("is disabled as a whole", () => {
    render(<Composer.Root disabled defaultValue="Заблокировано" />);
    expect(field()).toBeDisabled();
    expect(screen.getByRole("button", { name: "Отправить" })).toBeDisabled();
  });

  it("takes disabled from a disabled Fieldset around it", () => {
    render(
      <DisabledProvider disabled>
        <Composer.Root defaultValue="Заблокировано" />
      </DisabledProvider>,
    );
    expect(screen.getByRole("form")).toHaveAttribute("data-disabled", "true");
    expect(field()).toBeDisabled();
    expect(screen.getByRole("button", { name: "Отправить" })).toBeDisabled();
  });

  describe("on a touch screen", () => {
    beforeEach(() => {
      vi.stubGlobal(
        "matchMedia",
        (query: string) =>
          ({
            matches: query.includes("pointer: coarse") || query.includes("reduce"),
            media: query,
            addEventListener: () => {},
            removeEventListener: () => {},
          }) as unknown as MediaQueryList,
      );
    });
    afterEach(() => vi.unstubAllGlobals());

    it("Enter is a new line and the button sends", () => {
      const onSend = vi.fn();
      render(<Composer.Root onSend={onSend} />);
      fireEvent.change(field(), { target: { value: "С телефона" } });
      fireEvent.keyDown(field(), { key: "Enter" });
      expect(onSend).not.toHaveBeenCalled();
      expect(field()).toHaveAttribute("enterkeyhint", "enter");
      fireEvent.click(screen.getByRole("button", { name: "Отправить" }));
      expect(onSend).toHaveBeenCalledTimes(1);
    });
  });
});

describe("Composer.Context", () => {
  it("reply bar: Escape and the close button dismiss it", () => {
    const onDismiss = vi.fn();
    render(
      <Composer.Root>
        <Composer.Context onDismiss={onDismiss}>
          <Composer.Title>Ответ Анне</Composer.Title>
          <Composer.Description>Пришлите акт сверки</Composer.Description>
        </Composer.Context>
      </Composer.Root>,
    );
    expect(field()).toHaveAccessibleDescription(/Ответ Анне/);
    fireEvent.keyDown(field(), { key: "Escape" });
    expect(onDismiss).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Отменить ответ" }));
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });

  it("edit mode turns send into save", () => {
    render(
      <Composer.Root defaultValue="Исправленный текст">
        <Composer.Context mode="edit" onDismiss={() => {}}>
          <Composer.Title>Редактирование</Composer.Title>
        </Composer.Context>
      </Composer.Root>,
    );
    expect(screen.getByRole("button", { name: "Сохранить" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Отменить редактирование" })).toBeInTheDocument();
  });

  it("a bar shown later brings focus to the field", async () => {
    function Later() {
      const [reply, setReply] = React.useState(false);
      return (
        <>
          <button type="button" onClick={() => setReply(true)}>
            Ответить
          </button>
          <Composer.Root>
            {reply ? (
              <Composer.Context>
                <Composer.Title>Ответ Анне</Composer.Title>
              </Composer.Context>
            ) : null}
          </Composer.Root>
        </>
      );
    }
    render(<Later />);
    expect(field()).not.toHaveFocus();
    fireEvent.click(screen.getByRole("button", { name: "Ответить" }));
    await waitFor(() => expect(field()).toHaveFocus());
  });

  it("a send carries the bar's message id as replyTo / editOf and closes the bar", async () => {
    const onSend = vi.fn();
    const onDismiss = vi.fn();
    const { rerender } = render(
      <Composer.Root onSend={onSend} defaultValue="Пришлю сегодня">
        <Composer.Context messageId="m7" onDismiss={onDismiss}>
          <Composer.Title>Ответ Анне</Composer.Title>
        </Composer.Context>
      </Composer.Root>,
    );
    fireEvent.keyDown(field(), { key: "Enter" });
    expect(onSend).toHaveBeenLastCalledWith({
      text: "Пришлю сегодня",
      albums: [],
      files: [],
      replyTo: "m7",
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);

    let resolve: () => void = () => {};
    const slowSend = vi.fn(() => new Promise<void>((r) => (resolve = r)));
    rerender(
      <Composer.Root onSend={slowSend} defaultValue="">
        <Composer.Context mode="edit" messageId="m9" onDismiss={onDismiss}>
          <Composer.Title>Редактирование</Composer.Title>
        </Composer.Context>
      </Composer.Root>,
    );
    fireEvent.change(field(), { target: { value: "Акт к пятнице" } });
    fireEvent.click(screen.getByRole("button", { name: "Сохранить" }));
    expect(slowSend).toHaveBeenLastCalledWith({
      text: "Акт к пятнице",
      albums: [],
      files: [],
      editOf: "m9",
    });
    // Pending: the bar stays until the save goes through.
    expect(onDismiss).toHaveBeenCalledTimes(1);
    await act(async () => resolve());
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });
});

describe("one row: paperclip · field · action", () => {
  const row = () => {
    const found = screen.getByRole("form").querySelector("[data-composer-row]");
    if (!found) throw new Error("no row");
    return found;
  };
  const expectOneRow = (action: string) => {
    const cells = Array.from(row().children);
    const cellOf = (node: Element) => cells.findIndex((cell) => cell.contains(node));
    expect(cellOf(screen.getByRole("button", { name: "Прикрепить" }))).toBe(0);
    expect(cellOf(field())).toBe(1);
    expect(cellOf(screen.getByRole("button", { name: action }))).toBe(cells.length - 1);
  };

  /** A paperclip behind a wrapper: what a reloaded or wrapped component type looks like. */
  function WrappedAttach() {
    return <Composer.Attach />;
  }

  it("keeps the paperclip in the row wherever and however it is passed", () => {
    const { rerender } = render(
      <Composer.Root onSend={() => {}}>
        <Composer.Context onDismiss={() => {}}>
          <Composer.Title>Ответ Анне</Composer.Title>
        </Composer.Context>
        <Composer.Attach />
      </Composer.Root>,
    );
    expectOneRow("Отправить");
    // The bar stays above the row, never inside it.
    expect(row().textContent).not.toContain("Ответ Анне");
    rerender(
      <Composer.Root onSend={() => {}}>
        <WrappedAttach />
      </Composer.Root>,
    );
    expectOneRow("Отправить");
  });

  it("stays one row with attachments, after a send and with formatting off", () => {
    const { rerender } = render(
      <Composer.Root
        onSend={() => {}}
        queue={fakeQueue([doneItem("Акт.pdf"), mediaItem("склад.jpg", "image/jpeg")])}
      >
        <Composer.Attach />
      </Composer.Root>,
    );
    expectOneRow("Отправить");
    expect(row().textContent).not.toContain("Акт.pdf");
    // The tray stands above the row, never in it.
    expect(row().contains(screen.getByRole("list", { name: "Вложения" }))).toBe(false);
    expect(row().children).toHaveLength(3);
    fireEvent.click(screen.getByRole("button", { name: "Отправить" }));
    rerender(
      <Composer.Root onSend={() => {}} queue={fakeQueue()} formatting={false}>
        <WrappedAttach />
      </Composer.Root>,
    );
    expectOneRow("Отправить");
  });
});

describe("onActivityChange", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("typing starts with a keystroke and ends on rest, on clearing and on send", () => {
    const onActivityChange = vi.fn();
    const { unmount } = render(
      <Composer.Root onActivityChange={onActivityChange} onSend={() => {}} />,
    );
    expect(onActivityChange).not.toHaveBeenCalled();
    fireEvent.change(field(), { target: { value: "Д" } });
    fireEvent.change(field(), { target: { value: "До" } });
    expect(onActivityChange.mock.calls).toEqual([["typing"]]);
    act(() => vi.advanceTimersByTime(2900));
    fireEvent.change(field(), { target: { value: "Доб" } });
    act(() => vi.advanceTimersByTime(2900));
    expect(onActivityChange.mock.calls).toEqual([["typing"]]);
    act(() => vi.advanceTimersByTime(200));
    expect(onActivityChange).toHaveBeenLastCalledWith(null);

    fireEvent.change(field(), { target: { value: "Добрый" } });
    fireEvent.change(field(), { target: { value: "" } });
    expect(onActivityChange.mock.calls).toEqual([["typing"], [null], ["typing"], [null]]);

    fireEvent.change(field(), { target: { value: "Добрый день" } });
    fireEvent.keyDown(field(), { key: "Enter" });
    expect(onActivityChange).toHaveBeenLastCalledWith(null);

    fireEvent.change(field(), { target: { value: "И ещё" } });
    unmount();
    expect(onActivityChange).toHaveBeenLastCalledWith(null);
  });
});

describe("formatting", () => {
  const select = (start: number, end: number) => {
    const textarea = field() as HTMLTextAreaElement;
    textarea.focus();
    textarea.setSelectionRange(start, end);
    fireEvent.select(textarea);
  };

  it("Mod+B, Mod+Shift+X and Mod+K format the selection", () => {
    render(<Composer.Root defaultValue="Срок до пятницы" />);
    select(5, 15);
    fireEvent.keyDown(field(), { key: "b", code: "KeyB", ctrlKey: true });
    expect(field()).toHaveValue("Срок **до пятницы**");
    fireEvent.keyDown(field(), { key: "X", code: "KeyX", ctrlKey: true, shiftKey: true });
    expect(field()).toHaveValue("Срок **~~до пятницы~~**");
    fireEvent.keyDown(field(), { key: "z", code: "KeyB", ctrlKey: true, shiftKey: true });
    expect(field()).toHaveValue("Срок **~~до пятницы~~**");
  });

  it("Mod+I, Mod+E, Mod+Shift+H and Mod+K format the selection", () => {
    render(<Composer.Root defaultValue="срок" />);
    select(0, 4);
    fireEvent.keyDown(field(), { key: "i", code: "KeyI", ctrlKey: true });
    expect(field()).toHaveValue("_срок_");
    select(1, 5);
    fireEvent.keyDown(field(), { key: "e", code: "KeyE", metaKey: true });
    expect(field()).toHaveValue("_`срок`_");
    select(2, 6);
    fireEvent.keyDown(field(), { key: "H", code: "KeyH", ctrlKey: true, shiftKey: true });
    expect(field()).toHaveValue("_`||срок||`_");
    select(4, 8);
    fireEvent.keyDown(field(), { key: "k", code: "KeyK", ctrlKey: true });
    expect(field()).toHaveValue("_`||[срок](https://)||`_");
  });

  it("Mod+Shift+9 quotes the selection", async () => {
    const user = userEvent.setup();
    render(<Composer.Root defaultValue="Счёт оплачен" />);
    select(0, 12);
    await user.keyboard("{Control>}{Shift>}9{/Shift}{/Control}");
    expect(field()).toHaveValue("> Счёт оплачен");
  });

  it("the hotkeys work on a Russian layout", () => {
    render(<Composer.Root defaultValue="важно" />);
    select(0, 5);
    fireEvent.keyDown(field(), { key: "ш", code: "KeyI", metaKey: true });
    expect(field()).toHaveValue("_важно_");
  });

  it("a selection shows the toolbar; its button formats", () => {
    render(<Composer.Root defaultValue="Смета готова" />);
    expect(screen.queryByRole("toolbar")).toBeNull();
    select(0, 5);
    const toolbar = screen.getByRole("toolbar", { name: "Форматирование" });
    expect(toolbar).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Моноширинный" }));
    expect(field()).toHaveValue("`Смета` готова");
  });

  it("the toolbar moves focus with the arrow keys", () => {
    render(<Composer.Root defaultValue="Смета готова" />);
    select(0, 5);
    const bold = screen.getByRole("button", { name: "Жирный" });
    expect(bold).toHaveAttribute("tabindex", "0");
    bold.focus();
    fireEvent.keyDown(bold, { key: "ArrowRight" });
    expect(screen.getByRole("button", { name: "Курсив" })).toHaveFocus();
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: "End" });
    const buttons = screen
      .getAllByRole("button", { name: /./ })
      .filter((button) => screen.getByRole("toolbar", { name: "Форматирование" }).contains(button));
    expect(buttons.at(-1)).toHaveFocus();
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: "Home" });
    expect(bold).toHaveFocus();
  });

  it("formatting={false} leaves the keys alone", () => {
    render(<Composer.Root formatting={false} defaultValue="текст" />);
    select(0, 5);
    fireEvent.keyDown(field(), { key: "b", code: "KeyB", ctrlKey: true });
    expect(field()).toHaveValue("текст");
    expect(screen.queryByRole("toolbar")).toBeNull();
  });
});

describe("attachments", () => {
  it("a pasted file goes to the queue", () => {
    const queue = fakeQueue();
    render(<Composer.Root queue={queue} />);
    const file = new File(["png"], "скриншот.png", { type: "image/png" });
    fireEvent.paste(field(), { clipboardData: { files: [file], types: ["Files"] } });
    expect(queue.add).toHaveBeenCalledWith([file]);
  });

  it("a dropped file goes to the queue", () => {
    const queue = fakeQueue();
    render(<Composer.Root queue={queue} />);
    const file = new File(["pdf"], "счёт.pdf", { type: "application/pdf" });
    const form = screen.getByRole("form");
    const dataTransfer = { files: [file], types: ["Files"] };
    fireEvent.dragEnter(form, { dataTransfer });
    expect(form).toHaveAttribute("data-dropping", "true");
    fireEvent.drop(form, { dataTransfer });
    expect(queue.add).toHaveBeenCalledWith([file]);
    expect(form).not.toHaveAttribute("data-dropping");
  });

  it("the paperclip picks files into the queue", () => {
    const queue = fakeQueue();
    const { container } = render(
      <Composer.Root queue={queue}>
        <Composer.Attach />
      </Composer.Root>,
    );
    expect(screen.getByRole("button", { name: "Прикрепить" })).toBeInTheDocument();
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["a"], "акт.pdf");
    fireEvent.change(input, { target: { files: [file] } });
    expect(queue.add).toHaveBeenCalledWith([file]);
  });

  it("every attachment is a tile of one strip, in the order attached", () => {
    render(
      <Composer.Root
        queue={fakeQueue([
          mediaItem("склад.jpg", "image/jpeg"),
          doneItem("акт.pdf"),
          mediaItem("обзор.mp4", "video/mp4"),
          // No MIME type: the name decides.
          mediaItem("стеллаж.heic", ""),
        ])}
      />,
    );
    expect(trayNames()).toEqual([
      "Фото 1: склад.jpg",
      "Файл 2: акт.pdf",
      "Видео 3: обзор.mp4",
      "Фото 4: стеллаж.heic",
    ]);
    // One list: no rows of files beside the strip.
    expect(screen.getAllByRole("list")).toHaveLength(1);
    expect(screen.getByRole("list", { name: "Вложения" })).toHaveAttribute("data-axis", "x");
  });

  it("Delete and Backspace on a tile remove it; focus moves to its neighbour", () => {
    render(
      <Ordered initial={[doneItem("акт.pdf"), doneItem("счёт.pdf"), doneItem("смета.pdf")]} />,
    );
    const tile = (name: RegExp) => screen.getByRole("listitem", { name });
    tile(/счёт\.pdf/).focus();
    fireEvent.keyDown(tile(/счёт\.pdf/), { key: "Delete" });
    expect(trayNames()).toEqual(["Файл 1: акт.pdf", "Файл 2: смета.pdf"]);
    expect(document.activeElement).toBe(tile(/смета\.pdf/));
    fireEvent.keyDown(tile(/смета\.pdf/), { key: "Backspace" });
    expect(trayNames()).toEqual(["Файл 1: акт.pdf"]);
    expect(document.activeElement).toBe(tile(/акт\.pdf/));
  });

  it("Alt+→ reorders the mixed tray; media keep their order in the album, files theirs", () => {
    const onSend = vi.fn();
    render(
      <Ordered
        initial={[
          mediaItem("склад.jpg", "image/jpeg"),
          doneItem("акт.pdf"),
          mediaItem("обзор.mp4", "video/mp4"),
          doneItem("счёт.pdf"),
        ]}
        onSend={onSend}
      />,
    );
    // The photo goes past the act and the video; the bill goes first.
    const photo = () => screen.getByRole("listitem", { name: /склад\.jpg/ });
    fireEvent.keyDown(photo(), { key: "ArrowRight", altKey: true });
    fireEvent.keyDown(photo(), { key: "ArrowRight", altKey: true });
    for (let step = 0; step < 3; step += 1) {
      fireEvent.keyDown(screen.getByRole("listitem", { name: /счёт\.pdf/ }), {
        key: "ArrowLeft",
        altKey: true,
      });
    }
    expect(trayNames()).toEqual([
      "Файл 1: счёт.pdf",
      "Файл 2: акт.pdf",
      "Видео 3: обзор.mp4",
      "Фото 4: склад.jpg",
    ]);
    fireEvent.click(screen.getByRole("button", { name: "Отправить" }));
    const message = onSend.mock.calls[0]?.[0] as {
      albums: { id: string; type: string }[][];
      files: UploadItem[];
    };
    expect(message.albums.map((album) => album.map((item) => [item.id, item.type]))).toEqual([
      [
        ["обзор.mp4", "video"],
        ["склад.jpg", "image"],
      ],
    ]);
    expect(message.files.map((item) => item.id)).toEqual(["счёт.pdf", "акт.pdf"]);
  });

  it("a drag in the tray reorders the album", () => {
    // jsdom lays nothing out: the tiles stand in a row, 80 px each (the lifted one takes no room).
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      let box = { left: 0, top: 0, width: 400, height: 80 };
      if (this.hasAttribute("data-dnd-item") || this.hasAttribute("data-dnd-gap")) {
        const siblings = Array.from(this.parentElement?.children ?? []);
        const before = siblings
          .slice(0, siblings.indexOf(this))
          .filter((node) => !node.hasAttribute("data-lifted")).length;
        const hidden = this.hasAttribute("data-lifted");
        box = { left: before * 80, top: 0, width: hidden ? 0 : 80, height: hidden ? 0 : 80 };
      }
      return {
        ...box,
        right: box.left + box.width,
        bottom: box.top + box.height,
        x: box.left,
        y: box.top,
        toJSON: () => ({}),
      };
    });
    const onSend = vi.fn();
    render(
      <Ordered
        initial={[
          mediaItem("1.jpg", "image/jpeg"),
          mediaItem("2.jpg", "image/jpeg"),
          mediaItem("3.jpg", "image/jpeg"),
        ]}
        onSend={onSend}
      />,
    );
    const pointer = { pointerId: 1, pointerType: "mouse", button: 0 };
    fireEvent.pointerDown(screen.getByRole("listitem", { name: "Фото 1: 1.jpg" }), {
      ...pointer,
      clientX: 10,
      clientY: 10,
    });
    // Past the middle of the second tile, before the middle of the third.
    fireEvent.pointerMove(window, { ...pointer, clientX: 90, clientY: 10 });
    fireEvent.pointerUp(window, { ...pointer, clientX: 90, clientY: 10 });
    vi.restoreAllMocks();
    expect(trayNames()).toEqual(["Фото 1: 2.jpg", "Фото 2: 1.jpg", "Фото 3: 3.jpg"]);
    fireEvent.click(screen.getByRole("button", { name: "Отправить" }));
    expect(onSend.mock.calls[0]?.[0].albums[0].map((item: UploadItem) => item.id)).toEqual([
      "2.jpg",
      "1.jpg",
      "3.jpg",
    ]);
  });

  it("«как файлы» changes only the payload: the photos stay in the strip and go as files", () => {
    const onSend = vi.fn();
    render(
      <Composer.Root
        queue={fakeQueue([mediaItem("склад.jpg", "image/jpeg"), doneItem("акт.pdf")])}
        onSend={onSend}
      />,
    );
    const before = trayNames();
    fireEvent.click(screen.getByRole("checkbox", { name: "Отправить как файлы, без сжатия" }));
    expect(trayNames()).toEqual(before);
    expect(before).toEqual(["Фото 1: склад.jpg", "Файл 2: акт.pdf"]);
    fireEvent.click(screen.getByRole("button", { name: "Отправить" }));
    const message = onSend.mock.calls[0]?.[0];
    expect(message.albums).toEqual([]);
    expect(message.files.map((item: UploadItem) => item.id)).toEqual(["склад.jpg", "акт.pdf"]);
    expect(message.files[0]).not.toHaveProperty("type");
  });

  it("splits photos and videos into albums of ten, the most a Gallery lays out", () => {
    const onSend = vi.fn();
    const photos = Array.from({ length: 23 }, (_, index) =>
      mediaItem(`склад-${index + 1}.jpg`, "image/jpeg"),
    );
    render(<Composer.Root queue={fakeQueue(photos)} onSend={onSend} />);
    fireEvent.click(screen.getByRole("button", { name: "Отправить" }));
    const { albums } = onSend.mock.calls[0]?.[0] as { albums: UploadItem[][] };
    expect(albums.map((album) => album.length)).toEqual([10, 10, 3]);
    expect(albums[1]?.[0]?.id).toBe("склад-11.jpg");
  });

  it("without photos or videos there is no «как файлы» option", () => {
    render(<Composer.Root queue={fakeQueue([doneItem("акт.pdf")])} />);
    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  it("many pasted screenshots with no MIME type land in the strip", () => {
    function Live() {
      const queue = useUploadQueue({ upload: () => new Promise<string>(() => {}) });
      return <Composer.Root queue={queue} />;
    }
    render(<Live />);
    // A clipboard file with no type and no name: its clipboard item says it is a PNG.
    const bare = Array.from({ length: 4 }, () => new File(["p"], "", { type: "" }));
    // A file with no type but an image name.
    const named = Array.from({ length: 4 }, (_, i) => new File(["p"], `Снимок ${i}.png`));
    const files = [...bare, ...named];
    const items = files.map((file) => ({
      kind: "file",
      type: file.name ? "" : "image/png",
      getAsFile: () => file,
    }));
    act(() => {
      fireEvent.paste(field(), { clipboardData: { files, items, types: ["Files"] } });
    });
    expect(trayNames()).toHaveLength(8);
    expect(trayNames().every((name) => name?.startsWith("Фото"))).toBe(true);
  });

  it("forty attachments stay one row that scrolls sideways: the tray height is one tile", () => {
    render(
      <Composer.Root
        queue={fakeQueue([
          ...Array.from({ length: 20 }, (_, i) => mediaItem(`фото-${i}.jpg`, "image/jpeg")),
          ...Array.from({ length: 20 }, (_, i) => doneItem(`акт-${i}.pdf`)),
        ])}
      />,
    );
    const strip = screen.getByRole("list", { name: "Вложения" });
    expect(strip).toHaveAttribute("data-axis", "x");
    expect(strip.className).toMatch(/strip/);
    // The scroller around it: sideways, faded edges.
    expect(strip.parentElement).toHaveAttribute("data-edges", "fade");
    expect(trayNames()).toHaveLength(40);
  });

  it("a preview URL is revoked when its tile is removed and when the message is sent", async () => {
    let next = 0;
    const create = vi.fn(() => `blob:preview-${++next}`);
    const revoke = vi.fn();
    const original = { create: URL.createObjectURL, revoke: URL.revokeObjectURL };
    URL.createObjectURL = create;
    URL.revokeObjectURL = revoke;
    try {
      function Live() {
        const queue = useUploadQueue({ upload: async () => "ok" });
        return <Composer.Root queue={queue} onSend={() => {}} />;
      }
      render(<Live />);
      const files = [
        new File(["a"], "склад.jpg", { type: "image/jpeg" }),
        new File(["b"], "обзор.mp4", { type: "video/mp4" }),
      ];
      await act(async () => {
        fireEvent.paste(field(), { clipboardData: { files, types: ["Files"] } });
      });
      expect(create).toHaveBeenCalledTimes(2);
      fireEvent.click(screen.getByRole("button", { name: "Убрать склад.jpg" }));
      expect(revoke).toHaveBeenCalledWith("blob:preview-1");
      await waitFor(() =>
        expect(screen.getByRole("button", { name: "Отправить" })).not.toBeDisabled(),
      );
      fireEvent.click(screen.getByRole("button", { name: "Отправить" }));
      expect(revoke).toHaveBeenCalledWith("blob:preview-2");
    } finally {
      URL.createObjectURL = original.create;
      URL.revokeObjectURL = original.revoke;
    }
  });

  it("with kinds the paperclip opens a menu", () => {
    render(
      <Composer.Root queue={fakeQueue()}>
        <Composer.Attach>
          <Composer.Item accept="image/*,video/*">Фото или видео</Composer.Item>
          <Composer.Item>Файл</Composer.Item>
        </Composer.Attach>
      </Composer.Root>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Прикрепить" }));
    expect(screen.getByRole("menuitem", { name: "Фото или видео" })).toBeInTheDocument();
  });
});

// ─── Recording ───────────────────────────────────────────────────────────────

class FakeRecorder extends EventTarget {
  static isTypeSupported = () => true;
  state: RecordingState = "inactive";
  mimeType = "audio/webm";
  start() {
    this.state = "recording";
  }
  pause() {
    this.state = "paused";
  }
  resume() {
    this.state = "recording";
  }
  stop() {
    this.state = "inactive";
    const event = new Event("dataavailable") as Event & { data: Blob };
    event.data = new Blob(["voice"], { type: "audio/webm" });
    this.dispatchEvent(event);
    this.dispatchEvent(new Event("stop"));
  }
}

class FakeAudioContext {
  static created = 0;
  state: AudioContextState = "running";
  constructor() {
    FakeAudioContext.created += 1;
  }
  createAnalyser() {
    return {
      fftSize: 2048,
      getFloatTimeDomainData: (buffer: Float32Array) => buffer.fill(0.1),
    };
  }
  createMediaStreamSource() {
    return { connect: () => {}, disconnect: () => {} };
  }
  resume() {
    this.state = "running";
    return Promise.resolve();
  }
  suspend() {
    this.state = "suspended";
    return Promise.resolve();
  }
  close() {
    return Promise.resolve();
  }
}

const fakeContext = {
  setTransform: vi.fn(),
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  roundRect: vi.fn(),
  rect: vi.fn(),
  fill: vi.fn(),
  fillStyle: "",
};

describe("recording", () => {
  let getUserMedia: ReturnType<typeof vi.fn>;
  let now = 0;

  beforeEach(() => {
    getUserMedia = vi.fn(() => Promise.resolve({ getTracks: () => [{ stop: () => {} }] }));
    FakeAudioContext.created = 0;
    fakeContext.roundRect.mockClear();
    vi.stubGlobal("AudioContext", FakeAudioContext);
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
      () => fakeContext as unknown as CanvasRenderingContext2D,
    );
    // Gives the canvas a box: the painter draws nothing into a 0 × 0 canvas.
    vi.spyOn(HTMLCanvasElement.prototype, "clientWidth", "get").mockReturnValue(200);
    vi.spyOn(HTMLCanvasElement.prototype, "clientHeight", "get").mockReturnValue(28);
    vi.stubGlobal("MediaRecorder", FakeRecorder);
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia },
    });
    now = 0;
    vi.spyOn(performance, "now").mockImplementation(() => now);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: undefined });
  });

  const form = () => screen.getByRole("form");
  const recordButton = () => screen.getByRole("button", { name: "Записать голосовое" });
  const sendRecording = () => screen.getByRole("button", { name: "Отправить запись" });
  /** Lets the permission answer (a resolved promise) reach the recorder. */
  const granted = () => act(async () => {});
  const touch = (pointerId = 1) => ({ pointerId, pointerType: "touch", button: 0 });

  it("hides the record button where the browser cannot record", () => {
    vi.stubGlobal("MediaRecorder", undefined);
    render(<Composer.Root onSendVoice={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "Записать голосовое" })).toBeNull();
    expect(screen.getByRole("button", { name: "Отправить" })).toBeDisabled();
  });

  it("an empty field offers the record button, text turns it into send", () => {
    render(<Composer.Root onSendVoice={vi.fn()} />);
    expect(recordButton()).toHaveAccessibleDescription(/Удерживайте/);
    fireEvent.change(field(), { target: { value: "Текст" } });
    expect(screen.getByRole("button", { name: "Отправить" })).toBeEnabled();
  });

  it("switches to the recording row on the press, before the permission answers", () => {
    getUserMedia.mockImplementation(() => new Promise(() => {}));
    render(<Composer.Root onSendVoice={vi.fn()} />);
    fireEvent.pointerDown(recordButton(), { pointerId: 1, pointerType: "mouse", button: 0 });
    expect(getUserMedia).toHaveBeenCalledWith({ audio: true });
    expect(form()).toHaveAttribute("data-recording", "locked");
    expect(sendRecording()).toBeEnabled();
    expect(screen.getByRole("button", { name: "Удалить запись" })).toBeInTheDocument();
    expect(form().querySelector("canvas")).not.toBeNull();
    expect(screen.getByRole("status")).toHaveTextContent("Идёт запись");
  });

  it("a click records hands-free; send hands over the voice message", async () => {
    const onSendVoice = vi.fn();
    render(<Composer.Root onSendVoice={onSendVoice} />);
    fireEvent.click(recordButton(), { detail: 0 });
    expect(form()).toHaveAttribute("data-recording", "locked");
    await granted();
    now = 2400;
    fireEvent.click(sendRecording());
    expect(onSendVoice).toHaveBeenCalledTimes(1);
    const recording = onSendVoice.mock.calls[0][0];
    expect(recording.blob).toBeInstanceOf(Blob);
    expect(recording.durationMs).toBe(2400);
    expect(recording.waveform).toHaveLength(48);
    expect(form()).not.toHaveAttribute("data-recording");
    expect(screen.getByRole("status")).toHaveTextContent("Запись отправлена");
  });

  it("Escape and the delete button throw the recording away", async () => {
    const onSendVoice = vi.fn();
    const onActivityChange = vi.fn();
    render(<Composer.Root onSendVoice={onSendVoice} onActivityChange={onActivityChange} />);
    fireEvent.click(recordButton(), { detail: 0 });
    await granted();
    expect(onActivityChange).toHaveBeenLastCalledWith("voice");
    now = 3000;
    fireEvent.keyDown(sendRecording(), { key: "Escape" });
    expect(form()).not.toHaveAttribute("data-recording");
    expect(onActivityChange.mock.calls).toEqual([["voice"], [null]]);
    expect(screen.getByRole("status")).toHaveTextContent("Запись удалена");
    fireEvent.click(recordButton(), { detail: 0 });
    await granted();
    now = 6000;
    const remove = screen.getByRole("button", { name: "Удалить запись" });
    remove.focus();
    fireEvent.click(remove);
    expect(onSendVoice).not.toHaveBeenCalled();
    // Focus leaves the closing row for the action button.
    expect(recordButton()).toHaveFocus();
  });

  it("Enter and Space start at once from the keyboard; the button then sends", async () => {
    const onSendVoice = vi.fn();
    render(<Composer.Root onSendVoice={onSendVoice} />);
    fireEvent.keyDown(recordButton(), { key: "Enter" });
    expect(form()).toHaveAttribute("data-recording", "locked");
    await granted();
    fireEvent.keyDown(sendRecording(), { key: "Escape" });
    fireEvent.keyDown(recordButton(), { key: " " });
    expect(form()).toHaveAttribute("data-recording", "locked");
    await granted();
    now = 1500;
    // The released Space does not send the recording it started.
    const up = fireEvent.keyUp(sendRecording(), { key: " " });
    expect(up).toBe(false);
    expect(onSendVoice).not.toHaveBeenCalled();
    fireEvent.keyDown(sendRecording(), { key: "Enter" });
    expect(onSendVoice).toHaveBeenCalledTimes(1);
  });

  describe("keys during a hands-free recording", () => {
    const start = async (onSendVoice = vi.fn()) => {
      render(<Composer.Root onSendVoice={onSendVoice} />);
      fireEvent.keyDown(recordButton(), { key: "Enter" });
      await granted();
      return onSendVoice;
    };

    it("Enter sends from anywhere in the composer, even off the record button", async () => {
      const onSendVoice = await start();
      now = 2000;
      fireEvent.keyDown(form(), { key: "Enter" });
      expect(onSendVoice).toHaveBeenCalledTimes(1);
      expect(form()).not.toHaveAttribute("data-recording");
    });

    it("Escape throws the recording away and never reaches an enclosing Modal", async () => {
      const onSendVoice = vi.fn();
      const onOpenChange = vi.fn();
      render(
        <Modal.Root open onOpenChange={onOpenChange}>
          <Modal.Content aria-label="Чат">
            <Composer.Root onSendVoice={onSendVoice} />
          </Modal.Content>
        </Modal.Root>,
      );
      fireEvent.click(recordButton(), { detail: 0 });
      await granted();
      now = 2000;
      fireEvent.keyDown(sendRecording(), { key: "Escape" });
      expect(form()).not.toHaveAttribute("data-recording");
      expect(onSendVoice).not.toHaveBeenCalled();
      expect(onOpenChange).not.toHaveBeenCalled();
      // Without a recording Escape closes the Modal as usual.
      fireEvent.keyDown(recordButton(), { key: "Escape" });
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("Space and the pause button pause and resume; the timer stands while paused", async () => {
      vi.useFakeTimers({
        toFake: ["setInterval", "clearInterval", "requestAnimationFrame", "cancelAnimationFrame"],
      });
      const onSendVoice = await start();
      const timer = () => form().querySelector(`.${styles.timer}`);
      const frame = (to: number) => {
        now = to;
        act(() => {
          vi.advanceTimersByTime(100);
        });
      };
      frame(2000);
      expect(timer()).toHaveTextContent("0:02,0");
      fireEvent.keyDown(sendRecording(), { key: " " });
      expect(screen.getByRole("status")).toHaveTextContent("Запись приостановлена");
      expect(form().querySelector("[data-paused]")).not.toBeNull();
      frame(5000);
      expect(timer()).toHaveTextContent("0:02,0");
      fireEvent.click(screen.getByRole("button", { name: "Продолжить запись" }));
      expect(screen.getByRole("status")).toHaveTextContent("Запись продолжена");
      frame(6000);
      expect(timer()).toHaveTextContent("0:03,0");
      // Sent while paused: what was recorded goes, without the pause.
      fireEvent.keyDown(form(), { key: " " });
      fireEvent.keyDown(form(), { key: "Enter" });
      expect(onSendVoice).toHaveBeenCalledTimes(1);
      expect(onSendVoice.mock.calls[0][0].durationMs).toBe(3000);
      vi.useRealTimers();
    });

    it("a held recording ignores the keys", async () => {
      const onSendVoice = vi.fn();
      render(<Composer.Root onSendVoice={onSendVoice} />);
      fireEvent.pointerDown(recordButton(), touch());
      await granted();
      expect(form()).toHaveAttribute("data-recording", "hold");
      now = 2000;
      fireEvent.keyDown(form(), { key: "Enter" });
      fireEvent.keyDown(form(), { key: " " });
      expect(onSendVoice).not.toHaveBeenCalled();
      expect(form()).toHaveAttribute("data-recording", "hold");
    });
  });

  it("a refused microphone rolls back to the field and shows an error", async () => {
    let refuse: (reason: unknown) => void = () => {};
    getUserMedia.mockImplementation(() => new Promise((_, reject) => (refuse = reject)));
    render(<Composer.Root onSendVoice={vi.fn()} />);
    fireEvent.click(recordButton(), { detail: 0 });
    expect(form()).toHaveAttribute("data-recording", "locked");
    await act(async () => refuse(new DOMException("denied", "NotAllowedError")));
    expect(screen.getByRole("alert")).toHaveTextContent(/Нет доступа к микрофону/);
    expect(form()).not.toHaveAttribute("data-recording");
    expect(recordButton()).toBeEnabled();
    expect(field()).toHaveAccessibleDescription(/Нет доступа/);
  });

  it("reuses one AudioContext across recordings", async () => {
    render(<Composer.Root onSendVoice={vi.fn()} />);
    fireEvent.click(recordButton(), { detail: 0 });
    await granted();
    fireEvent.keyDown(sendRecording(), { key: "Escape" });
    fireEvent.click(recordButton(), { detail: 0 });
    await granted();
    expect(FakeAudioContext.created).toBe(1);
  });

  describe("held on a touch screen", () => {
    it("records while held and sends on release", async () => {
      const onSendVoice = vi.fn();
      render(<Composer.Root onSendVoice={onSendVoice} />);
      fireEvent.pointerDown(recordButton(), { ...touch(), clientX: 300, clientY: 500 });
      expect(form()).toHaveAttribute("data-recording", "hold");
      expect(screen.getByText("Влево — отмена")).toBeInTheDocument();
      await granted();
      now = 1500;
      const button = sendRecording();
      fireEvent.pointerUp(button, touch());
      fireEvent.click(button);
      expect(onSendVoice).toHaveBeenCalledTimes(1);
      expect(form()).not.toHaveAttribute("data-recording");
    });

    it("a short tap keeps recording hands-free", async () => {
      render(<Composer.Root onSendVoice={vi.fn()} />);
      fireEvent.pointerDown(recordButton(), touch());
      now = 100;
      fireEvent.pointerUp(sendRecording(), touch());
      fireEvent.click(sendRecording());
      expect(form()).toHaveAttribute("data-recording", "locked");
    });

    it("sliding left cancels", async () => {
      const onSendVoice = vi.fn();
      render(<Composer.Root onSendVoice={onSendVoice} />);
      fireEvent.pointerDown(recordButton(), { ...touch(), clientX: 300, clientY: 500 });
      await granted();
      now = 2000;
      fireEvent.pointerMove(sendRecording(), { ...touch(), clientX: 260, clientY: 500 });
      expect(form()).toHaveAttribute("data-recording", "hold");
      fireEvent.pointerMove(sendRecording(), { ...touch(), clientX: 180, clientY: 500 });
      expect(form()).not.toHaveAttribute("data-recording");
      fireEvent.pointerUp(recordButton(), touch());
      expect(onSendVoice).not.toHaveBeenCalled();
    });

    it("sliding up past the threshold locks: release keeps recording, send hands it over", async () => {
      const onSendVoice = vi.fn();
      render(<Composer.Root onSendVoice={onSendVoice} />);
      fireEvent.pointerDown(recordButton(), { ...touch(), clientX: 300, clientY: 500 });
      await granted();
      fireEvent.pointerMove(sendRecording(), { ...touch(), clientX: 300, clientY: 420 });
      expect(form()).toHaveAttribute("data-recording", "locked");
      expect(screen.getByRole("status")).toHaveTextContent("без удержания");
      now = 2500;
      // The finger lifts off the button: the release and its click do not send.
      fireEvent.pointerUp(sendRecording(), touch());
      fireEvent.click(sendRecording());
      expect(form()).toHaveAttribute("data-recording", "locked");
      expect(onSendVoice).not.toHaveBeenCalled();
      // After the lock a slide or a cancelled pointer does nothing.
      fireEvent.pointerMove(sendRecording(), { ...touch(), clientX: 100, clientY: 420 });
      fireEvent.pointerCancel(sendRecording(), touch());
      expect(form()).toHaveAttribute("data-recording", "locked");
      await act(async () => new Promise((resolve) => window.setTimeout(resolve, 0)));
      now = 3000;
      fireEvent.click(sendRecording());
      expect(onSendVoice).toHaveBeenCalledTimes(1);
      expect(onSendVoice.mock.calls[0][0].durationMs).toBe(3000);
    });

    it("sliding up short of the threshold still sends on release", async () => {
      const onSendVoice = vi.fn();
      render(<Composer.Root onSendVoice={onSendVoice} />);
      fireEvent.pointerDown(recordButton(), { ...touch(), clientX: 300, clientY: 500 });
      await granted();
      fireEvent.pointerMove(sendRecording(), { ...touch(), clientX: 300, clientY: 480 });
      expect(form()).toHaveAttribute("data-recording", "hold");
      now = 1800;
      fireEvent.pointerUp(sendRecording(), touch());
      expect(onSendVoice).toHaveBeenCalledTimes(1);
    });

    it("a cancelled pointer before the lock throws the recording away", async () => {
      const onSendVoice = vi.fn();
      render(<Composer.Root onSendVoice={onSendVoice} />);
      fireEvent.pointerDown(recordButton(), touch());
      await granted();
      now = 2000;
      fireEvent.pointerCancel(sendRecording(), touch());
      expect(form()).not.toHaveAttribute("data-recording");
      expect(onSendVoice).not.toHaveBeenCalled();
    });

    it("the button keeps its shape while held", async () => {
      render(<Composer.Root onSendVoice={vi.fn()} />);
      const button = recordButton();
      const className = button.className;
      const iconOnly = button.getAttribute("data-icon-only");
      fireEvent.pointerDown(button, touch());
      await granted();
      expect(button.className).toBe(className);
      expect(button.getAttribute("data-icon-only")).toBe(iconOnly);
      expect(form().querySelector(`.${styles.wave}`)).toBeNull();
    });
  });

  it("the timer and the waveform run on frames, with no render per frame", async () => {
    vi.useFakeTimers({
      toFake: ["setInterval", "clearInterval", "requestAnimationFrame", "cancelAnimationFrame"],
    });
    let renders = 0;
    render(
      <React.Profiler id="composer" onRender={() => (renders += 1)}>
        <Composer.Root onSendVoice={vi.fn()} />
      </React.Profiler>,
    );
    fireEvent.click(recordButton(), { detail: 0 });
    await granted();
    const settled = renders;
    for (let step = 1; step <= 60; step += 1) {
      now = step * 50;
      act(() => {
        vi.advanceTimersByTime(50);
      });
    }
    expect(renders).toBe(settled);
    const timer = form().querySelector(`.${styles.timer}`);
    expect(timer).toHaveTextContent("0:03,0");
    expect(fakeContext.roundRect).toHaveBeenCalled();
    vi.useRealTimers();
  });

  describe("with video messages", () => {
    beforeEach(() => {
      if (!("srcObject" in HTMLVideoElement.prototype)) {
        Object.defineProperty(HTMLVideoElement.prototype, "srcObject", {
          configurable: true,
          writable: true,
          value: null,
        });
      }
    });

    const mouse = { pointerId: 1, pointerType: "mouse", button: 0 };
    /** Waits out the double-click window. */
    const windowPasses = () => act(async () => new Promise((resolve) => setTimeout(resolve, 350)));
    /** Every value `data-recording` takes on the form, however briefly. */
    const watchRecording = () => {
      const seen: (string | null)[] = [];
      const observer = new MutationObserver(() => seen.push(form().getAttribute("data-recording")));
      observer.observe(form(), { attributes: true, attributeFilter: ["data-recording"] });
      return { seen, stop: () => observer.disconnect() };
    };
    const press = (target: HTMLElement, init: object) => {
      fireEvent.pointerDown(target, init);
      fireEvent.pointerUp(target, init);
      fireEvent.click(target);
    };

    it("a click records hands-free once the double-click window passes", async () => {
      const onRecordModeChange = vi.fn();
      render(
        <Composer.Root
          onSendVoice={vi.fn()}
          onSendVideoNote={vi.fn()}
          onRecordModeChange={onRecordModeChange}
        />,
      );
      expect(recordButton()).toHaveAccessibleDescription(/Двойное нажатие/i);
      expect(recordButton()).toHaveAttribute("aria-keyshortcuts", "ArrowUp ArrowDown");
      press(recordButton(), mouse);
      expect(form()).not.toHaveAttribute("data-recording");
      await waitFor(() => expect(form()).toHaveAttribute("data-recording", "locked"));
      expect(getUserMedia).toHaveBeenCalledWith({ audio: true });
      expect(screen.getByRole("status")).toHaveTextContent("Идёт запись");
      expect(onRecordModeChange).not.toHaveBeenCalled();
    });

    it("a double click switches voice and video: no recording shows, nothing is sent", async () => {
      const onSendVoice = vi.fn();
      const onRecordModeChange = vi.fn();
      render(
        <Composer.Root
          onSendVoice={onSendVoice}
          onSendVideoNote={vi.fn()}
          onRecordModeChange={onRecordModeChange}
        />,
      );
      // One recording first: the microphone is granted, so the next press records at once.
      press(recordButton(), mouse);
      await waitFor(() => expect(form()).toHaveAttribute("data-recording", "locked"));
      await granted();
      fireEvent.keyDown(sendRecording(), { key: "Escape" });
      getUserMedia.mockClear();
      const watch = watchRecording();
      const button = recordButton();
      press(button, mouse);
      // The first click is already recording, out of sight.
      expect(getUserMedia).toHaveBeenCalledWith({ audio: true });
      await granted();
      now = 250;
      press(button, mouse);
      await windowPasses();
      watch.stop();
      expect(watch.seen.filter(Boolean)).toEqual([]);
      expect(onSendVoice).not.toHaveBeenCalled();
      expect(onRecordModeChange).toHaveBeenCalledWith("video");
      expect(screen.getByRole("button", { name: "Записать видеосообщение" })).toBe(button);
      expect(screen.getByRole("status")).toHaveTextContent("Видеосообщение");
    });

    it("a double click reported as one press with a click count of 2 still switches", async () => {
      const onRecordModeChange = vi.fn();
      render(
        <Composer.Root
          onSendVoice={vi.fn()}
          onSendVideoNote={vi.fn()}
          onRecordModeChange={onRecordModeChange}
        />,
      );
      const button = recordButton();
      fireEvent.pointerDown(button, mouse);
      fireEvent.pointerUp(button, mouse);
      fireEvent.click(button, { detail: 2 });
      await windowPasses();
      expect(form()).not.toHaveAttribute("data-recording");
      expect(onRecordModeChange).toHaveBeenCalledWith("video");
    });

    it("a double tap switches voice and video without asking for the device", async () => {
      const onRecordModeChange = vi.fn();
      render(
        <Composer.Root
          onSendVoice={vi.fn()}
          onSendVideoNote={vi.fn()}
          onRecordModeChange={onRecordModeChange}
        />,
      );
      const watch = watchRecording();
      const button = recordButton();
      press(button, touch());
      now = 200;
      press(button, touch(2));
      await windowPasses();
      watch.stop();
      expect(watch.seen.filter(Boolean)).toEqual([]);
      expect(getUserMedia).not.toHaveBeenCalled();
      expect(onRecordModeChange).toHaveBeenCalledTimes(1);
      expect(onRecordModeChange).toHaveBeenCalledWith("video");
    });

    it("a single tap records hands-free", async () => {
      render(<Composer.Root onSendVoice={vi.fn()} onSendVideoNote={vi.fn()} />);
      press(recordButton(), touch());
      await waitFor(() => expect(form()).toHaveAttribute("data-recording", "locked"));
    });

    it("↑ and ↓ switch from the keyboard; Enter records at once", () => {
      const onRecordModeChange = vi.fn();
      render(
        <Composer.Root
          onSendVoice={vi.fn()}
          onSendVideoNote={vi.fn()}
          onRecordModeChange={onRecordModeChange}
        />,
      );
      fireEvent.keyDown(recordButton(), { key: "ArrowDown" });
      expect(onRecordModeChange).toHaveBeenLastCalledWith("video");
      expect(screen.getByRole("status")).toHaveTextContent("Видеосообщение");
      const video = screen.getByRole("button", { name: "Записать видеосообщение" });
      fireEvent.keyDown(video, { key: "ArrowUp" });
      expect(onRecordModeChange).toHaveBeenLastCalledWith("voice");
      expect(screen.getByRole("status")).toHaveTextContent("Голосовое сообщение");
      fireEvent.keyDown(recordButton(), { key: "Enter" });
      expect(form()).toHaveAttribute("data-recording", "locked");
      expect(getUserMedia).toHaveBeenCalledWith({ audio: true });
    });

    it("a hold records in the current mode, the timer counting from the press", async () => {
      const onSendVoice = vi.fn();
      render(<Composer.Root onSendVoice={onSendVoice} onSendVideoNote={vi.fn()} />);
      const button = recordButton();
      fireEvent.pointerDown(button, { ...touch(), clientX: 300, clientY: 500 });
      expect(form()).not.toHaveAttribute("data-recording");
      await waitFor(() => expect(form()).toHaveAttribute("data-recording", "hold"));
      expect(getUserMedia).toHaveBeenCalledWith({ audio: true });
      await granted();
      now = 1600;
      fireEvent.pointerUp(button, touch());
      expect(onSendVoice).toHaveBeenCalledTimes(1);
    });

    it("Space records a round video with a preview above the composer", async () => {
      const onSendVideoNote = vi.fn();
      render(
        <Composer.Root
          onSendVoice={vi.fn()}
          onSendVideoNote={onSendVideoNote}
          defaultRecordMode="video"
        />,
      );
      fireEvent.keyDown(screen.getByRole("button", { name: "Записать видеосообщение" }), {
        key: " ",
      });
      expect(form()).toHaveAttribute("data-recording", "locked");
      expect(form().querySelector(`.${styles.preview}`)).not.toBeNull();
      expect(getUserMedia).toHaveBeenCalledWith({
        audio: true,
        video: { facingMode: "user", aspectRatio: 1 },
      });
      await granted();
      expect(form().querySelector("video")).not.toBeNull();
      now = 4000;
      fireEvent.click(sendRecording(), { detail: 0 });
      expect(onSendVideoNote).toHaveBeenCalledTimes(1);
      expect(form().querySelector(`.${styles.preview}`)).toBeNull();
    });
  });
});

describe("Composer.Keyboard", () => {
  const ROWS = [
    ["Мои заказы", "Статус доставки"],
    [{ label: "Оформить заказ", tone: "accent" as const }],
  ];

  it("is a named group of keys under the row; a key sends its text and keeps the draft", async () => {
    const onSend = vi.fn();
    render(
      <Composer.Root defaultValue="черновик" onSend={onSend}>
        <Composer.Keyboard rows={ROWS} placeholder="Выберите раздел" />
      </Composer.Root>,
    );
    const keyboard = await screen.findByRole("group", { name: "Клавиатура бота" });
    const field = screen.getByRole("textbox", { name: "Сообщение" });
    // Under the row, after the field.
    expect(field.compareDocumentPosition(keyboard) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(field).toHaveAttribute("placeholder", "Выберите раздел");
    expect(screen.getByRole("button", { name: "Оформить заказ" })).toHaveAttribute(
      "data-tone",
      "accent",
    );
    const key = screen.getByRole("button", { name: "Статус доставки" });
    key.focus();
    await userEvent.keyboard("{Enter}");
    expect(onSend).toHaveBeenLastCalledWith({ text: "Статус доставки", albums: [], files: [] });
    await userEvent.keyboard(" ");
    expect(onSend).toHaveBeenCalledTimes(2);
    expect(field).toHaveValue("черновик");
  });

  it("the toggle shows and hides the keys; the placeholder follows", async () => {
    render(
      <Composer.Root>
        <Composer.Keyboard rows={ROWS} placeholder="Выберите раздел" />
      </Composer.Root>,
    );
    const toggle = await screen.findByRole("button", { name: "Клавиатура бота" });
    const keyboard = screen.getByRole("group", { name: "Клавиатура бота" });
    const field = screen.getByRole("textbox", { name: "Сообщение" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAttribute("aria-controls", keyboard.id);
    toggle.focus();
    await userEvent.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(keyboard).toHaveAttribute("data-state", "closed");
    expect(field).toHaveAttribute("placeholder", "Сообщение");
    await userEvent.keyboard(" ");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(keyboard).toHaveAttribute("data-state", "open");
  });

  it("a pending key loads; oneTime hides the keyboard once it resolves and focuses the field", async () => {
    let settle: () => void = () => {};
    const onSend = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          settle = resolve;
        }),
    );
    const onOpenChange = vi.fn();
    render(
      <Composer.Root onSend={onSend}>
        <Composer.Keyboard rows={ROWS} oneTime onOpenChange={onOpenChange} />
      </Composer.Root>,
    );
    const key = await screen.findByRole("button", { name: "Мои заказы" });
    await userEvent.click(key);
    expect(key).toHaveAttribute("aria-busy", "true");
    expect(onOpenChange).not.toHaveBeenCalled();
    await act(async () => settle());
    expect(key).not.toHaveAttribute("aria-busy");
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole("textbox", { name: "Сообщение" })).toHaveFocus();
  });

  it("is disabled with the composer", async () => {
    render(
      <Composer.Root disabled>
        <Composer.Keyboard rows={ROWS} />
      </Composer.Root>,
    );
    expect(await screen.findByRole("button", { name: "Мои заказы" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Клавиатура бота" })).toBeDisabled();
  });
});
