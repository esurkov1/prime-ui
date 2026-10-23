import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { Icon } from "@/icons";
import type { ControlSize } from "@/internal/states";

import { ProgressCircle } from "./ProgressCircle";

describe("ProgressCircle", () => {
  it("renders", () => {
    render(<ProgressCircle value={40} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("sets aria-valuenow, aria-valuemin, aria-valuemax", () => {
    render(<ProgressCircle value={25} max={80} />);
    const el = screen.getByRole("progressbar");
    expect(el).toHaveAttribute("aria-valuenow", "25");
    expect(el).toHaveAttribute("aria-valuemin", "0");
    expect(el).toHaveAttribute("aria-valuemax", "80");
  });

  it("puts aria-label on the progressbar, not the root", () => {
    const { container } = render(<ProgressCircle value={10} aria-label="Task completion" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-label", "Task completion");
    expect(container.firstChild).not.toHaveAttribute("aria-label");
  });

  it("forwards ref and native attributes to the root", () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(<ProgressCircle ref={ref} value={10} data-testid="ring" />);
    expect(ref.current).toBe(container.firstChild);
    expect(container.firstChild).toHaveAttribute("data-testid", "ring");
  });

  it.each([0, 50, 100] as const)("value %s is reflected in aria-valuenow", (value) => {
    render(<ProgressCircle value={value} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", String(value));
  });

  it("2xl draws a 96 ring and keeps the xl tier for its legend", () => {
    render(
      <ProgressCircle
        size="2xl"
        segments={[
          { value: 3, label: "Сырьё" },
          { value: 1, label: "Запас" },
        ]}
        legend
      />,
    );
    expect(screen.getByRole("group").closest('[data-size="2xl"]')).not.toBeNull();
    expect(screen.getByText("Сырьё").closest("ul")).toHaveAttribute("data-size", "l");
  });

  it.each(["s", "m", "l", "xl"] as const)("sets data-size=%s", (size: ControlSize) => {
    render(<ProgressCircle value={50} size={size} />);
    expect(screen.getByRole("progressbar").closest("[data-size]")).toHaveAttribute(
      "data-size",
      size,
    );
  });

  it("defaults data-tone to accent and reflects tone", () => {
    const { rerender } = render(<ProgressCircle value={50} />);
    const root = () => screen.getByRole("progressbar").closest("[data-size]");
    expect(root()).toHaveAttribute("data-tone", "accent");
    rerender(<ProgressCircle value={50} tone="danger" />);
    expect(root()).toHaveAttribute("data-tone", "danger");
  });

  it("renders children text inside", () => {
    render(<ProgressCircle value={75}>75%</ProgressCircle>);
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("does not render inner text at size xs, keeps aria-valuetext", () => {
    render(
      <ProgressCircle value={75} size="xs">
        75%
      </ProgressCircle>,
    );
    expect(screen.queryByText("75%")).not.toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "75%");
  });

  it("renders a short compact text at size s, hidden from assistive tech, spoken as aria-valuetext", () => {
    render(
      <ProgressCircle value={60} size="s" aria-label="Срок аренды">
        18 д
      </ProgressCircle>,
    );
    expect(screen.getByText("18 д").closest("[aria-hidden]")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "18 д");
  });

  it("merges className on root", () => {
    render(<ProgressCircle value={5} className="custom-circle" />);
    expect(screen.getByRole("progressbar").closest("[data-size]")).toHaveClass("custom-circle");
  });

  it("supports every tone in value mode", () => {
    render(<ProgressCircle value={50} tone="info" />);
    expect(screen.getByRole("progressbar").closest("[data-size]")).toHaveAttribute(
      "data-tone",
      "info",
    );
  });

  it("draws from the kit ring at the data weight", () => {
    render(<ProgressCircle value={40} />);
    const ring = screen.getByRole("progressbar");
    expect(ring).toHaveAttribute("data-weight", "data");
    expect(ring.style.getPropertyValue("--ring-value")).toBe("0.4");
    expect(ring).not.toHaveAttribute("data-spin");
  });

  it("value null: under way, share unknown — no aria-valuenow, a quarter arc that turns", () => {
    render(<ProgressCircle value={null} aria-label="Импорт счетов" />);
    const ring = screen.getByRole("progressbar", { name: "Импорт счетов" });
    expect(ring).not.toHaveAttribute("aria-valuenow");
    expect(ring).toHaveAttribute("data-spin", "true");
    expect(ring.style.getPropertyValue("--ring-value")).toBe("0.25");
  });

  it("spin: the ring turns at any share and keeps its value", () => {
    render(<ProgressCircle value={30} max={60} spin aria-label="Синхронизация" />);
    const ring = screen.getByRole("progressbar");
    expect(ring).toHaveAttribute("aria-valuenow", "30");
    expect(ring).toHaveAttribute("data-spin", "true");
    expect(ring.style.getPropertyValue("--ring-value")).toBe("0.5");
  });

  it("tone inherit takes the host's color", () => {
    render(<ProgressCircle value={50} tone="inherit" />);
    expect(screen.getByRole("progressbar").closest("[data-size]")).toHaveAttribute(
      "data-tone",
      "inherit",
    );
  });

  it("an icon in the centre is shown from s; a new icon cross-fades in (one glyph at rest)", () => {
    const { container, rerender } = render(
      <ProgressCircle value={null} size="s" aria-label="Импорт">
        <Icon name="action.download" />
      </ProgressCircle>,
    );
    // The ring and the icon.
    expect(container.querySelectorAll("svg")).toHaveLength(2);
    rerender(
      <ProgressCircle value={null} size="s" aria-label="Импорт">
        <Icon name="status.failed" />
      </ProgressCircle>,
    );
    // The glyph changed: the incoming layer enters (reduced motion in tests: nothing leaves).
    expect(container.querySelector("[data-entering]")).not.toBeNull();
    expect(container.querySelectorAll("svg")).toHaveLength(2);
    rerender(
      <ProgressCircle value={null} size="xs" aria-label="Импорт">
        <Icon name="status.failed" />
      </ProgressCircle>,
    );
    expect(container.querySelectorAll("svg")).toHaveLength(1);
  });

  describe("segments", () => {
    it("joins the centre text to the name of a named ring", () => {
      render(
        <ProgressCircle
          aria-label="Хранилище"
          segments={[
            { label: "Видео", value: 40 },
            { label: "Документы", value: 32 },
          ]}
          max={100}
        >
          72%
        </ProgressCircle>,
      );
      expect(screen.getByRole("group", { name: "Хранилище, 72%" })).toBeInTheDocument();
    });

    const tasks = [
      { value: 30, label: "Errors", tone: "danger" as const },
      { value: 70, label: "OK", tone: "success" as const },
    ];

    it("renders a group named by the distribution instead of a progressbar", () => {
      render(<ProgressCircle segments={tasks} />);
      expect(screen.getByRole("group", { name: "Errors: 30%, OK: 70%" })).toBeInTheDocument();
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("names the group by label and describes it by the distribution of max", () => {
      render(<ProgressCircle segments={tasks} max={200} aria-label="Batch" />);
      const group = screen.getByRole("group", { name: "Batch" });
      expect(group).toHaveAccessibleDescription("Errors: 15%, OK: 35%");
    });

    it("draws one arc per non-empty part with its tone and caps when not closed", () => {
      const { container } = render(
        <ProgressCircle segments={[...tasks, { value: 0 }]} max={200} />,
      );
      const toned = container.querySelectorAll("circle[data-tone]");
      // two arcs + two caps
      expect(toned).toHaveLength(4);
      expect(toned[0]).toHaveAttribute("data-tone", "danger");
    });

    it("closes the ring without caps when the parts fill the scale", () => {
      const { container } = render(<ProgressCircle segments={tasks} />);
      expect(container.querySelectorAll("circle[data-tone]")).toHaveLength(2);
    });

    it("paints arcs and caps by a palette color", () => {
      const { container } = render(
        <ProgressCircle
          segments={[
            { value: 30, label: "Сайт", color: "purple" },
            { value: 20, label: "Звонки", tone: "warning" },
          ]}
          max={100}
        />,
      );
      expect(container.querySelectorAll("circle[data-color='purple']")).toHaveLength(2);
      expect(container.querySelectorAll("circle[data-tone='warning']")).toHaveLength(2);
    });

    it("puts a legend beside the ring and describes the group with it", () => {
      const { container } = render(
        <ProgressCircle segments={tasks} legend aria-label="Проверки" size="xl" />,
      );
      const root = container.firstChild as HTMLElement;
      expect(root).toHaveAttribute("data-legend", "true");
      expect(screen.getAllByRole("listitem")[1]).toHaveTextContent("OK7070%");
      expect(screen.getByRole("group", { name: "Проверки" })).toHaveAccessibleDescription(
        /Errors.*30%.*OK.*70%/,
      );
    });

    it("shows a skeleton ring while loading and hides the inner text", () => {
      const { container } = render(
        <ProgressCircle segments={[]} legend loading aria-label="Проверки" size="xl">
          100
        </ProgressCircle>,
      );
      expect(container.firstChild).toHaveAttribute("aria-busy", "true");
      expect(screen.queryByRole("group")).not.toBeInTheDocument();
      expect(screen.queryByText("100")).not.toBeInTheDocument();
    });

    it("sets the gap mode and describes empty lists with labels", () => {
      render(<ProgressCircle segments={[]} segmentGap="hairline" labels={{ empty: "Пусто" }} />);
      const group = screen.getByRole("group", { name: "Пусто" });
      expect(group).toHaveAttribute("data-segment-gap", "hairline");
    });
  });

  it("value mode takes a palette color and a tinted track, set on the root", () => {
    const { container } = render(
      <ProgressCircle value={0} color="yellow" track="tinted" aria-label="Бронь" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-color", "yellow");
    expect(root).toHaveAttribute("data-track", "tinted");
    expect(root).not.toHaveAttribute("data-tone");
  });

  it("tone keeps the surface track by default", () => {
    const { container } = render(<ProgressCircle value={30} tone="success" aria-label="План" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-tone", "success");
    expect(root).not.toHaveAttribute("data-track");
    expect(root).not.toHaveAttribute("data-color");
  });

  describe("variant", () => {
    const svgOf = (container: HTMLElement) => container.querySelector("svg") as SVGSVGElement;

    it("steps: max cells, the arc stops on a whole cell", () => {
      const { container } = render(
        <ProgressCircle variant="steps" value={2.6} max={4} aria-label="Шаги" />,
      );
      expect(container.firstElementChild).toHaveAttribute("data-variant", "steps");
      expect(svgOf(container)).toHaveAttribute("data-cells", "steps");
      expect(svgOf(container).style.getPropertyValue("--ring-value")).toBe("0.75");
      expect(screen.getByRole("progressbar", { name: "Шаги" })).toHaveAttribute(
        "aria-valuenow",
        "2.6",
      );
    });

    it("ticks: the tier's tick count, the share rounded to a whole tick", () => {
      const { container } = render(
        <ProgressCircle variant="ticks" size="m" value={50} aria-label="Готово" />,
      );
      expect(svgOf(container)).toHaveAttribute("data-cells", "ticks");
      expect(svgOf(container).style.getPropertyValue("--ring-value")).toBe("0.5");
      const cut = svgOf(container).querySelector("mask circle") as SVGCircleElement;
      const [dash, gap] = cut.style.strokeDasharray.split(/[ ,]+/).map(Number);
      expect(100 / (dash + gap)).toBeCloseTo(24);
    });

    it("ticks with segments: flat arcs on whole ticks, the free rest stays track", () => {
      render(
        <ProgressCircle
          variant="ticks"
          size="m"
          max={24}
          aria-label="Лиды"
          segments={[
            { value: 8, label: "Сайт", color: "blue" },
            { value: 4, label: "Звонки", color: "orange" },
          ]}
        />,
      );
      const group = screen.getByRole("group", { name: "Лиды" });
      const arcs = [...group.querySelectorAll("g > circle[data-color]")] as SVGCircleElement[];
      expect(arcs.map((a) => a.getAttribute("data-color"))).toEqual(["blue", "orange"]);
      // 24 ticks of 100/24: 8 + 4 ticks, the second starting where the first ends.
      expect(Number(arcs[1].style.strokeDashoffset)).toBeCloseTo(100 - 4 * (100 / 24));
      expect(Number.parseFloat(arcs[1].style.rotate)).toBeCloseTo(120);
      expect(group.querySelectorAll("g > circle:not([data-color]):not([data-tone])")).toHaveLength(
        1,
      );
    });
  });
});
