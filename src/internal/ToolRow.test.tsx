import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/button/Button";
import { Datepicker } from "@/components/datepicker/Datepicker";
import { SegmentedControl } from "@/components/segmented-control/SegmentedControl";
import { SmartFilter } from "@/components/smart-filter/SmartFilter";
import { Typography } from "@/components/typography/Typography";
import { cssRule, cssValue } from "@/test/css";

import { ToolChips, ToolGroup, ToolRow } from "./ToolRow";

const CSS = "src/internal/ToolRow.module.css";

const kinds = (row: HTMLElement) =>
  Array.from(row.children).map((cell) => cell.getAttribute("data-kind"));

describe("ToolRow", () => {
  it("puts each tool in a cell of its kind, in the order written, fragments opened", () => {
    render(
      <SmartFilter.Root fields={[{ key: "city", label: "Город", options: [] }]}>
        <ToolRow data-testid="row">
          <SmartFilter.Toolbar />
          <>
            <SegmentedControl.Root defaultValue="all" aria-label="Статус">
              <SegmentedControl.Item value="all">Все</SegmentedControl.Item>
              <SegmentedControl.Item value="active">Активные</SegmentedControl.Item>
            </SegmentedControl.Root>
            <Button.Root>Колонки</Button.Root>
          </>
          <Typography as="span" variant="body-s">
            Выбрано: 2
          </Typography>
          <ToolGroup>Легенда</ToolGroup>
        </ToolRow>
      </SmartFilter.Root>,
    );
    const row = screen.getByTestId("row");
    expect(kinds(row)).toEqual(["grow", "share", "fixed", "grow", "grow"]);
    for (const cell of Array.from(row.children)) expect(cell.children).toHaveLength(1);
  });

  it("fills by default and keeps one natural line without fill", () => {
    const { rerender } = render(
      <ToolRow data-testid="row">
        <Button.Root>Экспорт</Button.Root>
      </ToolRow>,
    );
    expect(screen.getByTestId("row")).toHaveAttribute("data-fill", "true");
    rerender(
      <ToolRow data-testid="row" fill={false}>
        <Button.Root>Экспорт</Button.Root>
      </ToolRow>,
    );
    expect(screen.getByTestId("row")).not.toHaveAttribute("data-fill");
  });

  it("gives a SegmentedControl and a Datepicker fullWidth unless set", () => {
    render(
      <ToolRow>
        <SegmentedControl.Root defaultValue="all" aria-label="Раздел">
          <SegmentedControl.Item value="all">Все</SegmentedControl.Item>
        </SegmentedControl.Root>
        <SegmentedControl.Root defaultValue="board" fullWidth={false} aria-label="Вид">
          <SegmentedControl.Item value="board">Доска</SegmentedControl.Item>
        </SegmentedControl.Root>
        <Datepicker.Root mode="range" aria-label="Период" />
      </ToolRow>,
    );
    expect(screen.getByRole("radiogroup", { name: "Раздел" })).toHaveAttribute(
      "data-full-width",
      "true",
    );
    expect(screen.getByRole("radiogroup", { name: "Вид" })).not.toHaveAttribute("data-full-width");
    expect(screen.getByRole("button", { name: /Период/ })).toHaveAttribute(
      "data-full-width",
      "true",
    );
  });

  it("forwards ref and native attributes to the row", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <ToolRow ref={ref} role="group" aria-label="Заказы" className="host">
        <Button.Root>Экспорт</Button.Root>
      </ToolRow>,
    );
    const row = screen.getByRole("group", { name: "Заказы" });
    expect(ref.current).toBe(row);
    expect(row).toHaveClass("host");
  });

  it("lays the kinds out from its own width: search grows, the rest at the end, a short row wraps", () => {
    const fill = cssRule(CSS, '.row[data-fill="true"]');
    expect(cssValue(fill, "container")).toBe("prime-tool-row / inline-size");
    expect(cssValue(fill, "flex-wrap")).toBe("wrap");
    expect(cssValue(fill, "justify-content")).toBe("flex-end");
    expect(cssValue(cssRule(CSS, '.row[data-fill="true"] > .cell'), "flex")).toBe("0 1 auto");
    expect(cssValue(cssRule(CSS, '.row[data-fill="true"] > .cell[data-kind="grow"]'), "flex")).toBe(
      "999 1 calc(var(--prime-space-24) * 2)",
    );
    const short = ["@container prime-tool-row (max-width: 35.99rem)"];
    expect(
      cssValue(
        cssRule(CSS, '.row[data-fill="true"] > .cell[data-kind="grow"]', short),
        "flex-basis",
      ),
    ).toBe("100%");
    expect(
      cssValue(cssRule(CSS, '.row[data-fill="true"] > .cell[data-kind="share"]', short), "flex"),
    ).toBe("1 1 auto");
    expect(cssValue(cssRule(CSS, ".cell"), "flex")).toBe("none");
  });
});

describe("ToolChips", () => {
  it("is a line of its own that takes no space while empty", () => {
    render(<ToolChips data-testid="chips" />);
    expect(screen.getByTestId("chips")).toBeEmptyDOMElement();
    expect(cssValue(cssRule(CSS, ".chips:empty"), "display")).toBe("none");
    expect(cssValue(cssRule(CSS, ".chips > *"), "flex")).toBe("1 1 auto");
  });
});
