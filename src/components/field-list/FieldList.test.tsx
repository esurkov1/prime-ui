import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { ColorPresets } from "@/components/color-picker/ColorPresets";
import { Input } from "@/components/input/Input";
import { Select } from "@/components/select/Select";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import enterMotion from "@/internal/enterMotion.module.css";
import frame from "@/internal/FieldFrame.module.css";
import hairline from "@/internal/hairline.module.css";
import { cssRule, cssValue } from "@/test/css";

import { FieldList, type FieldListColumn, type FieldListProps } from "./FieldList";

const CSS = "src/components/field-list/FieldList.module.css";

type Line = { id: string; service: string; price: string; pinned?: boolean };

const COLUMNS: FieldListColumn[] = [{ label: "Услуга" }, { label: "Цена", width: "m" }];

const LINES: Line[] = [
  { id: "setup", service: "Внедрение", price: "180000" },
  { id: "training", service: "Обучение", price: "15000" },
];

let created = 0;

type Point = { id: string; text: string };

const POINTS: Point[] = [
  { id: "storage", text: "200 ГБ" },
  { id: "api", text: "API" },
];

/** A one-column list: each row's remove sits inside its field. */
function Points({
  onChange,
  ...rest
}: Partial<FieldListProps<Point>> & { onChange?: (points: Point[]) => void }) {
  const [points, setPoints] = React.useState(POINTS);
  return (
    <FieldList
      label="Преимущества"
      columns={[{ label: "Преимущество" }]}
      value={points}
      onValueChange={(next) => {
        setPoints(next);
        onChange?.(next);
      }}
      getId={(point) => point.id}
      getLabel={(point) => point.text}
      renderItem={(point, row) => (
        <Input.Root>
          <Input.Wrapper>
            <Input.Field
              value={point.text}
              onChange={(event) => row.update({ text: event.target.value })}
            />
          </Input.Wrapper>
        </Input.Root>
      )}
      {...rest}
    />
  );
}

function Lines({
  onChange,
  initial = LINES,
  ...rest
}: Partial<FieldListProps<Line>> & { onChange?: (lines: Line[]) => void; initial?: Line[] }) {
  const [lines, setLines] = React.useState(initial);
  return (
    <FieldList
      label="Позиции счёта"
      columns={COLUMNS}
      value={lines}
      onValueChange={(next) => {
        setLines(next);
        onChange?.(next);
      }}
      getId={(line) => line.id}
      getLabel={(line) => line.service}
      createItem={() => ({ id: `new-${++created}`, service: "", price: "" })}
      addLabel="Добавить позицию"
      renderItem={(line, row) => (
        <>
          <Input.Root>
            <Input.Wrapper>
              <Input.Field
                value={line.service}
                onChange={(event) => row.update({ service: event.target.value })}
              />
            </Input.Wrapper>
          </Input.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Field
                value={line.price}
                onChange={(event) => row.update({ price: event.target.value })}
              />
            </Input.Wrapper>
          </Input.Root>
        </>
      )}
      {...rest}
    />
  );
}

const rowsOf = () => screen.getByRole("list", { name: "Позиции счёта" }).children;

