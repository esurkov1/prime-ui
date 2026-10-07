import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

// The outer height of the control equals the control height of the same tier (it lines up with
// Button / Input). Segment height is derived as height − 2 × track padding.
describe("SegmentedControl — размеры (регрессия CSS)", () => {
  it("каждый ярус берёт высоту контрола своего же яруса", () => {
    const css = readFileSync(segmentedModuleCssPath, "utf8");

    for (const tier of ["xs", "s", "m", "l", "xl"] as const) {
      const block =
        css.match(new RegExp(`\\.root\\[data-size="${tier}"\\]\\s*\\{[^}]*\\}`, "s"))?.[0] ?? "";
      expect(block).toContain(`--seg-control-height: var(--prime-control-${tier}-height)`);
    }
    expect(css).toContain("height: var(--seg-control-height);");
    expect(css).toContain("--seg-height: calc(var(--seg-control-height) - 2 * var(--seg-pad))");
    expect(css).toContain("--seg-item-radius: calc(var(--seg-radius) - var(--seg-pad))");
    expect(css).not.toContain("prime-sys");
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
    expect(screen.getByRole("radio", { name: "Option A" })).toHaveAttribute(
      "data-state",
      "checked",
    );
    expect(screen.getByRole("radio", { name: "Option B" })).toHaveAttribute(
      "data-state",
      "unchecked",
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

describe("SegmentedControl.Item — passthrough and icon-only", () => {
  it("forwards extra button props and composes onClick", () => {
    const onClick = vi.fn();
    const onValueChange = vi.fn();
    render(
      <SegmentedControl.Root defaultValue="a" onValueChange={onValueChange}>
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="grid" aria-label="Сетка" title="Сетка" onClick={onClick}>
          <SegmentedControl.Icon>
            <svg />
          </SegmentedControl.Icon>
        </SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    const item = screen.getByRole("radio", { name: "Сетка" });
    expect(item).toHaveAttribute("title", "Сетка");
    expect(item).toHaveAttribute("data-icon-only", "true");
    expect(screen.getByRole("radio", { name: "A" })).not.toHaveAttribute("data-icon-only");
    fireEvent.click(item);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(item).toHaveAttribute("aria-checked", "true");
  });
});

describe("SegmentedControl — roving focus and keyboard", () => {
  it("only the selected item is a tab stop", () => {
    renderSegmented();
    const [a, b, c] = screen.getAllByRole("radio");
    expect(a).toHaveAttribute("tabindex", "0");
    expect(b).toHaveAttribute("tabindex", "-1");
    expect(c).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("radiogroup")).not.toHaveAttribute("tabindex");
  });

  it("without a selection the first enabled item is the tab stop", () => {
    render(
      <SegmentedControl.Root aria-label="Вид">
        <SegmentedControl.Item value="a" disabled>
          A
        </SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    expect(screen.getByRole("radio", { name: "B" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("radio", { name: "A" })).toHaveAttribute("tabindex", "-1");
  });

  it("arrow keys move focus and selection together and call onValueChange", () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl.Root defaultValue="a" onValueChange={onValueChange}>
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
        <SegmentedControl.Item value="c">C</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    const a = screen.getByRole("radio", { name: "A" });
    a.focus();
    fireEvent.keyDown(a, { key: "ArrowDown" });
    const b = screen.getByRole("radio", { name: "B" });
    expect(b).toHaveFocus();
    expect(b).toHaveAttribute("tabindex", "0");
    expect(a).toHaveAttribute("tabindex", "-1");
    expect(onValueChange).toHaveBeenLastCalledWith("b");

    fireEvent.keyDown(b, { key: "End" });
    expect(screen.getByRole("radio", { name: "C" })).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith("c");

    fireEvent.keyDown(screen.getByRole("radio", { name: "C" }), { key: "Home" });
    expect(a).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith("a");
  });

  it("does not call onValueChange when the selected item is clicked again", () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl.Root defaultValue="a" onValueChange={onValueChange}>
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    fireEvent.click(screen.getByRole("radio", { name: "A" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe("SegmentedControl — thumb and parts", () => {
  it("renders one aria-hidden thumb before the items", () => {
    renderSegmented();
    const group = screen.getByRole("radiogroup");
    const thumb = group.firstElementChild?.firstElementChild;
    expect(thumb).toHaveAttribute("aria-hidden", "true");
    expect(thumb).not.toHaveAttribute("role");
  });

  it("Count renders a badge inside the segment name", () => {
    render(
      <SegmentedControl.Root defaultValue="all" size="m">
        <SegmentedControl.Item value="all">
          Все
          <SegmentedControl.Count color="blue">12</SegmentedControl.Count>
        </SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    const count = screen.getByText("12");
    expect(count).toHaveAttribute("data-color", "blue");
    expect(count).toHaveAttribute("data-tier", "s");
    expect(screen.getByRole("radio", { name: /^Все\s*12$/ })).toBeInTheDocument();
  });

  it("sets data-full-width on the root", () => {
    render(
      <SegmentedControl.Root defaultValue="a" fullWidth>
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    expect(screen.getByRole("radiogroup")).toHaveAttribute("data-full-width", "true");
  });
});

describe("SegmentedControl — two-line segments", () => {
  it("names the segment by label + count and describes it by the description", () => {
    render(
      <SegmentedControl.Root defaultValue="fleet" aria-label="Автопарк">
        <SegmentedControl.Item value="fleet">
          <SegmentedControl.Label>В парке</SegmentedControl.Label>
          <SegmentedControl.Count color="blue">28</SegmentedControl.Count>
          <SegmentedControl.Description>
            <strong>1</strong> в подготовке
          </SegmentedControl.Description>
        </SegmentedControl.Item>
        <SegmentedControl.Item value="archive">Архив</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    const item = screen.getByRole("radio", { name: "В парке 28" });
    expect(item).toHaveAttribute("data-two-line", "true");
    expect(item).toHaveAccessibleDescription("1 в подготовке");
    const plain = screen.getByRole("radio", { name: "Архив" });
    expect(plain).not.toHaveAttribute("data-two-line");
    expect(plain).not.toHaveAttribute("aria-describedby");
  });
});

describe("SegmentedControl — цвет пунктов", () => {
  function renderStatus() {
    return render(
      <SegmentedControl.Root defaultValue="ok" aria-label="Состояние">
        <SegmentedControl.Item value="ok" color="green">
          Исправен
        </SegmentedControl.Item>
        <SegmentedControl.Item value="service" color="orange">
          Нужно ТО
        </SegmentedControl.Item>
        <SegmentedControl.Item value="plain">Без цвета</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
  }

  it("пункт с color получает точку и data-color; без color — ни того, ни другого", () => {
    renderStatus();
    const ok = screen.getByRole("radio", { name: "Исправен" });
    expect(ok).toHaveAttribute("data-color", "green");
    expect(ok.querySelector('[class*="dot"]')).not.toBeNull();
    const plain = screen.getByRole("radio", { name: "Без цвета" });
    expect(plain).not.toHaveAttribute("data-color");
    expect(plain.querySelector('[class*="dot"]')).toBeNull();
  });

  it("бегунок берёт цвет выбранного пункта и сбрасывает его на нейтральный", async () => {
    const { container } = renderStatus();
    const pill = container.querySelector('[class*="pill"]') as HTMLElement;
    expect(pill).toHaveAttribute("data-color", "green");
    fireEvent.click(screen.getByRole("radio", { name: "Нужно ТО" }));
    await waitFor(() => expect(pill).toHaveAttribute("data-color", "orange"));
    fireEvent.click(screen.getByRole("radio", { name: "Без цвета" }));
    await waitFor(() => expect(pill).not.toHaveAttribute("data-color"));
  });

  it("цвет бегунка анимируется тем же токеном движения, что и положение", () => {
    const css = readFileSync(segmentedModuleCssPath, "utf8");
    const rule = css.slice(css.indexOf('.pill[data-animate="true"] {'));
    const block = rule.slice(0, rule.indexOf("}"));
    expect(block).toMatch(/background-color var\(--prime-motion-duration-base\)/);
    expect(block).toMatch(/box-shadow var\(--prime-motion-duration-base\)/);
  });
});
