import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cssRule, cssValue } from "@/test/css";
import { withMotion } from "@/test/motion";

import { ProgressBar } from "./ProgressBar";

const CSS = "src/components/progress-bar/ProgressBar.module.css";

describe("ProgressBar", () => {
  it("renders", () => {
    render(<ProgressBar value={40} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("sets data-size on root default m", () => {
    const { container } = render(<ProgressBar value={40} />);
    expect(container.firstElementChild).toHaveAttribute("data-size", "m");
  });

  it("takes the host tier without its own size", () => {
    const { container } = render(
      <ControlSizeProvider value="s">
        <ProgressBar value={40} />
      </ControlSizeProvider>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-size", "s");
  });

  it("sets data-size from size prop", () => {
    const { container } = render(<ProgressBar value={40} size="xl" />);
    expect(container.firstElementChild).toHaveAttribute("data-size", "xl");
  });

  it("sets value and max attributes on native progress", () => {
    render(<ProgressBar value={30} max={200} />);
    const el = screen.getByRole("progressbar");
    expect(el).toHaveAttribute("value", "30");
    expect(el).toHaveAttribute("max", "200");
  });

  it("associates visible label with progressbar via aria-labelledby", () => {
    render(<ProgressBar value={10} label="Upload progress" />);
    const bar = screen.getByRole("progressbar");
    const labelEl = screen.getByText("Upload progress");
    expect(bar).toHaveAttribute("aria-labelledby", labelEl.id);
  });

  it.each([
    [0, "0"],
    [50, "50"],
    [100, "100"],
  ] as const)("value %s maps to progress value %s", (value, expected) => {
    render(<ProgressBar value={value} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("value", expected);
  });

  it("defaults data-tone to accent and reflects tone", () => {
    const { container, rerender } = render(<ProgressBar value={40} />);
    const root = () => container.firstElementChild;
    expect(root()).toHaveAttribute("data-tone", "accent");
    rerender(<ProgressBar value={40} tone="danger" />);
    expect(root()).toHaveAttribute("data-tone", "danger");
  });

  it("draws the fill from the clamped value ratio, hidden from assistive tech", () => {
    const { container, rerender } = render(<ProgressBar value={30} max={200} />);
    const fill = () => container.querySelector<HTMLElement>("span[aria-hidden='true'][style]");
    expect(fill()?.style.getPropertyValue("--pb-ratio")).toBe("0.15");
    rerender(<ProgressBar value={500} max={200} />);
    expect(fill()?.style.getPropertyValue("--pb-ratio")).toBe("1");
    expect(screen.getAllByRole("progressbar")).toHaveLength(1);
  });

  it("merges className on root", () => {
    const { container } = render(<ProgressBar value={5} className="custom-bar" />);
    expect(container.firstElementChild).toHaveClass("custom-bar");
  });

  it("reflects tone in value mode", () => {
    const { container } = render(<ProgressBar value={10} tone="info" />);
    expect(container.firstChild).toHaveAttribute("data-tone", "info");
  });

  it("forwards ref and native attributes to the root", () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(<ProgressBar ref={ref} value={10} data-testid="bar" />);
    expect(ref.current).toBe(container.firstChild);
    expect(container.firstChild).toHaveAttribute("data-testid", "bar");
  });

  it("names an unlabelled bar with aria-label", () => {
    render(<ProgressBar value={10} aria-label="Импорт" />);
    expect(screen.getByRole("progressbar", { name: "Импорт" })).toBeInTheDocument();
  });

  describe("segments", () => {
    const tasks = [
      { value: 30, label: "Errors", tone: "danger" as const },
      { value: 25, label: "Pending", tone: "warning" as const },
      { value: 45, label: "OK", tone: "success" as const },
    ];

    it("renders a group named by the distribution", () => {
      render(<ProgressBar segments={tasks} />);
      expect(
        screen.getByRole("group", { name: "Errors: 30%, Pending: 25%, OK: 45%" }),
      ).toBeInTheDocument();
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("measures shares against max and leaves the rest as track", () => {
      const { container } = render(
        <ProgressBar segments={[{ value: 20, label: "A" }]} max={80} showValue />,
      );
      expect(screen.getByRole("group", { name: "A: 25%" })).toBeInTheDocument();
      expect(screen.getByText("25%")).toBeInTheDocument();
      const rest = container.querySelector<HTMLElement>("[role='group'] > span:last-child");
      expect(rest?.style.flexGrow).toBe("60");
    });

    it("clamps negative weights to zero", () => {
      render(<ProgressBar segments={[{ value: -10 }, { value: 10 }]} />);
      expect(screen.getByRole("group", { name: "0%, 100%" })).toBeInTheDocument();
    });

    it("describes empty distributions with labels", () => {
      const { rerender } = render(<ProgressBar segments={[{ value: 0 }]} />);
      expect(screen.getByRole("group", { name: "Все сегменты пусты" })).toBeInTheDocument();
      rerender(<ProgressBar segments={[]} labels={{ empty: "No data" }} />);
      expect(screen.getByRole("group", { name: "No data" })).toBeInTheDocument();
    });

    it("defaults segment tone to accent and sets the gap mode", () => {
      const { container } = render(<ProgressBar segments={[{ value: 1 }]} segmentGap="hairline" />);
      expect(container.querySelector("[data-tone]")).toHaveAttribute("data-tone", "accent");
      expect(screen.getByRole("group")).toHaveAttribute("data-segment-gap", "hairline");
    });

    it("labels the group with the visible label and describes it with the distribution", () => {
      render(
        <ProgressBar
          label="Batch status"
          segments={[
            { value: 50, label: "A" },
            { value: 50, label: "B" },
          ]}
        />,
      );
      const group = screen.getByRole("group", { name: "Batch status" });
      expect(group).toHaveAccessibleDescription("A: 50%, B: 50%");
    });
  });

  describe("cells", () => {
    const scale = (container: HTMLElement) =>
      container.querySelector<HTMLElement>("[style*='--pb-cells']") as HTMLElement;
    const fillCells = (container: HTMLElement) =>
      [...(scale(container).lastElementChild?.firstElementChild?.children ?? [])] as HTMLElement[];
    const rows = (container: HTMLElement) => [
      ...(scale(container).firstElementChild?.children ?? []),
      ...fillCells(container),
    ];
    const front = (container: HTMLElement) => [
      scale(container).style.getPropertyValue("--pb-filled"),
      scale(container).style.getPropertyValue("--pb-cells"),
    ];

    it("steps: max cells, the value rounds to a whole cell, the native progress stays", () => {
      const { container } = render(
        <ProgressBar variant="steps" value={2.6} max={4} aria-label="Надёжность" />,
      );
      expect(container.firstElementChild).toHaveAttribute("data-variant", "steps");
      expect(front(container)).toEqual(["3", "4"]);
      expect(rows(container)).toHaveLength(8);
      const progress = screen.getByRole("progressbar", { name: "Надёжность" });
      expect(progress).toHaveAttribute("max", "4");
    });

    it("steps: clamps the cell count to 2…12", () => {
      const { container, rerender } = render(
        <ProgressBar variant="steps" value={1} max={1} aria-label="a" />,
      );
      expect(front(container)).toEqual(["2", "2"]);
      rerender(<ProgressBar variant="steps" value={1} max={40} aria-label="a" />);
      expect(front(container)).toEqual(["0", "12"]);
    });

    it("moves one front for every change: no cell carries its own delay", () => {
      const { container, rerender } = render(
        <ProgressBar variant="steps" value={1} max={4} aria-label="a" />,
      );
      rerender(<ProgressBar variant="steps" value={4} max={4} aria-label="a" />);
      expect(front(container)).toEqual(["4", "4"]);
      rerender(<ProgressBar variant="steps" value={0} max={4} aria-label="a" />);
      expect(front(container)).toEqual(["0", "4"]);
      for (const cell of rows(container)) expect(cell.getAttribute("style")).toBeNull();
      expect(cssValue(cssRule(CSS, ".reveal"), "transition")).toBe(
        "translate var(--prime-motion-duration-slow) var(--prime-motion-easing-standard)",
      );
    });

    it("ticks: as many as the width holds at the tier's pitch, filled to the share", () => {
      const spy = vi
        .spyOn(HTMLElement.prototype, "getBoundingClientRect")
        .mockReturnValue({ width: 350, height: 40 } as DOMRect);
      try {
        const { container } = render(
          <ProgressBar variant="ticks" value={50} aria-label="Совпадение" />,
        );
        // m: track 6, tick 4 + gap 3 → (350 + 3) / 7 = 50 ticks.
        expect(front(container)).toEqual(["25", "50"]);
        expect(screen.getByRole("progressbar", { name: "Совпадение" })).toBeInTheDocument();
      } finally {
        spy.mockRestore();
      }
    });

    it("ticks with segments: whole ticks per part, the free rest stays track", () => {
      const { container } = render(
        <ProgressBar
          variant="ticks"
          max={24}
          aria-label="Лиды"
          segments={[
            { value: 6, label: "Сайт", color: "blue" },
            { value: 3, label: "Звонки", color: "orange" },
          ]}
        />,
      );
      expect(screen.getByRole("group", { name: "Лиды" })).toBe(scale(container));
      expect(front(container)).toEqual(["5", "12"]);
      const colors = fillCells(container).map((c) => c.getAttribute("data-color"));
      expect(colors.slice(0, 5)).toEqual(["blue", "blue", "blue", "orange", "orange"]);
    });

    it("a cell the front leaves keeps its fill while the front passes it", () => {
      const parts = (a: number) => [
        { value: a, label: "Сайт", color: "blue" as const },
        { value: 12 - a, label: "Звонки", color: "orange" as const },
      ];
      const { container, rerender } = render(
        <ProgressBar variant="ticks" max={24} aria-label="Лиды" segments={parts(6)} />,
      );
      rerender(<ProgressBar variant="ticks" max={24} aria-label="Лиды" segments={[]} />);
      expect(front(container)).toEqual(["0", "12"]);
      expect(fillCells(container)[0]).toHaveAttribute("data-color", "blue");
      expect(fillCells(container)[5]).toHaveAttribute("data-color", "orange");
    });

    it("loading: Skeleton cells in the scale's geometry", () => {
      const { container } = render(
        <ProgressBar variant="steps" value={2} max={5} aria-label="a" loading />,
      );
      expect(container.querySelectorAll("[data-shape='block']")).toHaveLength(5);
    });
  });

  describe("category colors", () => {
    it("paints a part by its palette color and keeps tones on the others", () => {
      const { container } = render(
        <ProgressBar
          aria-label="Источники"
          segments={[
            { value: 3, label: "Сайт", color: "teal" },
            { value: 1, label: "Готово", tone: "success" },
          ]}
        />,
      );
      const parts = container.querySelectorAll("[title]");
      expect(parts[0]).toHaveAttribute("data-color", "teal");
      expect(parts[0]).not.toHaveAttribute("data-tone");
      expect(parts[1]).toHaveAttribute("data-tone", "success");
    });
  });

  describe("legend", () => {
    const sources = [
      { value: 600, label: "Сайт", color: "blue" as const },
      { value: 400, label: "Звонки", color: "orange" as const },
    ];

    it("lists color · name · value · share and describes the group with it", () => {
      render(
        <ProgressBar
          label="Лиды по источникам"
          segments={sources}
          legend
          formatValue={(v) => `${v} шт.`}
        />,
      );
      const items = screen.getAllByRole("listitem");
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveTextContent("Сайт600 шт.60%");
      const group = screen.getByRole("group", { name: "Лиды по источникам" });
      expect(group).toHaveAccessibleDescription(/Сайт.*600 шт\..*60%/);
    });

    it("renders no legend for an empty distribution", () => {
      render(<ProgressBar aria-label="Пусто" segments={[]} legend />);
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
  });

  describe("rows", () => {
    const cities = [
      { value: 50, label: "Москва" },
      { value: 30, label: "Казань" },
      { value: 20, label: "Пермь" },
    ];
    const shares = () =>
      screen
        .getAllByRole("listitem")
        .map((li) => li.firstElementChild?.lastElementChild?.textContent?.replace("%", ""));
    const ratios = (container: HTMLElement) =>
      [...container.querySelectorAll<HTMLElement>("li [aria-hidden] > span")].map((s) =>
        s.style.getPropertyValue("--pb-ratio"),
      );

    it("a part with href makes the whole row a link; the others stay text", async () => {
      const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
      const user = userEvent.setup();
      render(
        <ProgressBar
          label="Воронка"
          layout="rows"
          segments={[{ ...cities[0], href: "/deals?city=msk", onClick }, cities[1]]}
        />,
      );
      const link = screen.getByRole("link", { name: /Москва/ });
      expect(link).toHaveAttribute("href", "/deals?city=msk");
      expect(screen.getAllByRole("link")).toHaveLength(1);
      expect(link).toContainElement(screen.getByText("Москва"));
      await user.tab();
      expect(link).toHaveFocus();
      await user.keyboard("{Enter}");
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("draws an ordered list named by the label, one row per part", () => {
      render(<ProgressBar label="Топ городов" layout="rows" segments={cities} />);
      const list = screen.getByRole("list", { name: "Топ городов" });
      expect(list.tagName).toBe("OL");
      expect(screen.getAllByRole("listitem")[0]).toHaveTextContent("Москва5050%");
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("scales by the sum, the leader or the first row", () => {
      const { container, rerender } = render(
        <ProgressBar aria-label="a" layout="rows" segments={cities} />,
      );
      expect(shares()).toEqual(["50", "30", "20"]);
      expect(ratios(container)).toEqual(["0.5", "0.3", "0.2"]);

      rerender(<ProgressBar aria-label="a" layout="rows" scale="max" segments={cities} />);
      expect(shares()).toEqual(["50", "30", "20"]);
      expect(ratios(container)).toEqual(["1", "0.6", "0.4"]);

      rerender(<ProgressBar aria-label="a" layout="rows" scale="first" segments={cities} />);
      expect(shares()).toEqual(["100", "60", "40"]);
      expect(ratios(container)).toEqual(["1", "0.6", "0.4"]);
    });

    it("scale own: each row against its own max, the root max as the default", () => {
      const fleet = [
        { value: 34, max: 40, label: "Газель Next" },
        { value: 18, label: "Валдай" },
      ];
      const { container } = render(
        <ProgressBar aria-label="a" layout="rows" scale="own" max={30} segments={fleet} />,
      );
      expect(shares()).toEqual(["85", "60"]);
      expect(ratios(container)).toEqual(["0.85", "0.6"]);
      expect(screen.getAllByRole("listitem")[0]).toHaveTextContent("Газель Next3485%");
    });

    it("showShare false: a row shows its value alone", () => {
      render(
        <ProgressBar
          aria-label="Загрузка"
          layout="rows"
          scale="own"
          showShare={false}
          formatValue={(v) => `${v}%`}
          segments={[{ value: 79, label: "Газель Next" }]}
        />,
      );
      expect(screen.getByRole("listitem")).toHaveTextContent(/^Газель Next79%$/);
    });
  });

  describe("loading", () => {
    it("shows a skeleton bar instead of the progress and marks the root busy", () => {
      const { container, rerender } = render(<ProgressBar label="Импорт" value={0} loading />);
      const root = container.firstChild as HTMLElement;
      expect(root).toHaveAttribute("aria-busy", "true");
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.getByText("Импорт")).toBeInTheDocument();
      rerender(<ProgressBar label="Импорт" value={40} />);
      expect(root).not.toHaveAttribute("aria-busy");
      expect(screen.getByRole("progressbar", { name: "Импорт" })).toHaveAttribute("value", "40");
    });

    it("keeps the skeleton as a leaving layer while the data fades in", () => {
      withMotion();
      const { container, rerender } = render(<ProgressBar label="Импорт" value={0} loading />);
      rerender(<ProgressBar label="Импорт" value={40} />);
      const leaving = container.querySelector("[data-state='closed']");
      expect(leaving).toHaveAttribute("aria-hidden", "true");
      expect(leaving?.querySelector("progress")).toBeNull();
      expect(container.querySelector("[data-state='open'] progress")).toBeInTheDocument();
    });

    it("draws legend and row placeholders while loading", () => {
      const { container, rerender } = render(
        <ProgressBar aria-label="a" segments={[]} legend loading />,
      );
      expect(container.querySelectorAll("[aria-hidden='true']").length).toBeGreaterThan(1);
      expect(screen.queryByRole("group")).not.toBeInTheDocument();
      rerender(<ProgressBar aria-label="a" layout="rows" segments={[]} loading />);
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
  });
});