describe("FieldList", () => {
  it("draws the headings once, hidden from assistive tech, above an ordered list of rows", () => {
    render(<Lines />);
    const list = screen.getByRole("list", { name: "Позиции счёта" });
    expect(list.tagName).toBe("OL");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    const headings = screen.getAllByText("Услуга");
    // One visible heading; the other two are the fields' own, visually hidden labels.
    expect(headings.filter((node) => node.closest("[aria-hidden='true']"))).toHaveLength(1);
  });

  it("names every field in a cell by its column heading", () => {
    render(<Lines />);
    expect(screen.getAllByRole("textbox", { name: "Услуга" })).toHaveLength(2);
    expect(screen.getAllByRole("textbox", { name: "Цена" })).toHaveLength(2);
    expect(screen.getAllByRole("textbox", { name: "Услуга" })[0]).toHaveValue("Внедрение");
  });

  it("shows each field's column label once the rows stack, unless stackedLabels is false", () => {
    const narrow = ["@container (width < 30rem)"];
    const FRAME_CSS = "src/internal/FieldFrame.module.css";
    // The one rule that shows a cell's label: the stacked query, on the `cellLabel` class.
    expect(cssValue(cssRule(FRAME_CSS, ".label.cellLabel", narrow), "position")).toBe("static");
    const labelsOf = () =>
      screen
        .getAllByText(/^(Услуга|Цена)$/)
        .filter((node) => !node.closest("[aria-hidden='true']"));
    const { unmount } = render(<Lines />);
    for (const label of labelsOf()) expect(label).toHaveClass(frame.cellLabel);
    for (const row of Array.from(rowsOf())) expect(row).not.toHaveAttribute("data-unlabelled");
    unmount();

    render(<Lines stackedLabels={false} />);
    const labels = labelsOf();
    expect(labels).toHaveLength(4);
    for (const label of labels) expect(label).not.toHaveClass(frame.cellLabel);
    // The names stay: every field is still named by its column.
    expect(screen.getAllByRole("textbox", { name: "Услуга" })).toHaveLength(2);
    expect(screen.getAllByRole("textbox", { name: "Цена" })).toHaveLength(2);
    // A stacked row without labels keeps its actions on the middle of its first field.
    for (const row of Array.from(rowsOf())) expect(row).toHaveAttribute("data-unlabelled");
    const stacked = ["@container prime-field-list (width < 30rem)"];
    expect(
      cssValue(
        cssRule(CSS, ".record:not([data-unlabelled]) > :is(.grip, .end)", stacked),
        "margin-block-start",
      ),
    ).toBe("calc(var(--fl-label-lh) + var(--fl-label-gap))");
    expect(cssValue(cssRule(CSS, ".record[data-unlabelled]", stacked), "row-gap")).toBe(
      "var(--prime-space-3)",
    );
  });

  it("keeps a field's own label as its name and still hides it on wide rows", () => {
    render(
      <FieldList
        columns={[{ label: "Услуга" }]}
        defaultValue={[{ id: "a" }]}
        getId={(item) => item.id}
        renderItem={() => (
          <Input.Root label="Название услуги">
            <Input.Wrapper>
              <Input.Field />
            </Input.Wrapper>
          </Input.Root>
        )}
      />,
    );
    expect(screen.getByRole("textbox", { name: "Название услуги" })).toBeInTheDocument();
  });

  it("draws no heading row for one column: the list label names the rows", () => {
    const { container } = render(
      <FieldList
        label="Преимущества"
        columns={[{ label: "Преимущество" }]}
        defaultValue={[{ id: "a", text: "200 ГБ" }]}
        getId={(item) => item.id}
        renderItem={(item) => (
          <Input.Root>
            <Input.Wrapper>
              <Input.Field defaultValue={item.text} />
            </Input.Wrapper>
          </Input.Root>
        )}
      />,
    );
    expect(container.querySelector("[aria-hidden='true'] label")).toBeNull();
    expect(screen.getByRole("textbox", { name: "Преимущество" })).toHaveValue("200 ГБ");
  });

  it("updates an item through row.update", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Lines onChange={onChange} />);
    await user.type(screen.getAllByRole("textbox", { name: "Цена" })[1] as HTMLElement, "0");
    expect(onChange).toHaveBeenLastCalledWith([
      LINES[0],
      { id: "training", service: "Обучение", price: "150000" },
    ]);
  });

  it("adds a row from createItem and focuses its first field", async () => {
    const user = userEvent.setup();
    render(<Lines />);
    await user.click(screen.getByRole("button", { name: "Добавить позицию" }));
    expect(rowsOf()).toHaveLength(3);
    const fields = screen.getAllByRole("textbox", { name: "Услуга" });
    expect(fields[2]).toHaveFocus();
  });

  it("names the remove button by the row and moves focus to the next row's remove", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Lines onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "Удалить: «Внедрение»" }));
    expect(onChange).toHaveBeenLastCalledWith([LINES[1]]);
    expect(screen.getByRole("button", { name: "Удалить: «Обучение»" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(rowsOf()).toHaveLength(0);
    expect(screen.getByRole("button", { name: "Добавить позицию" })).toHaveFocus();
  });

  it("a row the data adds rises in; the first rows stay still", async () => {
    const user = userEvent.setup();
    render(<Lines />);
    for (const row of Array.from(rowsOf())) expect(row).not.toHaveClass(enterMotion.enter);
    await user.click(screen.getByRole("button", { name: "Добавить позицию" }));
    const rows = Array.from(rowsOf());
    expect(rows[2]).toHaveClass(enterMotion.enter);
    expect(rows[0]).not.toHaveClass(enterMotion.enter);
  });

  it("the heading row rises in with the first row of an empty list", async () => {
    const user = userEvent.setup();
    const { container } = render(<Lines initial={[]} />);
    expect(container.querySelector("[aria-hidden='true'] label")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Добавить позицию" }));
    const head = screen.getAllByText("Услуга")[0]?.closest("[aria-hidden='true']");
    expect(head).toHaveClass(enterMotion.enter);
  });

  it("names an untitled row by its number", () => {
    render(<Lines initial={[{ id: "x", service: "", price: "" }]} />);
    expect(screen.getByRole("button", { name: "Удалить: строка 1" })).toBeInTheDocument();
  });

  it("disables remove at min and takes the add button away at max, with no text of its own", () => {
    const { container } = render(<Lines min={2} max={2} />);
    for (const button of screen.getAllByRole("button", { name: /^Удалить/ }))
      expect(button).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Добавить позицию" })).toBeNull();
    expect(container).not.toHaveTextContent(/2/);
  });

  it("brings the add button back, rising in, once a row leaves a full list", async () => {
    const user = userEvent.setup();
    render(<Lines max={2} />);
    expect(screen.queryByRole("button", { name: "Добавить позицию" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Удалить: «Обучение»" }));
    const add = screen.getByRole("button", { name: "Добавить позицию" });
    expect(add).toBeEnabled();
    expect(add.parentElement).toHaveClass(enterMotion.enter);
    await user.click(add);
    expect(rowsOf()).toHaveLength(2);
    expect(screen.queryByRole("button", { name: "Добавить позицию" })).toBeNull();
  });

  it("keeps a pinned row's remove in its slot, off, and says why on focus", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Lines
        initial={[{ ...LINES[0], pinned: true } as Line, LINES[1] as Line]}
        getLocked={(line) => line.pinned ?? false}
        labels={{ lockedReason: "Базовую строку нельзя удалить" }}
        onChange={onChange}
      />,
    );
    // No lock column without `reorderable`: every row has the same slots, the pinned one's is off.
    expect(screen.queryByRole("img")).toBeNull();
    const [pinned, free] = Array.from(rowsOf());
    expect(pinned?.children).toHaveLength(free?.children.length ?? -1);
    const off = screen.getByRole("button", { name: "Удалить: «Внедрение»" });
    expect(off).toHaveAttribute("aria-disabled", "true");
    expect(pinned?.lastElementChild).toContainElement(off);
    (screen.getAllByRole("textbox", { name: "Цена" })[0] as HTMLElement).focus();
    await user.tab();
    expect(off).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Базовую строку нельзя удалить");
    expect(off).toHaveAttribute("aria-describedby", screen.getByRole("tooltip").id);
    await user.keyboard("{Enter} ");
    expect(onChange).not.toHaveBeenCalled();
    expect(rowsOf()).toHaveLength(2);
  });

  it("moves a row with Alt+↓ on its handle when reorderable", async () => {
    const onChange = vi.fn();
    render(<Lines reorderable onChange={onChange} />);
    await act(async () => {
      fireEvent.keyDown(screen.getByRole("button", { name: "Переместить: «Внедрение»" }), {
        key: "ArrowDown",
        altKey: true,
      });
    });
    expect(onChange).toHaveBeenLastCalledWith([LINES[1], LINES[0]]);
  });

  it("moves a row up with Alt+↑ on its handle and keeps focus on the handle", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Lines reorderable onChange={onChange} />);
    const handle = screen.getByRole("button", { name: "Переместить: «Обучение»" });
    handle.focus();
    await user.keyboard("{Alt>}{ArrowUp}{/Alt}");
    expect(onChange).toHaveBeenLastCalledWith([LINES[1], LINES[0]]);
    expect(screen.getByRole("button", { name: "Переместить: «Обучение»" })).toHaveFocus();
  });

  it("menu mode: one «⋯» per row whose menu moves the row and removes it", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Lines rowActions="menu" reorderable onChange={onChange} />);
    expect(screen.queryByRole("button", { name: /^Удалить/ })).toBeNull();
    expect(screen.queryByRole("button", { name: /^Переместить/ })).toBeNull();
    const more = screen.getByRole("button", { name: "Действия: «Внедрение»" });
    expect(more).toHaveAttribute("aria-keyshortcuts", "Alt+ArrowUp Alt+ArrowDown");
    more.focus();
    await user.keyboard("{Enter}");
    // The first row cannot go higher: focus starts on «Ниже».
    expect(await screen.findByRole("menuitem", { name: /Выше/ })).toBeDisabled();
    expect(screen.getByRole("menuitem", { name: /Ниже/ })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenLastCalledWith([LINES[1], LINES[0]]);
    expect(await screen.findByRole("status")).toHaveTextContent("«Внедрение»: позиция 2 из 2");
  });

  it("menu mode: «Удалить» removes the row and focus goes to the next row's «⋯»", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Lines rowActions="menu" onChange={onChange} />);
    screen.getByRole("button", { name: "Действия: «Внедрение»" }).focus();
    await user.keyboard("{Enter}");
    // Without `reorderable` the menu holds only the remove.
    expect(screen.queryByRole("menuitem", { name: /Выше/ })).toBeNull();
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenLastCalledWith([LINES[1]]);
    expect(screen.getByRole("button", { name: "Действия: «Обучение»" })).toHaveFocus();
  });

  it("menu mode: Alt+↓ on «⋯» moves the row without opening the menu and keeps focus there", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Lines rowActions="menu" reorderable onChange={onChange} />);
    screen.getByRole("button", { name: "Действия: «Внедрение»" }).focus();
    await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
    expect(onChange).toHaveBeenLastCalledWith([LINES[1], LINES[0]]);
    expect(screen.queryByRole("menu")).toBeNull();
    expect(screen.getByRole("button", { name: "Действия: «Внедрение»" })).toHaveFocus();
    await user.keyboard("{Alt>}{ArrowUp}{/Alt}");
    expect(onChange).toHaveBeenLastCalledWith([LINES[0], LINES[1]]);
  });

  it("menu mode: a pinned row's items are off and the remove item says why", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Lines
        rowActions="menu"
        reorderable
        onChange={onChange}
        getLocked={(line) => line.id === "setup"}
      />,
    );
    screen.getByRole("button", { name: "Действия: «Обучение»" }).focus();
    await user.keyboard("{Enter}");
    // A free row cannot trade places with the pinned one above it.
    expect(await screen.findByRole("menuitem", { name: /Выше/ })).toBeDisabled();
    await user.keyboard("{Escape}");
    screen.getByRole("button", { name: "Действия: «Внедрение»" }).focus();
    await user.keyboard("{Enter}");
    const removeItem = await screen.findByRole("menuitem", { name: /Удалить/ });
    expect(removeItem).toBeDisabled();
    expect(removeItem).toHaveAccessibleDescription("Закреплённую строку нельзя удалить");
    expect(screen.getByRole("menuitem", { name: /Ниже/ })).toBeDisabled();
    await user.keyboard("{Escape}");
    await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("variant surface puts the rows on a fill one step up the ladder; plain leaves them on the host", () => {
    const { rerender } = render(<Lines />);
    const sheetOf = () => rowsOf()[0]?.closest("ol")?.parentElement as HTMLElement;
    expect(sheetOf()).toHaveAttribute("data-variant", "plain");
    expect(sheetOf()).not.toHaveAttribute("data-depth");
    rerender(<Lines variant="surface" />);
    expect(sheetOf()).toHaveAttribute("data-variant", "surface");
    expect(sheetOf()).toHaveAttribute("data-depth", "1");
  });

  it("joins every row to the line run; a plain one-line list insets its lines to nothing", () => {
    const { rerender } = render(<Lines />);
    expect(rowsOf()[1]?.className).toContain(hairline.between);
    rerender(<Lines variant="surface" />);
    expect(rowsOf()[1]?.className).toContain(hairline.between);
    // A plain list on one line per record: one gap between the rows, no line.
    const plain = cssRule(CSS, '.sheet[data-variant="plain"] .record');
    expect(cssValue(plain, "--hairline-inset")).toBe("50%");
    expect(cssValue(plain, "padding-block")).toBe("var(--prime-space-1)");
    // The heading keeps the label gap above the first row's fields.
    expect(cssValue(cssRule(CSS, '.sheet[data-variant="plain"] .head'), "padding-block")).toBe(
      "var(--prime-space-0) var(--prime-space-1)",
    );
    // A reorderable list adds no room of its own between the rows.
    expect(cssValue(cssRule(CSS, ".rows"), "--dnd-sortable-gap")).toBe("var(--prime-space-0)");
  });

  it("parts stacked records with a line in both variants; a one-column plain list keeps its air", () => {
    const narrow = ["@container prime-field-list (width < 30rem)"];
    expect(cssValue(cssRule(CSS, ".record", narrow), "padding-block")).toBe("var(--prime-space-3)");
    const plain = cssRule(CSS, '.sheet[data-variant="plain"] .record:not([data-single])', narrow);
    expect(cssValue(plain, "--hairline-inset")).toBe("0%");
    expect(cssValue(plain, "padding-block")).toBe("var(--prime-space-3)");
    expect(cssValue(cssRule(CSS, '.sheet[data-variant="surface"] .row'), "--hairline-inset")).toBe(
      "var(--fl-pad)",
    );
  });

  it("Tab walks a row's fields, then its remove button, then the next row", async () => {
    const user = userEvent.setup();
    render(<Lines />);
    const services = screen.getAllByRole("textbox", { name: "Услуга" });
    const prices = screen.getAllByRole("textbox", { name: "Цена" });
    (services[0] as HTMLElement).focus();
    await user.tab();
    expect(prices[0]).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Удалить: «Внедрение»" })).toHaveFocus();
    await user.tab();
    expect(services[1]).toHaveFocus();
  });

  it("ends a reorderable row with its handle: Tab reaches the fields, the remove button, then the handle", async () => {
    const user = userEvent.setup();
    render(<Lines reorderable />);
    const [first] = Array.from(rowsOf());
    expect(first?.lastElementChild).toContainElement(
      screen.getByRole("button", { name: "Переместить: «Внедрение»" }),
    );
    const prices = screen.getAllByRole("textbox", { name: "Цена" });
    (prices[0] as HTMLElement).focus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Удалить: «Внедрение»" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Переместить: «Внедрение»" })).toHaveFocus();
    await user.tab();
    expect(screen.getAllByRole("textbox", { name: "Услуга" })[1]).toHaveFocus();
  });

  it("puts a pinned row's lock in the same end box as the other rows' handles", () => {
    render(
      <Lines
        reorderable
        initial={[{ ...LINES[0], pinned: true } as Line, LINES[1] as Line]}
        getLocked={(line) => line.pinned ?? false}
      />,
    );
    const [pinned, free] = Array.from(rowsOf());
    expect(pinned?.lastElementChild).toContainElement(
      screen.getByRole("img", { name: "Закреплено" }),
    );
    expect(free?.lastElementChild).toContainElement(
      screen.getByRole("button", { name: "Переместить: «Обучение»" }),
    );
    expect(pinned?.lastElementChild?.className).toBe(free?.lastElementChild?.className);
    // The remove slot before the grip holds the pinned row's remove too, off.
    expect(pinned?.children[1]).toContainElement(
      screen.getByRole("button", { name: "Удалить: «Внедрение»" }),
    );
    expect(screen.getByRole("button", { name: "Удалить: «Внедрение»" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("ends a one-column row with its own remove button, as every row: Tab reaches it, Enter removes the row", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Points onChange={onChange} />);
    const row = screen.getAllByRole("listitem")[0] as HTMLElement;
    const remove = screen.getByRole("button", { name: "Удалить: «200 ГБ»" });
    // Not a segment of the field (a «×» inside a field clears its text): the row's end slot.
    expect(remove).not.toHaveAttribute("data-field-action");
    expect(row.children[1]).toContainElement(remove);
    expect(row.style.getPropertyValue("--fl-columns")).toBe("minmax(0, 1fr) var(--fl-end)");
    (screen.getAllByRole("textbox")[0] as HTMLElement).focus();
    await user.tab();
    expect(remove).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenLastCalledWith([POINTS[1]]);
    expect(screen.getByRole("button", { name: "Удалить: «API»" })).toHaveFocus();
  });

  it("keeps a pinned one-column row's remove in its end slot, off, with its reason", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Points onChange={onChange} getLocked={(point) => point.id === "storage"} />);
    (screen.getAllByRole("textbox")[0] as HTMLElement).focus();
    await user.tab();
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Закреплённую строку нельзя удалить",
    );
    const off = screen.getByRole("button", { name: "Удалить: «200 ГБ»" });
    expect(off).toHaveAttribute("aria-disabled", "true");
    await user.keyboard("{Enter}");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("Space on the add button adds a row; Space on a remove button removes its row", async () => {
    const user = userEvent.setup();
    render(<Lines />);
    screen.getByRole("button", { name: "Добавить позицию" }).focus();
    await user.keyboard(" ");
    expect(rowsOf()).toHaveLength(3);
    expect(screen.getAllByRole("textbox", { name: "Услуга" })[2]).toHaveFocus();
    screen.getByRole("button", { name: "Удалить: «Внедрение»" }).focus();
    await user.keyboard(" ");
    expect(rowsOf()).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Удалить: «Обучение»" })).toHaveFocus();
  });

  it("takes the host tier without its own size", () => {
    render(
      <ControlSizeProvider value="s">
        <Lines />
      </ControlSizeProvider>,
    );
    for (const row of Array.from(rowsOf())) expect(row).toHaveAttribute("data-size", "s");
  });

  it("ends a row on a filled edge: the «×» and the «⋯» are soft neutral at the row's field tier", () => {
    const { rerender } = render(
      <ControlSizeProvider value="l">
        <Lines />
      </ControlSizeProvider>,
    );
    const remove = screen.getByRole("button", { name: "Удалить: «Внедрение»" });
    expect(remove).toHaveAttribute("data-variant", "soft");
    expect(remove).toHaveAttribute("data-tone", "neutral");
    expect(remove).toHaveAttribute("data-size", "l");
    rerender(
      <ControlSizeProvider value="l">
        <Lines rowActions="menu" reorderable />
      </ControlSizeProvider>,
    );
    const more = screen.getByRole("button", { name: "Действия: «Внедрение»" });
    expect(more).toHaveAttribute("data-variant", "soft");
    expect(more).toHaveAttribute("data-size", "l");
  });

  it("disables every field and button", () => {
    render(<Lines disabled reorderable />);
    for (const field of screen.getAllByRole("textbox")) expect(field).toBeDisabled();
    for (const button of screen.getAllByRole("button")) expect(button).toBeDisabled();
  });

  it("shows the list error under the list and describes the list by its hint and error", () => {
    render(<Lines hint="Цены без НДС" error="Добавьте хотя бы одну позицию" />);
    expect(screen.getByText("Добавьте хотя бы одну позицию")).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Позиции счёта" })).toHaveAccessibleDescription(
      /Добавьте хотя бы одну позицию/,
    );
  });

  it("names the list by aria-label when no visible label names it", () => {
    render(<Lines label={undefined} aria-label="Позиции счёта" />);
    expect(screen.getByRole("list", { name: "Позиции счёта" }).tagName).toBe("OL");
  });

  it("sends ref, className and native attributes to the frame", () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(<Lines ref={ref} className="custom" data-id="lines" />);
    expect(ref.current).toBe(container.firstElementChild);
    expect(ref.current).toHaveClass("custom");
    expect(ref.current).toHaveAttribute("data-id", "lines");
  });

  it("throws when a row renders a different number of cells than columns", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <FieldList
          columns={COLUMNS}
          defaultValue={[{ id: "a" }]}
          getId={(item) => item.id}
          renderItem={() => <span />}
        />,
      ),
    ).toThrow(/renders 1 cells for 2 columns/);
    error.mockRestore();
  });

  it("names an icon-only Select and a ColorPresets swatch by their headings", () => {
    render(
      <FieldList
        columns={[
          { label: "Иконка", width: "compact" },
          { label: "Цвет", width: "compact" },
        ]}
        defaultValue={[{ id: "a" }]}
        getId={(item) => item.id}
        renderItem={() => (
          <>
            <Select.Root defaultValue="users">
              <Select.Trigger>
                <Select.TriggerIcon>i</Select.TriggerIcon>
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="users">Пользователи</Select.Item>
              </Select.Content>
            </Select.Root>
            <ColorPresets.Root defaultValue="#22c55e">
              <ColorPresets.Trigger>
                <ColorPresets.SwatchButton />
              </ColorPresets.Trigger>
              <ColorPresets.Content />
            </ColorPresets.Root>
          </>
        )}
      />,
    );
    const trigger = screen.getByRole("combobox", { name: "Иконка" });
    expect(trigger).toHaveAttribute("data-icon-only", "true");
    expect(trigger).toHaveTextContent("Пользователи");
    expect(screen.getByRole("button", { name: "Цвет: Зелёный" })).toBeInTheDocument();
  });

  it("keeps a removed row out while a promise from onValueChange saves it, and brings it back on a rejection", async () => {
    const user = userEvent.setup();
    let reject: () => void = () => {};
    const onValueChange = vi.fn(
      () =>
        new Promise<void>((_, fail) => {
          reject = () => fail(new Error("offline"));
        }),
    );
    render(<Lines value={LINES} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Удалить: «Внедрение»" }));
    expect(onValueChange).toHaveBeenLastCalledWith([LINES[1]]);
    expect(rowsOf()).toHaveLength(1);
    expect(screen.getByRole("list", { name: "Позиции счёта" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    await act(async () => reject());
    expect(rowsOf()).toHaveLength(2);
    expect(screen.getByRole("list", { name: "Позиции счёта" })).not.toHaveAttribute("aria-busy");
  });

  it("keeps an uncontrolled edit once its promise resolves", async () => {
    const user = userEvent.setup();
    let resolve: () => void = () => {};
    render(
      <FieldList
        aria-label="Позиции"
        columns={COLUMNS}
        defaultValue={LINES}
        getId={(line) => line.id}
        getLabel={(line) => line.service}
        onValueChange={() =>
          new Promise<void>((done) => {
            resolve = done;
          })
        }
        renderItem={() => (
          <>
            <span>a</span>
            <span>b</span>
          </>
        )}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Удалить: «Внедрение»" }));
    await act(async () => resolve());
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("draws a totals group under the rows: a total per column, the first empty cell names it", () => {
    render(
      <Lines
        renderTotals={(items) => (
          <>
            {null}
            {`${items.reduce((sum, line) => sum + Number(line.price), 0)} ₽`}
          </>
        )}
      />,
    );
    const totals = screen.getByRole("group", { name: "Итого" });
    expect(totals).toHaveTextContent("Итого");
    // The column name is read before the value; the visible «Итого» is the group's name already.
    expect(totals).toHaveTextContent("Цена195000 ₽");
    expect(screen.getByText("Итого")).toHaveAttribute("aria-hidden", "true");
  });

  it("ends a total at the end edge where its column's field ends its text", () => {
    render(
      <FieldList
        aria-label="Позиции"
        columns={COLUMNS}
        defaultValue={LINES}
        getId={(line) => line.id}
        renderItem={(line) => (
          <>
            <Input.Root>
              <Input.Wrapper>
                <Input.Field defaultValue={line.service} />
              </Input.Wrapper>
            </Input.Root>
            <Input.Root>
              <Input.Wrapper>
                {/* The stylesheet is not loaded here: the field's end alignment is set in place. */}
                <Input.Field defaultValue={line.price} style={{ textAlign: "end" }} />
              </Input.Wrapper>
            </Input.Root>
          </>
        )}
        renderTotals={() => (
          <>
            {"2 позиции"}
            {"195000 ₽"}
          </>
        )}
      />,
    );
    const totals = screen.getByRole("group", { name: "Итого" });
    expect(totals.querySelector("[data-align='end']")).toHaveTextContent("195000 ₽");
    expect(screen.getByText("2 позиции").parentElement).not.toHaveAttribute("data-align");
  });

  it("draws no totals for an empty list and throws on a totals count other than the columns", () => {
    const { unmount } = render(
      <Lines
        initial={[]}
        renderTotals={() => (
          <>
            {null}
            {null}
          </>
        )}
      />,
    );
    expect(screen.queryByRole("group", { name: "Итого" })).toBeNull();
    unmount();
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Lines renderTotals={() => "1"} />)).toThrow(
      /renderTotals returns 1 cells for 2 columns/,
    );
    error.mockRestore();
  });

  it("sizes a compact column by its widest cell, so every gap is the column gap", () => {
    const widths: Record<string, number> = { control: 36, heading: 30 };
    const rect = vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (
      this: Element,
    ) {
      const kind =
        this.getAttribute("data-width") === "compact"
          ? this.tagName === "LABEL"
            ? "heading"
            : "control"
          : null;
      return { width: kind ? (widths[kind] ?? 0) : 0 } as DOMRect;
    });
    const { container } = render(
      <FieldList
        aria-label="Цвета"
        columns={[{ label: "Цвет", width: "compact" }, { label: "Параметр" }]}
        defaultValue={[{ id: "a" }]}
        getId={(item) => item.id}
        renderItem={() => (
          <>
            <span>●</span>
            <span>Хранилище</span>
          </>
        )}
      />,
    );
    const row = screen.getByRole("listitem");
    expect(row.style.getPropertyValue("--fl-columns")).toBe(
      "var(--fl-compact-0, max-content) minmax(0, 1fr) var(--fl-end)",
    );
    const body = row.closest("ol")?.parentElement?.parentElement as HTMLElement;
    expect(body.style.getPropertyValue("--fl-compact-0")).toBe("36px");
    expect(container.querySelector("label[data-width='compact']")).not.toBeNull();
    rect.mockRestore();
  });

  it("stacked rows keep the main field wide enough: the actions move to the value line, else the field takes its own line", () => {
    let rowWidth = 250;
    const width = vi
      .spyOn(HTMLElement.prototype, "clientWidth", "get")
      .mockImplementation(function (this: HTMLElement) {
        return this.tagName === "LI" ? rowWidth : 0;
      });
    const rect = vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (
      this: Element,
    ) {
      if (this.getAttribute("data-width") === "compact") return { width: 64 } as DOMRect;
      return { width: this.tagName === "SPAN" ? 40 : 0 } as DOMRect;
    });
    const columns: FieldListColumn[] = [
      { label: "Иконка", width: "compact" },
      { label: "Параметр" },
      { label: "Значение" },
    ];
    const renderSpecs = () => (
      <>
        <span>●</span>
        <span>Вход через SSO</span>
        <span>SAML, OIDC</span>
      </>
    );
    const { rerender } = render(
      <FieldList
        aria-label="Характеристики"
        columns={columns}
        defaultValue={[{ id: "sso" }]}
        getId={(item) => item.id}
        renderItem={renderSpecs}
      />,
    );
    const row = screen.getByRole("listitem");
    const body = row.closest("ol")?.parentElement?.parentElement as HTMLElement;
    // 250 − 64 (icon) − 40 (×) − the gaps leaves under the main field's least width (160).
    expect(body).toHaveAttribute("data-stack", "actions");
    expect(row.querySelector("[data-place='main']")).not.toBeNull();
    expect(row.querySelector("[data-place='value']")).not.toBeNull();
    // 200 − 64 leaves under it even without the actions: the main field takes its own line.
    rowWidth = 200;
    rerender(
      <FieldList
        aria-label="Характеристики"
        columns={columns}
        defaultValue={[{ id: "sso" }]}
        getId={(item) => item.id}
        renderItem={renderSpecs}
        min={0}
      />,
    );
    expect(body).toHaveAttribute("data-stack", "main");
    rowWidth = 420;
    rerender(
      <FieldList
        aria-label="Характеристики"
        columns={columns}
        defaultValue={[{ id: "sso" }]}
        getId={(item) => item.id}
        renderItem={renderSpecs}
        rowActions="menu"
      />,
    );
    expect(body).not.toHaveAttribute("data-stack");
    width.mockRestore();
    rect.mockRestore();
  });

  it("sizes an xs column on its own track", () => {
    render(
      <FieldList
        aria-label="Доли"
        columns={[{ label: "Участник" }, { label: "Доля", width: "xs" }]}
        defaultValue={[{ id: "a" }]}
        getId={(item) => item.id}
        renderItem={() => (
          <>
            <span>Анна</span>
            <span>50</span>
          </>
        )}
      />,
    );
    const row = screen.getByRole("listitem");
    expect(row.style.getPropertyValue("--fl-columns")).toBe(
      "minmax(0, 1fr) var(--fl-xs) var(--fl-end)",
    );
  });
});
