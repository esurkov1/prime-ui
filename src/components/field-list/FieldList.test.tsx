import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { ColorPresets } from "@/components/color-picker/ColorPresets";
import { Input } from "@/components/input/Input";
import { Select } from "@/components/select/Select";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import enterMotion from "@/internal/enterMotion.module.css";

import { FieldList, type FieldListColumn, type FieldListProps } from "./FieldList";

type Line = { id: string; service: string; price: string; pinned?: boolean };

const COLUMNS: FieldListColumn[] = [{ label: "Услуга" }, { label: "Цена", width: "m" }];

const LINES: Line[] = [
  { id: "setup", service: "Внедрение", price: "180000" },
  { id: "training", service: "Обучение", price: "15000" },
];

let created = 0;

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
    await user.click(screen.getByRole("button", { name: "Удалить «Внедрение»" }));
    expect(onChange).toHaveBeenLastCalledWith([LINES[1]]);
    expect(screen.getByRole("button", { name: "Удалить «Обучение»" })).toHaveFocus();
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
    expect(screen.getByRole("button", { name: "Удалить строку 1" })).toBeInTheDocument();
  });

  it("disables remove at min and add at max, saying why beside the add button", () => {
    render(<Lines min={2} max={2} />);
    for (const button of screen.getAllByRole("button", { name: /^Удалить/ }))
      expect(button).toBeDisabled();
    expect(screen.getByRole("button", { name: "Добавить позицию" })).toBeDisabled();
    expect(screen.getByText("Не больше 2")).toBeInTheDocument();
  });

  it("pins a locked row: a named lock, no remove button", () => {
    render(
      <Lines
        initial={[{ ...LINES[0], pinned: true } as Line, LINES[1] as Line]}
        getLocked={(line) => line.pinned ?? false}
      />,
    );
    expect(screen.getByRole("img", { name: "Закреплена" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Удалить «Внедрение»" })).toBeNull();
    expect(screen.getByRole("button", { name: "Удалить «Обучение»" })).toBeInTheDocument();
  });

  it("moves a row with Alt+↓ on its handle when reorderable", async () => {
    const onChange = vi.fn();
    render(<Lines reorderable onChange={onChange} />);
    await act(async () => {
      fireEvent.keyDown(screen.getByRole("button", { name: "Переместить «Внедрение»" }), {
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
    const handle = screen.getByRole("button", { name: "Переместить «Обучение»" });
    handle.focus();
    await user.keyboard("{Alt>}{ArrowUp}{/Alt}");
    expect(onChange).toHaveBeenLastCalledWith([LINES[1], LINES[0]]);
    expect(screen.getByRole("button", { name: "Переместить «Обучение»" })).toHaveFocus();
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
    expect(screen.getByRole("button", { name: "Удалить «Внедрение»" })).toHaveFocus();
    await user.tab();
    expect(services[1]).toHaveFocus();
  });

  it("Space on the add button adds a row; Space on a remove button removes its row", async () => {
    const user = userEvent.setup();
    render(<Lines />);
    screen.getByRole("button", { name: "Добавить позицию" }).focus();
    await user.keyboard(" ");
    expect(rowsOf()).toHaveLength(3);
    expect(screen.getAllByRole("textbox", { name: "Услуга" })[2]).toHaveFocus();
    screen.getByRole("button", { name: "Удалить «Внедрение»" }).focus();
    await user.keyboard(" ");
    expect(rowsOf()).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Удалить «Обучение»" })).toHaveFocus();
  });

  it("takes the host tier without its own size", () => {
    render(
      <ControlSizeProvider value="s">
        <Lines />
      </ControlSizeProvider>,
    );
    for (const row of Array.from(rowsOf())) expect(row).toHaveAttribute("data-size", "s");
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
});
