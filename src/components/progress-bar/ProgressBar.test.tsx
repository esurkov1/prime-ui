import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("renders", () => {
    render(<ProgressBar value={40} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("sets data-size on root default m", () => {
    render(<ProgressBar value={40} />);
    const bar = screen.getByRole("progressbar");
    expect(bar.parentElement).toHaveAttribute("data-size", "m");
  });

  it("sets data-size from size prop", () => {
    render(<ProgressBar value={40} size="xl" />);
    expect(screen.getByRole("progressbar").parentElement).toHaveAttribute("data-size", "xl");
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
    const { rerender } = render(<ProgressBar value={40} />);
    const root = () => screen.getByRole("progressbar").parentElement;
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
    render(<ProgressBar value={5} className="custom-bar" />);
    expect(screen.getByRole("progressbar").parentElement).toHaveClass("custom-bar");
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

  describe("steps", () => {
    const cells = (container: HTMLElement) =>
      [...container.querySelectorAll("[data-steps] > span")] as HTMLElement[];

    it("draws max cells, fills whole ones and keeps the native progress", () => {
      const { container } = render(
        <ProgressBar steps value={2.6} max={4} aria-label="Надёжность" />,
      );
      expect(cells(container)).toHaveLength(4);
      expect(cells(container).map((c) => c.hasAttribute("data-filled"))).toEqual([
        true,
        true,
        true,
        false,
      ]);
      const progress = screen.getByRole("progressbar", { name: "Надёжность" });
      expect(progress).toHaveAttribute("max", "4");
    });

    it("clamps the cell count to 2…12", () => {
      const { container, rerender } = render(
        <ProgressBar steps value={1} max={1} aria-label="a" />,
      );
      expect(cells(container)).toHaveLength(2);
      rerender(<ProgressBar steps value={1} max={40} aria-label="a" />);
      expect(cells(container)).toHaveLength(12);
    });

    it("orders a change from the start when filling and from the end when emptying", () => {
      const { container, rerender } = render(
        <ProgressBar steps value={1} max={4} aria-label="a" />,
      );
      rerender(<ProgressBar steps value={4} max={4} aria-label="a" />);
      const order = () => cells(container).map((c) => c.style.getPropertyValue("--pb-step-order"));
      expect(order()).toEqual(["0", "0", "1", "2"]);
      rerender(<ProgressBar steps value={1} max={4} aria-label="a" />);
      expect(order()).toEqual(["3", "2", "1", "0"]);
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
