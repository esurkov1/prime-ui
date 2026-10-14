import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FieldList } from "@/components/field-list/FieldList";
import { NativeSelect } from "@/components/native-select/NativeSelect";

import { FieldCellContext, useFieldCell } from "./fieldCell";

function Probe() {
  const cell = useFieldCell();
  return (
    <span data-testid="cell">
      {cell ? `${cell.label}:${cell.hidden}:${cell.required}` : "none"}
    </span>
  );
}

describe("fieldCell", () => {
  it("is null outside a FieldList cell", () => {
    render(<Probe />);
    expect(screen.getByTestId("cell")).toHaveTextContent("none");
  });

  it("a cell provides its column heading and whether the column is required", () => {
    render(
      <FieldCellContext value={{ label: "Цена", hidden: "wide", required: true }}>
        <Probe />
      </FieldCellContext>,
    );
    expect(screen.getByTestId("cell")).toHaveTextContent("Цена:wide:true");
  });

  it("FieldList names the field of a cell by its column and passes the column's required", () => {
    render(
      <FieldList
        label="Позиции"
        columns={[{ label: "Единица", required: true }]}
        defaultValue={[{ id: "a" }]}
        getId={(item: { id: string }) => item.id}
        renderItem={() => <Probe />}
      />,
    );
    expect(screen.getByTestId("cell")).toHaveTextContent("Единица:always:true");
    expect(screen.queryByRole("combobox")).toBeNull();
    render(
      <FieldCellContext value={{ label: "Единица", hidden: "always", required: false }}>
        <NativeSelect>
          <option value="pcs">шт.</option>
        </NativeSelect>
      </FieldCellContext>,
    );
    expect(screen.getByRole("combobox", { name: "Единица" })).toBeInTheDocument();
  });
});
