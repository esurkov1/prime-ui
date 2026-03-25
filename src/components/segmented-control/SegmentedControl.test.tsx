import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SegmentedControl } from "./SegmentedControl";

const segmentedModuleCssPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "SegmentedControl.module.css",
);

function renderSegmented(overrides?: { disabled?: boolean }) {
  return render(
    <SegmentedControl.Root defaultValue="a" {...overrides}>
      <SegmentedControl.Item value="a">Option A</SegmentedControl.Item>
      <SegmentedControl.Item value="b">Option B</SegmentedControl.Item>
      <SegmentedControl.Item value="c">Option C</SegmentedControl.Item>
    </SegmentedControl.Root>,
  );
}

describe("SegmentedControl — размеры (регрессия CSS)", () => {
  it("визуальный ярус смещён на ступень вниз без коэффициентов 0.8/0.85 для s", () => {
    const css = readFileSync(segmentedModuleCssPath, "utf8");

    const sBlock = css.match(/\.root\[data-size="s"\]\s*\{[^}]*\}/s)?.[0] ?? "";
    const mBlock = css.match(/\.root\[data-size="m"\]\s*\{[^}]*\}/s)?.[0] ?? "";
    const lBlock = css.match(/\.root\[data-size="l"\]\s*\{[^}]*\}/s)?.[0] ?? "";
    const xlBlock = css.match(/\.root\[data-size="xl"\]\s*\{[^}]*\}/s)?.[0] ?? "";

    expect(sBlock).toContain("--prime-seg-height: var(--prime-sys-size-control-xs-height)");
    expect(sBlock).toContain("--prime-seg-gap: var(--prime-sys-size-control-xs-gap)");
    expect(sBlock).toContain("--prime-seg-text: var(--prime-sys-size-control-xs-text)");
    expect(sBlock).toContain(
      "--prime-seg-item-pad-x: var(--prime-sys-size-control-xs-buttonPaddingX)",
    );
    expect(sBlock).toContain(
      "--prime-seg-item-pad-y: var(--prime-sys-size-control-xs-buttonPaddingY)",
    );
    expect(sBlock).not.toContain("* 0.8");
    expect(sBlock).not.toContain("* 0.85");

    expect(mBlock).toContain("--prime-sys-size-control-s-height");
    expect(lBlock).toContain("--prime-sys-size-control-m-height");
    expect(xlBlock).toContain("--prime-sys-size-control-l-height");
  });
});

describe("SegmentedControl", () => {
  it("renders with radiogroup and radio roles", () => {
    renderSegmented();
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("sets aria-checked correctly on initial render", () => {
    renderSegmented();
    expect(screen.getByRole("radio", { name: "Option A" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Option B" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("selects item on click", () => {
    renderSegmented();
    fireEvent.click(screen.getByRole("radio", { name: "Option B" }));
    expect(screen.getByRole("radio", { name: "Option B" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Option A" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("navigates forward with ArrowRight", () => {
    renderSegmented();
    const itemA = screen.getByRole("radio", { name: "Option A" });
    itemA.focus();
    fireEvent.keyDown(itemA, { key: "ArrowRight" });
    expect(screen.getByRole("radio", { name: "Option B" })).toHaveAttribute("aria-checked", "true");
  });

  it("navigates backward with ArrowLeft", () => {
    renderSegmented();
    const itemB = screen.getByRole("radio", { name: "Option B" });
    fireEvent.click(itemB);
    itemB.focus();
    fireEvent.keyDown(itemB, { key: "ArrowLeft" });
    expect(screen.getByRole("radio", { name: "Option A" })).toHaveAttribute("aria-checked", "true");
  });

  it("wraps around on ArrowRight from last item", () => {
    renderSegmented();
    const itemC = screen.getByRole("radio", { name: "Option C" });
    fireEvent.click(itemC);
    itemC.focus();
    fireEvent.keyDown(itemC, { key: "ArrowRight" });
    expect(screen.getByRole("radio", { name: "Option A" })).toHaveAttribute("aria-checked", "true");
  });

  it("skips disabled items during keyboard navigation", () => {
    render(
      <SegmentedControl.Root defaultValue="a">
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b" disabled>
          B
        </SegmentedControl.Item>
        <SegmentedControl.Item value="c">C</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    const itemA = screen.getByRole("radio", { name: "A" });
    itemA.focus();
    fireEvent.keyDown(itemA, { key: "ArrowRight" });
    expect(screen.getByRole("radio", { name: "C" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "B" })).toHaveAttribute("aria-checked", "false");
  });

  it("does not select a disabled item on click", () => {
    render(
      <SegmentedControl.Root defaultValue="a">
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b" disabled>
          B
        </SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    fireEvent.click(screen.getByRole("radio", { name: "B" }));
    expect(screen.getByRole("radio", { name: "A" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "B" })).toHaveAttribute("aria-checked", "false");
  });

  it("sets data-disabled on disabled item", () => {
    render(
      <SegmentedControl.Root defaultValue="a">
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b" disabled>
          B
        </SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    expect(screen.getByRole("radio", { name: "B" })).toHaveAttribute("data-disabled", "true");
    expect(screen.getByRole("radio", { name: "A" })).not.toHaveAttribute("data-disabled");
  });

  it("disables all items when Root is disabled", () => {
    renderSegmented({ disabled: true });
    const items = screen.getAllByRole("radio");
    for (const item of items) {
      expect(item).toHaveAttribute("data-disabled", "true");
    }
  });

  it("controlled mode: calls onValueChange and stays controlled", () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl.Root value="a" onValueChange={onValueChange}>
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    fireEvent.click(screen.getByRole("radio", { name: "B" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(screen.getByRole("radio", { name: "A" })).toHaveAttribute("aria-checked", "true");
  });

  it("uncontrolled mode: updates internally", () => {
    render(
      <SegmentedControl.Root defaultValue="a">
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    fireEvent.click(screen.getByRole("radio", { name: "B" }));
    expect(screen.getByRole("radio", { name: "B" })).toHaveAttribute("aria-checked", "true");
  });

  it("Icon renders with aria-hidden", () => {
    render(
      <SegmentedControl.Root defaultValue="light">
        <SegmentedControl.Item value="light">
          <SegmentedControl.Icon data-testid="icon-light">☀️</SegmentedControl.Icon>
          Light
        </SegmentedControl.Item>
        <SegmentedControl.Item value="dark">
          <SegmentedControl.Icon data-testid="icon-dark">🌙</SegmentedControl.Icon>
          Dark
        </SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    expect(screen.getByTestId("icon-light")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("icon-dark")).toHaveAttribute("aria-hidden", "true");
  });
});
