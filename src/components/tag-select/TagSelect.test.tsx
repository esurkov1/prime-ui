import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TagSelect } from "./TagSelect";

const sampleOptions = [
  { value: "a", label: "Alpha", color: "blue" as const },
  { value: "b", label: "Beta", color: "green" as const },
];

function BasicTagSelect(props: Partial<React.ComponentProps<typeof TagSelect>>) {
  return (
    <TagSelect
      options={sampleOptions}
      defaultValue={[]}
      placeholder="Теги"
      aria-label="Тестовый tag select"
      {...props}
    />
  );
}

describe("TagSelect", () => {
  it("рендерит combobox", () => {
    render(<BasicTagSelect />);
    expect(screen.getByRole("combobox", { name: "Тестовый tag select" })).toBeInTheDocument();
  });

  it("keeps autofill and the password managers off its input", () => {
    render(<BasicTagSelect />);
    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("autocomplete", "off");
    expect(input).toHaveAttribute("data-1p-ignore");
    expect(input).toHaveAttribute("data-bwignore");
  });

  it("открывает listbox при фокусе", () => {
    render(<BasicTagSelect />);
    fireEvent.focus(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("добавляет тег по клику на опцию", () => {
    render(<BasicTagSelect />);
    fireEvent.focus(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Alpha" }));
    expect(screen.getByRole("button", { name: /Удалить Alpha/i })).toBeInTheDocument();
  });

  it("Space types into the input: a created tag may have several words", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<BasicTagSelect creatable onCreate={onCreate} />);
    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("Новый");
    await user.keyboard(" ");
    await user.keyboard("тег");
    expect(input).toHaveValue("Новый тег");
    await user.keyboard("{Enter}");
    expect(onCreate).toHaveBeenCalledWith("Новый тег");
  });

  it("снимает последний тег по Backspace при пустом вводе", () => {
    render(<BasicTagSelect defaultValue={["a"]} />);
    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(screen.queryByRole("button", { name: /Удалить Alpha/i })).not.toBeInTheDocument();
  });

  it("в режиме creatable показывает строку создания для нового текста", () => {
    render(<BasicTagSelect creatable />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "новый" } });
    expect(screen.getByRole("option", { name: /новый/i })).toBeInTheDocument();
  });

  it("после creatable снятие чипа оставляет значение в списке опций", () => {
    render(<BasicTagSelect creatable />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "новый" } });
    fireEvent.click(screen.getByRole("option", { name: /новый/i }));
    expect(screen.getByRole("button", { name: /Удалить новый/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Удалить новый/i }));
    expect(screen.queryByRole("button", { name: /Удалить новый/i })).not.toBeInTheDocument();
    fireEvent.focus(input);
    expect(screen.getByRole("option", { name: "новый" })).toBeInTheDocument();
  });

  // Selected options used to be hidden from the list; now they come first with a check: with many
  // tags some are folded into «+N», and they can be unticked right in the list.
  it("все теги выбраны: список открывается, выбранные отмечены; снятие галочки убирает тег", () => {
    render(<BasicTagSelect defaultValue={["a", "b"]} />);
    fireEvent.focus(screen.getByRole("combobox"));
    const alpha = screen.getByRole("option", { name: "Alpha" });
    expect(alpha).toHaveAttribute("aria-selected", "true");
    fireEvent.click(alpha);
    expect(screen.queryByRole("button", { name: /Удалить Alpha/i })).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Alpha" })).toHaveAttribute("aria-selected", "false");
  });

  it("пустой список без опций и без creatable не открывается", () => {
    render(<BasicTagSelect options={[]} />);
    fireEvent.focus(screen.getByRole("combobox"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("вызывает onValueChange при выборе", () => {
    const onValueChange = vi.fn();
    render(<BasicTagSelect onValueChange={onValueChange} />);
    fireEvent.focus(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Beta" }));
    expect(onValueChange).toHaveBeenCalledWith(["b"]);
  });

  it("вызывает onCreate только при создании через creatable", () => {
    const onCreated = vi.fn();
    render(<BasicTagSelect creatable onCreate={onCreated} />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "newtag" } });
    fireEvent.click(screen.getByRole("option", { name: /newtag/i }));
    expect(onCreated).toHaveBeenCalledWith("newtag");
  });

  it("async onCreate: the new chip waits busy and cannot be removed; resolve keeps it", async () => {
    let resolve: () => void = () => {};
    const onValueChange = vi.fn();
    render(
      <BasicTagSelect
        creatable
        onValueChange={onValueChange}
        onCreate={() =>
          new Promise<void>((done) => {
            resolve = done;
          })
        }
      />,
    );
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "Опт" } });
    fireEvent.click(screen.getByRole("option", { name: /Опт/ }));
    const chip = document.querySelector('[data-chip-value="Опт"]') as HTMLElement;
    expect(chip).toHaveAttribute("aria-busy", "true");
    expect(onValueChange).toHaveBeenLastCalledWith(["Опт"]);
    fireEvent.click(screen.getByRole("button", { name: "Удалить Опт" }));
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(document.querySelector('[data-chip-value="Опт"]')).not.toBeNull();

    await act(async () => {
      resolve();
    });
    expect(document.querySelector('[data-chip-value="Опт"]')).not.toHaveAttribute("aria-busy");
  });

  it("async onCreate: reject takes the new tag out again and announces it", async () => {
    const onValueChange = vi.fn();
    render(
      <BasicTagSelect
        creatable
        onValueChange={onValueChange}
        onCreate={async () => {
          throw new Error("exists");
        }}
      />,
    );
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "Опт" } });
    await act(async () => {
      fireEvent.click(screen.getByRole("option", { name: /Опт/ }));
    });
    expect(document.querySelector('[data-chip-value="Опт"]')).toBeNull();
    expect(onValueChange).toHaveBeenLastCalledWith([]);
    expect(screen.getByText("Не удалось создать тег «Опт»")).toBeInTheDocument();
  });

  it("снимает тег по крестику при фокусе в поле ввода", () => {
    render(<BasicTagSelect defaultValue={["a"]} />);
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.click(screen.getByRole("button", { name: /Удалить Alpha/i }));
    expect(screen.queryByRole("button", { name: /Удалить Alpha/i })).not.toBeInTheDocument();
  });

  it("с onOptionUpdate / onOptionDelete показывает кнопку меню у опции", () => {
    render(<BasicTagSelect onOptionUpdate={vi.fn()} onOptionDelete={vi.fn()} />);
    fireEvent.focus(screen.getByRole("combobox"));
    expect(screen.getByRole("button", { name: /Изменить тег Alpha/i })).toBeInTheDocument();
  });

  it("выбранные — первыми в списке, с отмеченным чекбоксом", () => {
    render(<BasicTagSelect defaultValue={["b"]} />);
    fireEvent.focus(screen.getByRole("combobox"));
    const options = screen.getAllByRole("option");
    expect(options.map((o) => o.dataset.value)).toEqual(["b", "a"]);
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(options[1]).toHaveAttribute("aria-selected", "false");
    expect(options[0]?.querySelector('[data-state="checked"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(options[1]?.querySelector('[data-state="unchecked"]')).not.toBeNull();
  });

  it("меню ⋯ открывается над списком и переименовывает тег", async () => {
    const user = userEvent.setup();
    const onOptionUpdate = vi.fn();
    render(<BasicTagSelect onOptionUpdate={onOptionUpdate} />);
    fireEvent.focus(screen.getByRole("combobox"));
    await user.click(screen.getByRole("button", { name: /Изменить тег Alpha/i }));
    // One overlay z-index: the menu opened later is portaled after the list, so it is on top.
    const position = screen
      .getAllByRole("listbox")[0]
      ?.compareDocumentPosition(screen.getByRole("dialog")) as number;
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const name = screen.getByRole("textbox", { name: "Название тега" });
    await user.clear(name);
    await user.type(name, "Альфа{Enter}");
    expect(onOptionUpdate).toHaveBeenCalledWith("a", { label: "Альфа" });
  });

  it("async onOptionUpdate: the new color shows at once, «⋯» spins; reject puts it back", async () => {
    let reject: (reason: unknown) => void = () => {};
    render(
      <BasicTagSelect
        defaultValue={["a"]}
        onOptionUpdate={() =>
          new Promise<void>((_, fail) => {
            reject = fail;
          })
        }
      />,
    );
    fireEvent.focus(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("button", { name: /Изменить тег Alpha/i }));
    fireEvent.click(screen.getByRole("radio", { name: "Красный" }));
    const chip = document.querySelector('[data-chip-value="a"]') as HTMLElement;
    expect(chip).toHaveAttribute("data-color", "red");
    expect(screen.getByRole("button", { name: /Изменить тег Alpha/i })).toHaveAttribute(
      "aria-busy",
      "true",
    );

    await act(async () => {
      reject(new Error("offline"));
    });
    expect(document.querySelector('[data-chip-value="a"]')).toHaveAttribute("data-color", "blue");
    expect(screen.getByText("Не удалось изменить тег «Alpha»")).toBeInTheDocument();
  });

  it("с onOptionUpdate / onOptionDelete меню ⋯ есть и у выбранных тегов", () => {
    render(
      <BasicTagSelect
        defaultValue={["a", "b"]}
        onOptionUpdate={vi.fn()}
        onOptionDelete={vi.fn()}
      />,
    );
    fireEvent.focus(screen.getByRole("combobox"));
    expect(screen.getByRole("button", { name: /Изменить тег Alpha/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Изменить тег Beta/i })).toBeInTheDocument();
  });

  it("вызывает onDelete из меню (опция видна, пока не выбрана в поле)", () => {
    const onDelete = vi.fn();
    render(
      <BasicTagSelect defaultValue={["b"]} onOptionUpdate={vi.fn()} onOptionDelete={onDelete} />,
    );
    fireEvent.focus(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("button", { name: /Изменить тег Alpha/i }));
    fireEvent.click(screen.getByRole("button", { name: /^Удалить$/i }));
    expect(onDelete).toHaveBeenCalledWith("a");
  });

  it("только onOptionDelete: в меню нет поля имени и палитры", () => {
    render(<BasicTagSelect onOptionDelete={vi.fn()} />);
    fireEvent.focus(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("button", { name: /Изменить тег Alpha/i }));
    expect(screen.getByRole("button", { name: /^Удалить$/i })).toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: "Название тега" })).not.toBeInTheDocument();
    expect(screen.queryByRole("radio", { name: "Синий" })).not.toBeInTheDocument();
  });

  it("the row menu: name field, then the color swatches, then the danger «Удалить» last", async () => {
    const user = userEvent.setup();
    const onOptionUpdate = vi.fn();
    const onOptionDelete = vi.fn();
    render(<BasicTagSelect onOptionUpdate={onOptionUpdate} onOptionDelete={onOptionDelete} />);
    fireEvent.focus(screen.getByRole("combobox"));
    await user.click(screen.getByRole("button", { name: /Изменить тег Alpha/i }));
    const dialog = screen.getByRole("dialog");
    const name = screen.getByRole("textbox", { name: "Название тега" });
    const grid = screen.getByRole("radiogroup", { name: "Цвета" });
    const remove = screen.getByRole("button", { name: /^Удалить$/ });
    const follows = (a: Element, b: Element) =>
      Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    expect(dialog).toContainElement(grid);
    expect(follows(name, grid)).toBe(true);
    expect(follows(grid, remove)).toBe(true);
    expect(remove).toHaveAttribute("data-tone", "danger");
    const swatches = within(grid).getAllByRole("radio");
    expect(swatches).toHaveLength(10);
    // The chosen color is marked; one tab stop.
    expect(screen.getByRole("radio", { name: "Синий" })).toBeChecked();
    expect(swatches.filter((swatch) => swatch.tabIndex === 0)).toHaveLength(1);
  });

  it("the color grid: arrows move focus without picking, Home and End jump, Enter picks", async () => {
    const user = userEvent.setup();
    const onOptionUpdate = vi.fn();
    render(<BasicTagSelect onOptionUpdate={onOptionUpdate} />);
    fireEvent.focus(screen.getByRole("combobox"));
    await user.click(screen.getByRole("button", { name: /Изменить тег Alpha/i }));
    screen.getByRole("radio", { name: "Синий" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Фиолетовый" })).toHaveFocus();
    expect(onOptionUpdate).toHaveBeenLastCalledWith("a", { color: "purple" });
    await user.keyboard("{Home}");
    expect(screen.getByRole("radio", { name: "По умолчанию" })).toHaveFocus();
    expect(onOptionUpdate).toHaveBeenLastCalledWith("a", { color: "gray" });
    await user.keyboard("{End}");
    expect(screen.getByRole("radio", { name: "Бирюзовый" })).toHaveFocus();
    expect(onOptionUpdate).toHaveBeenLastCalledWith("a", { color: "teal" });
  });

  it("Escape closes the row menu from the color grid", async () => {
    const user = userEvent.setup();
    render(<BasicTagSelect onOptionUpdate={vi.fn()} />);
    fireEvent.focus(screen.getByRole("combobox"));
    await user.click(screen.getByRole("button", { name: /Изменить тег Alpha/i }));
    screen.getByRole("radio", { name: "Синий" }).focus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  describe("onOptionDelete returning a Promise", () => {
    function deferred() {
      let resolve!: () => void;
      let reject!: (reason?: unknown) => void;
      const promise = new Promise<void>((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    }

    function startDelete(onOptionDelete: (value: string) => Promise<void>) {
      const onValueChange = vi.fn();
      render(
        <BasicTagSelect
          defaultValue={["a", "b"]}
          onValueChange={onValueChange}
          onOptionDelete={onOptionDelete}
        />,
      );
      fireEvent.focus(screen.getByRole("combobox"));
      fireEvent.click(screen.getByRole("button", { name: /Изменить тег Alpha/i }));
      fireEvent.click(screen.getByRole("button", { name: /^Удалить$/i }));
      return onValueChange;
    }

    it("keeps the value while pending: the row is busy, «⋯» spins, focus waits in the input", () => {
      const pending = deferred();
      const onValueChange = startDelete(() => pending.promise);
      const row = screen.getByRole("option", { name: "Alpha" });
      expect(row).toHaveAttribute("aria-busy", "true");
      expect(screen.getByRole("button", { name: /Изменить тег Alpha/i })).toHaveAttribute(
        "aria-busy",
        "true",
      );
      expect(screen.getByRole("button", { name: /Удалить Alpha/i })).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toHaveFocus();
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("a pending row is not picked", () => {
      const pending = deferred();
      const onValueChange = startDelete(() => pending.promise);
      const pick = screen.getByRole("option", { name: "Alpha" }).querySelector("button");
      if (pick) fireEvent.click(pick);
      expect(pick).toBeDisabled();
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("applies the deletion once it resolves", async () => {
      const pending = deferred();
      const onValueChange = startDelete(() => pending.promise);
      await act(async () => pending.resolve());
      expect(onValueChange).toHaveBeenCalledWith(["b"]);
      expect(screen.queryByRole("button", { name: /Удалить Alpha/i })).not.toBeInTheDocument();
    });

    it("a rejection keeps the selection and ends the pending state", async () => {
      const pending = deferred();
      const onValueChange = startDelete(() => pending.promise);
      await act(async () => pending.reject(new Error("cancelled")));
      expect(onValueChange).not.toHaveBeenCalled();
      expect(screen.getByRole("button", { name: /Удалить Alpha/i })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Alpha" })).not.toHaveAttribute("aria-busy");
    });
  });

  it("name submits one hidden input per selected value", () => {
    const { container } = render(<BasicTagSelect name="labels" defaultValue={["a", "b"]} />);
    const inputs = container.querySelectorAll('input[type="hidden"][name="labels"]');
    expect([...inputs].map((input) => (input as HTMLInputElement).value)).toEqual(["a", "b"]);
  });

  it("onOptionDelete without a Promise removes the value at once", () => {
    const onValueChange = vi.fn();
    render(
      <BasicTagSelect
        defaultValue={["a", "b"]}
        onValueChange={onValueChange}
        onOptionDelete={vi.fn()}
      />,
    );
    fireEvent.focus(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("button", { name: /Изменить тег Alpha/i }));
    fireEvent.click(screen.getByRole("button", { name: /^Удалить$/i }));
    expect(onValueChange).toHaveBeenCalledWith(["b"]);
  });

  it("labels переопределяют системные строки", () => {
    render(<BasicTagSelect defaultValue={["a"]} labels={{ remove: "Remove {label}" }} />);
    expect(screen.getByRole("button", { name: "Remove Alpha" })).toBeInTheDocument();
  });

  it("список открывается без строки-подсказки над вариантами", () => {
    render(<BasicTagSelect />);
    fireEvent.focus(screen.getByRole("combobox"));
    const listbox = screen.getByRole("listbox");
    expect(listbox.firstElementChild).toHaveAttribute("role", "option");
  });

  it("чипы — Tag: цвет опции в data-color", () => {
    render(<BasicTagSelect defaultValue={["b"]} />);
    const remove = screen.getByRole("button", { name: /Удалить Beta/i });
    expect(remove.closest("[data-color]")).toHaveAttribute("data-color", "green");
  });

  it("controlled open: onOpenChange и data-state", () => {
    const onOpenChange = vi.fn();
    const { container } = render(<BasicTagSelect open={false} onOpenChange={onOpenChange} />);
    fireEvent.focus(screen.getByRole("combobox"));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(container.querySelector('[data-state="closed"]')).toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("label, hint и error: подпись и описание поля ввода", () => {
    const { rerender } = render(
      <TagSelect options={sampleOptions} label="Метки" hint="До пяти" required />,
    );
    const input = screen.getByRole("combobox", { name: /Метки/ });
    expect(input).toHaveAccessibleDescription("До пяти");
    expect(input).toHaveAttribute("aria-required", "true");
    rerender(<TagSelect options={sampleOptions} label="Метки" error="Нужна метка" />);
    expect(input).toHaveAccessibleDescription("Нужна метка");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  describe("чипы в одну строку", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("не помещающиеся чипы сворачиваются в «+N»", () => {
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(60);
      vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(150);
      render(
        <BasicTagSelect
          options={[...sampleOptions, { value: "c", label: "Gamma", color: "red" }]}
          defaultValue={["a", "b", "c"]}
        />,
      );
      expect(screen.getByRole("button", { name: /Удалить Alpha/i })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /Удалить Beta/i })).not.toBeInTheDocument();
      const more = screen.getByRole("button", { name: "Показать ещё 2" });
      expect(more).toHaveTextContent("+2");
      expect(more.closest("[title]")).toHaveAttribute("title", "Beta, Gamma");
    });

    it("«+N» раскрывает поле со всеми тегами и открывает список", () => {
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(60);
      vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(150);
      const { container } = render(
        <BasicTagSelect
          options={[...sampleOptions, { value: "c", label: "Gamma", color: "red" }]}
          defaultValue={["a", "b", "c"]}
        />,
      );
      fireEvent.click(screen.getByRole("button", { name: "Показать ещё 2" }));
      expect(container.querySelector('[data-expanded="true"]')).not.toBeNull();
      expect(screen.getByRole("button", { name: /Удалить Gamma/i })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /Показать ещё/ })).not.toBeInTheDocument();
      expect(screen.getByRole("listbox")).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toHaveFocus();
    });

    it("сворачивается обратно при уходе фокуса", async () => {
      const { container } = render(
        <>
          <BasicTagSelect defaultValue={["a"]} />
          <button type="button">Снаружи</button>
        </>,
      );
      const input = screen.getByRole("combobox");
      act(() => input.focus());
      expect(container.querySelector('[data-expanded="true"]')).not.toBeNull();
      fireEvent.keyDown(input, { key: "Escape" });
      act(() => screen.getByRole("button", { name: "Снаружи" }).focus());
      await waitFor(() => expect(container.querySelector('[data-expanded="true"]')).toBeNull());
    });
  });

  describe("клавиатура по тегам", () => {
    it("ArrowLeft из пустого ввода — на последний тег, дальше по тегам; ArrowRight с последнего — в ввод", () => {
      render(<BasicTagSelect defaultValue={["a", "b"]} />);
      const input = screen.getByRole("combobox");
      input.focus();
      fireEvent.keyDown(input, { key: "ArrowLeft" });
      const beta = screen
        .getByRole("button", { name: /Удалить Beta/i })
        .closest("[data-chip-value]");
      expect(beta).toHaveFocus();
      fireEvent.keyDown(beta as Element, { key: "ArrowLeft" });
      const alpha = screen
        .getByRole("button", { name: /Удалить Alpha/i })
        .closest("[data-chip-value]");
      expect(alpha).toHaveFocus();
      fireEvent.keyDown(alpha as Element, { key: "ArrowRight" });
      fireEvent.keyDown(beta as Element, { key: "ArrowRight" });
      expect(input).toHaveFocus();
    });

    it("Delete на теге удаляет его, фокус — на соседний, озвучивается «Удалено: …»", () => {
      render(<BasicTagSelect defaultValue={["a", "b"]} />);
      const input = screen.getByRole("combobox");
      input.focus();
      fireEvent.keyDown(input, { key: "ArrowLeft" });
      fireEvent.keyDown(input, { key: "ArrowLeft" });
      const beta = screen
        .getByRole("button", { name: /Удалить Beta/i })
        .closest("[data-chip-value]");
      fireEvent.keyDown(beta as Element, { key: "Delete" });
      expect(screen.queryByRole("button", { name: /Удалить Beta/i })).not.toBeInTheDocument();
      expect(screen.getByRole("status")).toHaveTextContent("Удалено: Beta");
      expect(
        screen.getByRole("button", { name: /Удалить Alpha/i }).closest("[data-chip-value]"),
      ).toHaveFocus();
      fireEvent.keyDown(document.activeElement as Element, { key: "Backspace" });
      expect(screen.getByRole("status")).toHaveTextContent("Удалено: Alpha");
      expect(input).toHaveFocus();
    });

    it("Backspace в пустом вводе озвучивает удаление", () => {
      render(<BasicTagSelect defaultValue={["a"]} />);
      fireEvent.keyDown(screen.getByRole("combobox"), { key: "Backspace" });
      expect(screen.getByRole("status")).toHaveTextContent("Удалено: Alpha");
    });
  });
});

describe("TagSelect focusRing", () => {
  it("focusRing={false} marks the field and keeps the invalid state", () => {
    render(<BasicTagSelect focusRing={false} invalid />);
    const input = screen.getByRole("combobox");
    const control = input.closest("[data-focus-ring]");
    expect(control).toHaveAttribute("data-focus-ring", "false");
    expect(control).toHaveAttribute("data-invalid", "true");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
});

describe("TagSelect — overlay contract", () => {
  it("an outside click closes the panel; a click on the field does not", () => {
    render(
      <div>
        <BasicTagSelect />
        <div data-testid="empty-space" />
      </div>,
    );
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.pointerDown(input);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByTestId("empty-space"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  // One outside click both closes the panel and blurs / collapses the field (focus follows the
  // pointer, foundation §8); previously the first click only closed the panel.
  it("one click on empty space closes the panel and collapses the field", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div>
        <BasicTagSelect defaultValue={["a"]} />
        <p>empty</p>
      </div>,
    );
    const input = screen.getByRole("combobox");
    await user.click(input);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(container.querySelector('[data-expanded="true"]')).not.toBeNull();
    await user.click(screen.getByText("empty"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(input).not.toHaveFocus();
    await waitFor(() => expect(container.querySelector('[data-expanded="true"]')).toBeNull());
  });

  it("Escape closes the panel", () => {
    render(<BasicTagSelect />);
    fireEvent.focus(screen.getByRole("combobox"));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closeOnEscape={false} and closeOnOutsideClick={false} keep the panel open", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <BasicTagSelect closeOnEscape={false} closeOnOutsideClick={false} />
        <div data-testid="outside">outside</div>
      </div>,
    );
    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{Escape}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    fireEvent.pointerDown(screen.getByTestId("outside"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("aria-controls names the list only while it is open", () => {
    render(<BasicTagSelect />);
    const input = screen.getByRole("combobox");
    expect(input).not.toHaveAttribute("aria-controls");
    fireEvent.focus(input);
    expect(input).toHaveAttribute("aria-controls", screen.getByRole("listbox").id);
  });

  it("Shift+F10 and the context menu key open the «⋯» menu of the highlighted row", async () => {
    const user = userEvent.setup();
    const onOptionUpdate = vi.fn();
    render(<BasicTagSelect onOptionUpdate={onOptionUpdate} />);
    const input = screen.getByRole("combobox");
    await user.click(input);
    expect(input).toHaveAttribute("aria-keyshortcuts", "Shift+F10");
    await user.keyboard("{Shift>}{F10}{/Shift}");
    expect(await screen.findByRole("textbox", { name: "Название тега" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ContextMenu" });
    const name = await screen.findByRole("textbox", { name: "Название тега" });
    expect(name).toHaveValue("Beta");
  });

  it("fallbackColor paints a value without an option color", () => {
    render(<BasicTagSelect defaultValue={["c"]} fallbackColor="purple" />);
    const chip = screen
      .getByRole("combobox")
      .closest("[data-state]")
      ?.querySelector('[data-chip-value="c"]');
    expect(chip).toHaveAttribute("data-color", "purple");
  });
});
